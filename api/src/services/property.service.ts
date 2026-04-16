import { eq, desc, asc, and, gte, lte, like, sql } from 'drizzle-orm'
import type { Database } from '../db/client'
import { properties, propertyDocuments } from '../db/schema'
import type { CreatePropertyInput, UpdatePropertyInput, PropertyQuery } from '../schemas/property'
import { notFound } from '../lib/errors'
import { validatePropertyTransition } from '../lib/status-machine'
import type { PaginatedResponse } from '@shared/types'

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
    }
    if (query.biddingOnly) {
      conditions.push(eq(properties.status, 'bidding'))
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
  async create(input: CreatePropertyInput, sellerId: string, referringProfessionalId?: string) {
    const result = await db.insert(properties).values({
      ...input,
      sellerId,
      referringProfessionalId,
      bidStartAt: input.bidStartAt ? new Date(input.bidStartAt) : null,
      bidEndAt: input.bidEndAt ? new Date(input.bidEndAt) : null,
    }).returning()
    return result[0]
  },

  // 物件更新
  async update(id: string, input: UpdatePropertyInput) {
    const existing = await this.getById(id)
    const result = await db.update(properties)
      .set({
        ...input,
        bidStartAt: input.bidStartAt ? new Date(input.bidStartAt) : existing.bidStartAt,
        bidEndAt: input.bidEndAt ? new Date(input.bidEndAt) : existing.bidEndAt,
        updatedAt: new Date(),
      })
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
