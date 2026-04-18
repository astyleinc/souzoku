import { eq, and, desc, sql, ilike } from 'drizzle-orm'
import type { Database } from '../db/client'
import { referralLinks } from '../db/schema/content'
import { professionals, nwCompanies } from '../db/schema/professionals'
import { properties } from '../db/schema/properties'
import { sellerProfiles, users } from '../db/schema/users'
import { authUser } from '../db/schema/auth'
import type { ReferralQuery, ProxyClientCreateInput } from '../schemas/referral'
import { AppError, ERROR_CODE, notFound, conflict } from '../lib/errors'
import { getAuth } from '../lib/auth'
import { logger } from '../lib/logger'
import type { PaginatedResponse } from '@shared/types'

// 全角を含む住所から「都道府県 / 市区町村 / それ以下」を抽出
const splitJapaneseAddress = (full: string): { prefecture: string; city: string; rest: string } => {
  const prefMatch = full.match(/^(東京都|神奈川県)/)
  const prefecture = prefMatch?.[1] ?? ''
  const afterPref = prefecture ? full.slice(prefecture.length) : full
  const cityMatch = afterPref.match(/^(.+?[区市町村])/)
  const city = cityMatch?.[1] ?? ''
  const rest = city ? afterPref.slice(city.length).trim() : afterPref.trim()
  return { prefecture, city, rest }
}

const PROPERTY_TYPE_MAP: Record<string, 'house' | 'land' | 'apartment' | 'other'> = {
  mansion: 'apartment',
  house: 'house',
  land: 'land',
  building: 'other',
}

