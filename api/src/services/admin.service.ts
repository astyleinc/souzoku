import { eq, and, sql, desc, gte, lte, like } from 'drizzle-orm'
import type { Database } from '../db/client'
import {
  users,
  sellerProfiles,
  buyerProfiles,
  properties,
  bids,
  cases,
  professionals,
  brokers,
  revenueDistributions,
  payments,
  auditLogs,
  authSession,
} from '../db/schema'
import { notFound } from '../lib/errors'
import type { UserQuery, AnalyticsQuery } from '../schemas/admin-extended'
import type { PaginatedResponse } from '@shared/types'

// 物件一覧クエリの型
type PropertyListQuery = {
  page: number
  limit: number
  status?: string
  keyword?: string
}

export const createAdminService = (db: Database) => ({
  // ダッシュボード集計
  async getDashboard() {
    const [
      propertyStats,
      bidStats,
      revenueStats,
      professionalStats,
      brokerStats,
    ] = await Promise.all([
      // 物件ステータス別件数
      db
        .select({
          status: properties.status,
          count: sql<number>`count(*)`,
        })
        .from(properties)
        .groupBy(properties.status),
      // 入札の集計
      db
        .select({
          total: sql<number>`count(*)`,
          active: sql<number>`count(*) filter (where ${bids.status} = 'active')`,
        })
        .from(bids),
      // 当月の収益集計
      db
        .select({
          monthlyTotal: sql<number>`coalesce(sum(${revenueDistributions.brokerageFee}), 0)`,
          monthlyOuver: sql<number>`coalesce(sum(${revenueDistributions.ouverAmount}), 0)`,
        })
        .from(revenueDistributions)
        .where(
          gte(
            revenueDistributions.createdAt,
            sql`date_trunc('month', now())`,
          ),
        ),
      // 士業の集計
      db
        .select({
          total: sql<number>`count(*)`,
          verified: sql<number>`count(*) filter (where ${professionals.verificationStatus} in ('auto_verified', 'manually_verified'))`,
          pending: sql<number>`count(*) filter (where ${professionals.verificationStatus} = 'pending')`,
        })
        .from(professionals),
      // 業者の集計
      db
        .select({
          total: sql<number>`count(*)`,
        })
        .from(brokers),
    ])

    // 未払い件数の取得
    const pendingPayments = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(eq(payments.status, 'not_invoiced'))

    // 物件ステータスをオブジェクトに変換
    const propertyMap: Record<string, number> = {}
    for (const row of propertyStats) {
      propertyMap[row.status] = Number(row.count)
    }

    const totalProperties = Object.values(propertyMap).reduce((sum, v) => sum + v, 0)

    return {
      properties: {
        total: totalProperties,
        reviewing: propertyMap['reviewing'] ?? 0,
        published: (propertyMap['published'] ?? 0) + (propertyMap['published_registering'] ?? 0),
        bidding: propertyMap['bidding'] ?? 0,
        closed: propertyMap['closed'] ?? 0,
        returned: propertyMap['returned'] ?? 0,
      },
      bids: {
        total: Number(bidStats[0].total),
        active: Number(bidStats[0].active),
      },
      revenue: {
        monthlyTotal: Number(revenueStats[0].monthlyTotal),
        monthlyOuver: Number(revenueStats[0].monthlyOuver),
        pendingPayments: Number(pendingPayments[0].count),
      },
      professionals: {
        total: Number(professionalStats[0].total),
        verified: Number(professionalStats[0].verified),
        pending: Number(professionalStats[0].pending),
      },
      brokers: {
        total: Number(brokerStats[0].total),
      },
    }
  },

  // 時系列分析データ
  async getAnalytics(query: AnalyticsQuery) {
    const truncUnit = query.groupBy === 'day' ? 'day' : query.groupBy === 'week' ? 'week' : 'month'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 異なるテーブルのcreatedAtカラムを統一的に扱うため
    const dateConditions = (createdAtCol: any) => {
      const conds = []
      if (query.from) {
        conds.push(gte(createdAtCol, new Date(query.from)))
      }
      if (query.to) {
        conds.push(lte(createdAtCol, new Date(query.to)))
      }
      return conds.length > 0 ? and(...conds) : undefined
    }

    const [newProperties, newUsers, newBids, revenueByPeriod] = await Promise.all([
      // 新規物件数の推移
      db
        .select({
          period: sql<string>`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${properties.createdAt})::text`.as('period'),
          count: sql<number>`count(*)`,
        })
        .from(properties)
        .where(dateConditions(properties.createdAt))
        .groupBy(sql`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${properties.createdAt})`)
        .orderBy(sql`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${properties.createdAt})`),
      // 新規ユーザー数の推移
      db
        .select({
          period: sql<string>`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${users.createdAt})::text`.as('period'),
          count: sql<number>`count(*)`,
        })
        .from(users)
        .where(dateConditions(users.createdAt))
        .groupBy(sql`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${users.createdAt})`)
        .orderBy(sql`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${users.createdAt})`),
      // 入札数の推移
      db
        .select({
          period: sql<string>`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${bids.createdAt})::text`.as('period'),
          count: sql<number>`count(*)`,
        })
        .from(bids)
        .where(dateConditions(bids.createdAt))
        .groupBy(sql`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${bids.createdAt})`)
        .orderBy(sql`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${bids.createdAt})`),
      // 収益の推移
      db
        .select({
          period: sql<string>`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${revenueDistributions.createdAt})::text`.as('period'),
          total: sql<number>`coalesce(sum(${revenueDistributions.brokerageFee}), 0)`,
          ouver: sql<number>`coalesce(sum(${revenueDistributions.ouverAmount}), 0)`,
        })
        .from(revenueDistributions)
        .where(dateConditions(revenueDistributions.createdAt))
        .groupBy(sql`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${revenueDistributions.createdAt})`)
        .orderBy(sql`date_trunc(${sql.raw(`'${truncUnit}'`)}, ${revenueDistributions.createdAt})`),
    ])

    return {
      groupBy: query.groupBy,
      properties: newProperties.map((r) => ({ period: r.period, count: Number(r.count) })),
      users: newUsers.map((r) => ({ period: r.period, count: Number(r.count) })),
      bids: newBids.map((r) => ({ period: r.period, count: Number(r.count) })),
      revenue: revenueByPeriod.map((r) => ({
        period: r.period,
        total: Number(r.total),
        ouver: Number(r.ouver),
      })),
    }
  },

  // ユーザー一覧（ページネーション・フィルタ付き）
  async listUsers(query: UserQuery): Promise<PaginatedResponse<typeof users.$inferSelect>> {
    const conditions = []

    if (query.role) {
      conditions.push(eq(users.role, query.role))
    }
    if (query.keyword) {
      const escaped = query.keyword.replace(/[%_\\]/g, (ch) => `\\${ch}`)
      conditions.push(
        sql`(${users.name} ILIKE ${`%${escaped}%`} ESCAPE '\\' OR ${users.email} ILIKE ${`%${escaped}%`} ESCAPE '\\')`,
      )
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db.select().from(users).where(where).orderBy(desc(users.createdAt)).limit(query.limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(users).where(where),
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

  // ユーザー詳細（ロール別プロフィール・活動サマリー付き）
  async getUserDetail(userId: string) {
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (userResult.length === 0) {
      throw notFound('ユーザー')
    }

    const user = userResult[0]

    // ロール別プロフィール取得
    let roleProfile: Record<string, unknown> | null = null

    if (user.role === 'seller') {
      const profiles = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1)
      roleProfile = profiles[0] ?? null
    } else if (user.role === 'buyer') {
      const profiles = await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId)).limit(1)
      roleProfile = profiles[0] ?? null
    } else if (user.role === 'professional') {
      const profiles = await db.select().from(professionals).where(eq(professionals.userId, userId)).limit(1)
      roleProfile = profiles[0] ?? null
    } else if (user.role === 'broker') {
      const profiles = await db.select().from(brokers).where(eq(brokers.userId, userId)).limit(1)
      roleProfile = profiles[0] ?? null
    }

    // 活動サマリー
    const [propertyCount, bidCount, caseCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.sellerId, userId)),
      db.select({ count: sql<number>`count(*)` }).from(bids).where(eq(bids.buyerId, userId)),
      db.select({ count: sql<number>`count(*)` }).from(cases).where(
        sql`${cases.sellerId} = ${userId} OR ${cases.buyerId} = ${userId}`,
      ),
    ])

    return {
      ...user,
      roleProfile,
      activity: {
        propertyCount: Number(propertyCount[0].count),
        bidCount: Number(bidCount[0].count),
        caseCount: Number(caseCount[0].count),
      },
    }
  },

  // ユーザーステータス更新（停止時はセッション全無効化）
  async updateUserStatus(userId: string, status: 'active' | 'suspended', actorId: string) {
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (userResult.length === 0) {
      throw notFound('ユーザー')
    }

    const user = userResult[0]
    const action = status === 'suspended' ? 'user_suspended' as const : 'user_updated' as const

    // 停止時はBetterAuthのセッションを全削除して即時ログアウト
    if (status === 'suspended' && user.authId) {
      await db.delete(authSession)
        .where(eq(authSession.userId, user.authId))
    }

    // 監査ログに記録
    await db.insert(auditLogs).values({
      actorId,
      action,
      targetType: 'user',
      targetId: userId,
      details: JSON.stringify({ status }),
    })

    return {
      user,
      appliedStatus: status,
    }
  },

  // 物件一覧（管理者用、全ステータス表示、売主名結合）
  async listProperties(query: PropertyListQuery): Promise<PaginatedResponse<Record<string, unknown>>> {
    const conditions = []

    if (query.status) {
      conditions.push(eq(properties.status, query.status as typeof properties.status.enumValues[number]))
    }
    if (query.keyword) {
      const escaped = query.keyword.replace(/[%_\\]/g, (ch) => `\\${ch}`)
      conditions.push(
        sql`(${properties.title} ILIKE ${`%${escaped}%`} ESCAPE '\\' OR ${properties.address} ILIKE ${`%${escaped}%`} ESCAPE '\\')`,
      )
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db
        .select({
          id: properties.id,
          title: properties.title,
          status: properties.status,
          propertyType: properties.propertyType,
          prefecture: properties.prefecture,
          city: properties.city,
          askingPrice: properties.askingPrice,
          sellerId: properties.sellerId,
          sellerName: users.name,
          sellerEmail: users.email,
          createdAt: properties.createdAt,
          updatedAt: properties.updatedAt,
        })
        .from(properties)
        .leftJoin(users, eq(properties.sellerId, users.id))
        .where(where)
        .orderBy(desc(properties.createdAt))
        .limit(query.limit)
        .offset(offset),
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

  // 収益サマリー
  async getRevenueSummary() {
    const [totalRevenue, monthlyBreakdown, pendingCount] = await Promise.all([
      // 累計収益
      db
        .select({
          totalBrokerageFee: sql<number>`coalesce(sum(${revenueDistributions.brokerageFee}), 0)`,
          totalOuverAmount: sql<number>`coalesce(sum(${revenueDistributions.ouverAmount}), 0)`,
          totalBrokerAmount: sql<number>`coalesce(sum(${revenueDistributions.brokerAmount}), 0)`,
          totalProfessionalAmount: sql<number>`coalesce(sum(${revenueDistributions.professionalAmount}), 0)`,
          dealCount: sql<number>`count(*)`,
        })
        .from(revenueDistributions),
      // 月別収益（直近12ヶ月）
      db
        .select({
          month: sql<string>`date_trunc('month', ${revenueDistributions.createdAt})::text`.as('month'),
          total: sql<number>`coalesce(sum(${revenueDistributions.brokerageFee}), 0)`,
          ouver: sql<number>`coalesce(sum(${revenueDistributions.ouverAmount}), 0)`,
        })
        .from(revenueDistributions)
        .where(gte(revenueDistributions.createdAt, sql`now() - interval '12 months'`))
        .groupBy(sql`date_trunc('month', ${revenueDistributions.createdAt})`)
        .orderBy(sql`date_trunc('month', ${revenueDistributions.createdAt})`),
      // 未払い件数
      db
        .select({ count: sql<number>`count(*)` })
        .from(payments)
        .where(eq(payments.status, 'not_invoiced')),
    ])

    return {
      total: {
        brokerageFee: Number(totalRevenue[0].totalBrokerageFee),
        ouverAmount: Number(totalRevenue[0].totalOuverAmount),
        brokerAmount: Number(totalRevenue[0].totalBrokerAmount),
        professionalAmount: Number(totalRevenue[0].totalProfessionalAmount),
        dealCount: Number(totalRevenue[0].dealCount),
      },
      monthly: monthlyBreakdown.map((r) => ({
        month: r.month,
        total: Number(r.total),
        ouver: Number(r.ouver),
      })),
      pendingPayments: Number(pendingCount[0].count),
    }
  },

  // システム稼働状況
  async getSystemHealth() {
    const start = Date.now()

    const [userCount, propertyCount, sessionCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(properties),
      db.select({ count: sql<number>`count(*)` })
        .from(authSession)
        .where(gte(authSession.expiresAt, sql`now()`))
        .catch(() => [{ count: 0 }]),
    ])

    const dbResponseTime = Date.now() - start

    return {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      services: {
        api: { status: 'operational' as const },
        database: { status: 'operational' as const, responseTimeMs: dbResponseTime },
      },
      metrics: {
        totalUsers: Number(userCount[0].count),
        totalProperties: Number(propertyCount[0].count),
        activeSessions: Number(sessionCount[0].count),
      },
    }
  },
})
