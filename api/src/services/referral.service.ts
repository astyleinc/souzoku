import { eq, and, desc, sql } from 'drizzle-orm'
import type { Database } from '../db/client'
import { referralLinks } from '../db/schema/content'
import { professionals } from '../db/schema/professionals'
import { properties } from '../db/schema/properties'
import { sellerProfiles, users } from '../db/schema/users'
import type { ReferralQuery } from '../schemas/referral'
import { notFound } from '../lib/errors'
import type { PaginatedResponse } from '@shared/types'

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
})