const randomPassword = (): string => {
  // 16バイトを16進化 → 32文字のランダム文字列（後でパスワード再設定メールが飛ぶ想定）
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const createReferralService = (db: Database) => ({
  // 紹介リンク一覧
  async listLinks(professionalId: string, query: ReferralQuery): Promise<PaginatedResponse<typeof referralLinks.$inferSelect>> {
    const where = eq(referralLinks.professionalId, professionalId)
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db.select()
        .from(referralLinks)
        .where(where)
        .orderBy(desc(referralLinks.createdAt))
        .limit(query.limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(referralLinks)
        .where(where),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    }
  },

  // 紹介リンク作成
  async createLink(professionalId: string, label?: string) {
    const code = Math.random().toString(36).substring(2, 10)

    const result = await db.insert(referralLinks).values({
      professionalId,
      code,
      label,
    }).returning()

    return result[0]
  },

  // 紹介コード検証（公開エンドポイント）
  async validateCode(code: string) {
    const result = await db.select({
      link: referralLinks,
      professional: professionals,
    })
      .from(referralLinks)
      .innerJoin(professionals, eq(referralLinks.professionalId, professionals.id))
      .where(and(eq(referralLinks.code, code), eq(referralLinks.isActive, true)))
      .limit(1)

    if (result.length === 0) {
      throw notFound('紹介リンク')
    }

    // クリック数をインクリメント
    await db.update(referralLinks)
      .set({ clickCount: sql`${referralLinks.clickCount} + 1` })
      .where(eq(referralLinks.code, code))

    return {
      code: result[0].link.code,
      professionalId: result[0].professional.id,
      officeName: result[0].professional.officeName,
      qualificationType: result[0].professional.qualificationType,
    }
  },

  // 紹介クライアント一覧
  async listClients(professionalId: string, query: ReferralQuery): Promise<PaginatedResponse<{
    userId: string
    name: string
    email: string
    createdAt: typeof sellerProfiles.$inferSelect['createdAt']
  }>> {
    const where = eq(sellerProfiles.referredByProfessionalId, professionalId)
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db.select({
        userId: users.id,
        name: users.name,
        email: users.email,
        createdAt: sellerProfiles.createdAt,
      })
        .from(sellerProfiles)
        .innerJoin(users, eq(sellerProfiles.userId, users.id))
        .where(where)
        .orderBy(desc(sellerProfiles.createdAt))
        .limit(query.limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(sellerProfiles)
        .where(where),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    }
  },

  // 紹介クライアント詳細
  async getClientDetail(professionalId: string, clientUserId: string) {
    const clientRows = await db.select({
      userId: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      createdAt: sellerProfiles.createdAt,
    })
      .from(sellerProfiles)
      .innerJoin(users, eq(sellerProfiles.userId, users.id))
      .where(and(
        eq(sellerProfiles.referredByProfessionalId, professionalId),
        eq(users.id, clientUserId),
      ))
      .limit(1)

    if (clientRows.length === 0) {
      throw notFound('クライアント')
    }

    const client = clientRows[0]

    const clientProperties = await db.select({
      id: properties.id,
      title: properties.title,
      status: properties.status,
      referredAt: properties.createdAt,
    })
      .from(properties)
      .where(eq(properties.sellerId, clientUserId))
      .orderBy(desc(properties.createdAt))

    const latest = clientProperties[0]

    return {
      id: client.userId,
      name: client.name,
      email: client.email,
      phone: client.phone ?? '',
      propertyCount: clientProperties.length,
      latestPropertyTitle: latest?.title ?? '',
      latestPropertyStatus: latest?.status ?? 'reviewing',
      referredAt: client.createdAt,
      nwRoute: '直接紹介',
      confirmedRevenue: 0,
      estimatedRevenue: 0,
      properties: clientProperties,
    }
  },

  // 登録直後の紹介コード紐づけ（売主プロフィール upsert）
  // - code 指定時: referralLinks から professional を解決 → sellerProfiles.referredByProfessionalId に保存
  // - コードが無効でも静かに無視（登録導線を塞がない）
  async linkToSeller(userId: string, input: { code?: string; nwCompanyId?: string }) {
    let professionalId: string | undefined

    if (input.code) {
      const linkRows = await db.select({ professionalId: referralLinks.professionalId })
        .from(referralLinks)
        .where(and(eq(referralLinks.code, input.code), eq(referralLinks.isActive, true)))
        .limit(1)
      if (linkRows.length > 0) {
        professionalId = linkRows[0].professionalId
        await db.update(referralLinks)
          .set({ clickCount: sql`${referralLinks.clickCount} + 1` })
          .where(eq(referralLinks.code, input.code))
      }
    }

    const existing = await db.select({ id: sellerProfiles.id })
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, userId))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(sellerProfiles).values({
        userId,
        referralCode: input.code ?? null,
        referredByProfessionalId: professionalId ?? null,
      })
    } else if (professionalId || input.code) {
      await db.update(sellerProfiles)
        .set({
          ...(input.code ? { referralCode: input.code } : {}),
          ...(professionalId ? { referredByProfessionalId: professionalId } : {}),
        })
        .where(eq(sellerProfiles.userId, userId))
    }

    return { linked: Boolean(professionalId), professionalId: professionalId ?? null }
  },

  // 士業による売主の代理登録（売主ユーザー+物件を1リクエストで作成）
  async createProxyClient(professionalId: string, input: ProxyClientCreateInput) {
    // 既存メールアドレス重複チェック
    const existing = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.seller.email))
      .limit(1)
    if (existing.length > 0) {
      throw conflict('このメールアドレスは既に登録されています')
    }

    // NW経路の解決: nwCompanyId 優先、なければ nwRoute 名前で LIKE 検索
    let referralNwCompanyId: string | undefined
    if (input.nwCompanyId) {
      const found = await db.select({ id: nwCompanies.id })
        .from(nwCompanies)
        .where(and(eq(nwCompanies.id, input.nwCompanyId), eq(nwCompanies.isActive, true)))
        .limit(1)
      referralNwCompanyId = found[0]?.id
    } else if (input.nwRoute && input.nwRoute !== 'direct') {
      const matched = await db.select({ id: nwCompanies.id })
        .from(nwCompanies)
        .where(and(eq(nwCompanies.isActive, true), ilike(nwCompanies.name, `%${input.nwRoute}%`)))
        .limit(1)
      referralNwCompanyId = matched[0]?.id
    }

    // BetterAuth 経由でアカウント作成（データベースフックで users レコードも生成される）
    const auth = getAuth()
    let authUserId: string
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: input.seller.email,
          password: randomPassword(),
          name: input.seller.name,
        },
      })
      if (!result?.user?.id) {
        throw new Error('代理登録アカウント作成に失敗しました')
      }
      authUserId = result.user.id
    } catch (err) {
      logger.error('代理登録アカウント作成失敗', { error: err, email: input.seller.email })
      throw new AppError(ERROR_CODE.INTERNAL_ERROR, 'アカウント作成に失敗しました', 500)
    }

    // role を seller に設定
    await db.update(authUser).set({ role: 'seller' }).where(eq(authUser.id, authUserId))

    // app users 行を role/phone/address で補完（BetterAuthフックは role=buyer, name/email のみ）
    const updated = await db.update(users)
      .set({
        role: 'seller',
        phone: input.seller.phone ?? null,
        address: input.seller.address ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.authId, authUserId))
      .returning({ id: users.id })
    if (updated.length === 0) {
      throw new AppError(ERROR_CODE.INTERNAL_ERROR, 'ユーザーレコードの補完に失敗しました', 500)
    }
    const sellerUserId = updated[0].id

    // 売主プロフィールを作成（士業紐づけ）
    await db.insert(sellerProfiles).values({
      userId: sellerUserId,
      referredByProfessionalId: professionalId,
    })

    // 物件作成（住所はフロントの1行入力を分解して保存）
    const { prefecture, city, rest } = splitJapaneseAddress(input.property.address)
    const bidEndAt = new Date(Date.now() + input.property.bidDuration * 24 * 60 * 60 * 1000)

    const propertyResult = await db.insert(properties).values({
      sellerId: sellerUserId,
      propertyType: PROPERTY_TYPE_MAP[input.property.type] ?? 'other',
      title: input.property.title,
      description: input.property.note ?? null,
      prefecture: prefecture || '東京都',
      city: city || '',
      address: rest || input.property.address,
      buildingArea: input.property.area ? Math.round(input.property.area * 10) : null,
      askingPrice: input.property.askingPrice,
      instantPrice: input.property.buyNowPrice ?? null,
      urgency: 'three_months',
      bidEndAt,
      referringProfessionalId: professionalId,
      referralNwCompanyId: referralNwCompanyId ?? null,
      referralChannel: referralNwCompanyId ? 'nw' : 'direct',
      status: 'reviewing',
    }).returning()

    return {
      sellerUserId,
      property: propertyResult[0],
    }
  },

  // 紹介リンク無効化
  async deactivateLink(linkId: string, professionalId: string) {
    const result = await db.update(referralLinks)
      .set({ isActive: false })
      .where(and(eq(referralLinks.id, linkId), eq(referralLinks.professionalId, professionalId)))
      .returning()

    if (result.length === 0) {
      throw notFound('紹介リンク')
    }

    return result[0]
  },

  // 士業が代理登録・紹介リンク発行で選択する有効 NW 一覧
  async listActiveNwCompanies() {
    const rows = await db
      .select({ id: nwCompanies.id, name: nwCompanies.name })
      .from(nwCompanies)
      .where(eq(nwCompanies.isActive, true))
      .orderBy(nwCompanies.name)
    return { items: rows }
  },
})
