import { eq, and, desc, sql } from 'drizzle-orm'
import type { Database } from '../db/client'
import { users, sellerProfiles, buyerProfiles } from '../db/schema/users'
import { properties } from '../db/schema/properties'
import { bids } from '../db/schema/bids'
import { favorites, securityLogs, accountDeletionRequests } from '../db/schema/user-settings'
import type { UpdateProfileInput } from '../schemas/user'
import { notFound, conflict } from '../lib/errors'
import type { PaginatedResponse } from '@shared/types'

export const createUserService = (db: Database) => ({
  // プロフィール取得
  async getProfile(userId: string) {
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (userResult.length === 0) {
      throw notFound('ユーザー')
    }
    const user = userResult[0]

    // ロールに応じた追加プロフィールを取得
    let roleProfile: unknown = null
    if (user.role === 'seller') {
      const result = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1)
      roleProfile = result[0] ?? null
    } else if (user.role === 'buyer') {
      const result = await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId)).limit(1)
      roleProfile = result[0] ?? null
    }

    return { ...user, roleProfile }
  },

  // プロフィール更新
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const result = await db.update(users)
      .set({
        name: input.name,
        phone: input.phone,
        address: input.address,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    if (result.length === 0) {
      throw notFound('ユーザー')
    }
    return result[0]
  },

  // セキュリティログ取得
  async getSecurityLog(userId: string, limit = 50) {
    return db.select()
      .from(securityLogs)
      .where(eq(securityLogs.userId, userId))
      .orderBy(desc(securityLogs.createdAt))
      .limit(limit)
  },

  // セキュリティログ作成
  async createSecurityLog(params: {
    userId: string
    event: string
    ipAddress?: string
    userAgent?: string
    location?: string
  }) {
    const result = await db.insert(securityLogs).values({
      userId: params.userId,
      event: params.event,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
      location: params.location ?? null,
    }).returning()
    return result[0]
  },

  // アカウント削除リクエスト
  async requestDeletion(userId: string, reason: string) {
    // 保留中のリクエストがあるかチェック
    const existing = await db.select()
      .from(accountDeletionRequests)
      .where(and(
        eq(accountDeletionRequests.userId, userId),
        eq(accountDeletionRequests.status, 'pending'),
      ))
      .limit(1)

    if (existing.length > 0) {
      throw conflict('既に削除リクエストが保留中です')
    }

    // 30日後を削除予定日に設定
    const scheduledDeletionAt = new Date()
    scheduledDeletionAt.setDate(scheduledDeletionAt.getDate() + 30)

    const result = await db.insert(accountDeletionRequests).values({
      userId,
      reason,
      status: 'pending',
      scheduledDeletionAt,
    }).returning()
    return result[0]
  },

  // アカウント削除リクエストのキャンセル
  async cancelDeletion(userId: string) {
    const existing = await db.select()
      .from(accountDeletionRequests)
      .where(and(
        eq(accountDeletionRequests.userId, userId),
        eq(accountDeletionRequests.status, 'pending'),
      ))
      .limit(1)

    if (existing.length === 0) {
      throw notFound('削除リクエスト')
    }

    const result = await db.update(accountDeletionRequests)
      .set({
        status: 'cancelled',
        cancelledAt: new Date(),
      })
      .where(eq(accountDeletionRequests.id, existing[0].id))
      .returning()

    return result[0]
  },

  // データエクスポート
  async exportData(userId: string) {
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (userResult.length === 0) {
      throw notFound('ユーザー')
    }
    const user = userResult[0]

    // ロール別のデータ取得
    const exportData: Record<string, unknown> = { user }

    if (user.role === 'seller') {
      const sellerProfile = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId))
      const userProperties = await db.select().from(properties).where(eq(properties.sellerId, userId))
      exportData.sellerProfile = sellerProfile[0] ?? null
      exportData.properties = userProperties
    }

    if (user.role === 'buyer') {
      const buyerProfile = await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId))
      const userBids = await db.select().from(bids).where(eq(bids.buyerId, userId))
      const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId))
      exportData.buyerProfile = buyerProfile[0] ?? null
      exportData.bids = userBids
      exportData.favorites = userFavorites
    }

    const logs = await db.select().from(securityLogs).where(eq(securityLogs.userId, userId))
    exportData.securityLogs = logs

    const deletionRequests = await db.select().from(accountDeletionRequests).where(eq(accountDeletionRequests.userId, userId))
    exportData.deletionRequests = deletionRequests

    return {
      exportedAt: new Date().toISOString(),
      ...exportData,
    }
  },

  // お気に入り一覧取得（ページネーション付き）
  async getFavorites(userId: string, page: number, limit: number): Promise<PaginatedResponse<unknown>> {
    const offset = (page - 1) * limit

    const [items, countResult] = await Promise.all([
      db.select({
        id: favorites.id,
        propertyId: favorites.propertyId,
        createdAt: favorites.createdAt,
        property: {
          id: properties.id,
          title: properties.title,
          propertyType: properties.propertyType,
          prefecture: properties.prefecture,
          city: properties.city,
          address: properties.address,
          askingPrice: properties.askingPrice,
          status: properties.status,
          bidStartAt: properties.bidStartAt,
          bidEndAt: properties.bidEndAt,
        },
      })
        .from(favorites)
        .innerJoin(properties, eq(favorites.propertyId, properties.id))
        .where(eq(favorites.userId, userId))
        .orderBy(desc(favorites.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(favorites)
        .where(eq(favorites.userId, userId)),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // お気に入り追加
  async addFavorite(userId: string, propertyId: string) {
    // 重複チェック
    const existing = await db.select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.propertyId, propertyId),
      ))
      .limit(1)

    if (existing.length > 0) {
      throw conflict('既にお気に入りに追加済みです')
    }

    const result = await db.insert(favorites).values({
      userId,
      propertyId,
    }).returning()
    return result[0]
  },

  // お気に入り削除
  async removeFavorite(userId: string, propertyId: string) {
    const result = await db.delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.propertyId, propertyId),
      ))
      .returning()

    if (result.length === 0) {
      throw notFound('お気に入り')
    }
    return result[0]
  },
})
