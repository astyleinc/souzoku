import { eq, desc, asc, and, gte, lte, like, sql } from 'drizzle-orm'
import type { Database } from '../db/client'
import { properties, propertyDocuments } from '../db/schema'
import { sellerProfiles } from '../db/schema/users'
import type { CreatePropertyInput, UpdatePropertyInput, PropertyQuery } from '../schemas/property'
import { AppError, ERROR_CODE, notFound } from '../lib/errors'
import { validatePropertyTransition } from '../lib/status-machine'
import { MAX_BID_PERIOD_CHANGES, NOTIFICATION_EVENT } from '@shared/constants'
import type { PaginatedResponse } from '@shared/types'
import { createNotificationService } from './notification.service'

export const createPropertyService = (db: Database) => ({
  // 物件一覧取得
  async list(query: PropertyQuery): Promise<PaginatedResponse<typeof properties.$inferSelect>> {
    const conditions = []

    if (query.prefecture) {
      conditions.push(eq(properties.prefecture, query.prefecture))
    }
    if (query.propertyType) {
      conditions.push(eq(properties.propertyType, query.propertyType))
    }
    if (query.urgency) {
      conditions.push(eq(properties.urgency, query.urgency))
    }
    if (query.minPrice) {
      conditions.push(gte(properties.askingPrice, query.minPrice))
    }
    if (query.maxPrice) {
      conditions.push(lte(properties.askingPrice, query.maxPrice))
    }
    if (query.status) {
      conditions.push(eq(properties.status, query.status as typeof properties.status.enumValues[number]))
    } else if (query.biddingOnly) {
      conditions.push(eq(properties.status, 'bidding'))
    } else if (!query.includeAll) {
      // デフォルト: 公開済み・入札中の物件のみ表示（管理画面以外）
      conditions.push(
        sql`${properties.status} IN ('published', 'bidding', 'published_registering')`,
      )
    }
    if (query.keyword) {
      // LIKEワイルドカード文字をエスケープ
      const escaped = query.keyword.replace(/[%_\\]/g, (ch) => `\\${ch}`)
      conditions.push(
        sql`(${properties.title} ILIKE ${`%${escaped}%`} ESCAPE '\\' OR ${properties.address} ILIKE ${`%${escaped}%`} ESCAPE '\\')`,
      )
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const orderBy = (() => {
      switch (query.sort) {
        case 'price_asc': return asc(properties.askingPrice)
        case 'price_desc': return desc(properties.askingPrice)
        case 'area_desc': return desc(properties.landArea)
        default: return desc(properties.createdAt)
      }
    })()

    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db.select().from(properties).where(where).orderBy(orderBy).limit(query.limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(properties).where(where),
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

  // 物件詳細取得
  async getById(id: string) {
    const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1)
    if (result.length === 0) {
      throw notFound('物件')
    }
    return result[0]
  },

  // 物件登録
  // referringProfessionalId が未指定なら、売主プロフィールの紹介士業を自動注入する
  async create(input: CreatePropertyInput, sellerId: string, referringProfessionalId?: string) {
    let effectiveReferringProfessionalId = referringProfessionalId
    if (!effectiveReferringProfessionalId) {
      const profile = await db.select({ id: sellerProfiles.referredByProfessionalId })
        .from(sellerProfiles)
        .where(eq(sellerProfiles.userId, sellerId))
        .limit(1)
      effectiveReferringProfessionalId = profile[0]?.id ?? undefined
    }

    const result = await db.insert(properties).values({
      ...input,
      sellerId,
      referringProfessionalId: effectiveReferringProfessionalId,
      bidStartAt: input.bidStartAt ? new Date(input.bidStartAt) : null,
      bidEndAt: input.bidEndAt ? new Date(input.bidEndAt) : null,
      inheritanceStartDate: input.inheritanceStartDate ? new Date(input.inheritanceStartDate) : null,
    }).returning()

    // 売主へ登録受付通知
    await createNotificationService(db).createSilently(
      {
        userId: sellerId,
        event: NOTIFICATION_EVENT.PROPERTY_REGISTERED,
        channel: 'email',
        title: '物件登録を受け付けました',
        body: `「${input.title}」の登録を受け付けました。運営による審査後、公開されます。`,
        relatedEntityType: 'property',
        relatedEntityId: result[0].id,
        alsoEmail: true,
      },
      { propertyId: result[0].id },
    )

    return result[0]
  },

  // 物件更新
  // 入札期間の変更は MAX_BID_PERIOD_CHANGES 回まで
  async update(id: string, input: UpdatePropertyInput) {
    const existing = await this.getById(id)

    const newBidEndAt = input.bidEndAt ? new Date(input.bidEndAt) : existing.bidEndAt
    const bidEndChanged = Boolean(input.bidEndAt) &&
      existing.bidEndAt?.getTime() !== newBidEndAt?.getTime()

    const updates: Record<string, unknown> = {
      ...input,
      bidStartAt: input.bidStartAt ? new Date(input.bidStartAt) : existing.bidStartAt,
      bidEndAt: newBidEndAt,
      updatedAt: new Date(),
    }

    if (bidEndChanged) {
      if (existing.bidPeriodChangeCount >= MAX_BID_PERIOD_CHANGES) {
        throw new AppError(
          ERROR_CODE.MAX_PERIOD_CHANGES,
          `入札期間の変更は${MAX_BID_PERIOD_CHANGES}回までです`,
          400,
        )
      }
      updates.bidPeriodChangeCount = existing.bidPeriodChangeCount + 1
    }

    const result = await db.update(properties)
      .set(updates)
      .where(eq(properties.id, id))
      .returning()
    return result[0]
  },

  // ステータス変更（遷移チェック付き）
  async updateStatus(id: string, status: typeof properties.status.enumValues[number], returnReason?: string) {
    const existing = await this.getById(id)
    validatePropertyTransition(existing.status, status)

    const now = new Date()
    const updates: Record<string, unknown> = { status, updatedAt: now }

    if (status === 'published' || status === 'published_registering') {
      updates.publishedAt = now
    }
    // 登記中に入った時点を記録（cron の催促・自動差戻し判定に使用）
    if (status === 'published_registering' && existing.status !== 'published_registering') {
      updates.registeringStartedAt = now
      updates.registeringReminderSentAt = null
    }
    if (status === 'closed') {
      updates.closedAt = now
    }
    if (status === 'returned' && returnReason) {
      updates.returnReason = returnReason
    }

    const result = await db.update(properties)
      .set(updates)
      .where(eq(properties.id, id))
      .returning()

    if (result.length === 0) {
      throw notFound('物件')
    }

    // 売主向け通知（失敗は吸収して状態変更は成功扱い）
    // ステータスごとのテンプレートをテーブル化（未定義ステータスは通知スキップ）
    const statusNotifications: Partial<Record<typeof status, { event: string; title: string; body: string }>> = {
      published: {
        event: NOTIFICATION_EVENT.PROPERTY_PUBLISHED,
        title: '物件が公開されました',
        body: `「${existing.title}」が公開されました。入札の受付を開始します。`,
      },
      published_registering: {
        event: NOTIFICATION_EVENT.PROPERTY_PUBLISHED,
        title: '物件が公開されました（登記中）',
        body: `「${existing.title}」が公開されました。登記完了後、正式に入札受付へ移行します。`,
      },
      returned: {
        event: NOTIFICATION_EVENT.PROPERTY_RETURNED,
        title: '物件が差し戻されました',
        body: `「${existing.title}」が差し戻されました。${returnReason ? `理由: ${returnReason}` : ''}`,
      },
      bid_ended: {
        event: NOTIFICATION_EVENT.BID_PERIOD_ENDED,
        title: '入札期間が終了しました',
        body: `「${existing.title}」の入札期間が終了しました。落札者を選択してください。`,
      },
    }
    const notif = statusNotifications[status]
    if (notif) {
      await createNotificationService(db).createSilently(
        {
          userId: existing.sellerId,
          event: notif.event,
          channel: 'email',
          title: notif.title,
          body: notif.body,
          relatedEntityType: 'property',
          relatedEntityId: id,
          alsoEmail: true,
        },
        { propertyId: id, status },
      )
    }

    return result[0]
  },

  // 業者割り当て
  async assignBroker(id: string, brokerId: string) {
    const result = await db.update(properties)
      .set({ assignedBrokerId: brokerId, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning()
    if (result.length === 0) {
      throw notFound('物件')
    }
    return result[0]
  },

  // 書類一覧取得
  async getDocuments(propertyId: string) {
    return db.select().from(propertyDocuments).where(eq(propertyDocuments.propertyId, propertyId))
  },
})
