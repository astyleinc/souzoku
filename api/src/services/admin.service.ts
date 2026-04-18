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
  nwCompanies,
  professionalNwAffiliations,
} from '../db/schema'
import { AppError, ERROR_CODE, notFound } from '../lib/errors'
import type { UserQuery, AnalyticsQuery, BroadcastNotificationInput } from '../schemas/admin-extended'
import type { PaginatedResponse } from '@shared/types'
import { createNotificationService } from './notification.service'

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

  // ユーザーロール変更
  async updateUserRole(userId: string, role: string, actorId: string) {
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (userResult.length === 0) {
      throw notFound('ユーザー')
    }

    const user = userResult[0]
    const oldRole = user.role

    await db.update(users)
      .set({ role: role as typeof users.role.enumValues[number], updatedAt: new Date() })
      .where(eq(users.id, userId))

    await db.insert(auditLogs).values({
      actorId,
      action: 'user_updated',
      targetType: 'user',
      targetId: userId,
      details: JSON.stringify({ oldRole, newRole: role }),
    })

    return { ...user, role }
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

  // NW会社一覧
  async listNwCompanies() {
    const rows = await db
      .select({
        id: nwCompanies.id,
        name: nwCompanies.name,
        contactEmail: nwCompanies.contactEmail,
        contactPhone: nwCompanies.contactPhone,
        isActive: nwCompanies.isActive,
        createdAt: nwCompanies.createdAt,
      })
      .from(nwCompanies)
      .orderBy(desc(nwCompanies.createdAt))

    // 所属士業数を集計
    const affiliations = await db
      .select({
        nwCompanyId: professionalNwAffiliations.nwCompanyId,
        count: sql<number>`count(*)::int`,
      })
      .from(professionalNwAffiliations)
      .where(sql`${professionalNwAffiliations.leftAt} IS NULL`)
      .groupBy(professionalNwAffiliations.nwCompanyId)

    const countMap = new Map(affiliations.map((a) => [a.nwCompanyId, a.count]))

    return {
      items: rows.map((r) => ({
        ...r,
        affiliatedCount: countMap.get(r.id) ?? 0,
      })),
    }
  },

  // NW会社作成
  async createNwCompany(input: Record<string, unknown>) {
    const [created] = await db.insert(nwCompanies).values({
      name: input.name as string,
      contactEmail: (input.contactEmail as string) || null,
      contactPhone: (input.contactPhone as string) || null,
      bankName: (input.bankName as string) || null,
      bankBranch: (input.bankBranch as string) || null,
      bankAccountType: (input.bankAccountType as string) || null,
      bankAccountNumber: (input.bankAccountNumber as string) || null,
      invoiceNumber: (input.invoiceNumber as string) || null,
    }).returning()
    return created
  },

  // NW会社更新
  async updateNwCompany(id: string, input: Record<string, unknown>) {
    const existing = await db.select().from(nwCompanies).where(eq(nwCompanies.id, id)).limit(1)
    if (existing.length === 0) throw notFound('NW会社')

    const updates: Record<string, unknown> = {}
    if (input.name !== undefined) updates.name = input.name
    if (input.contactEmail !== undefined) updates.contactEmail = input.contactEmail || null
    if (input.contactPhone !== undefined) updates.contactPhone = input.contactPhone || null
    if (input.bankName !== undefined) updates.bankName = input.bankName || null
    if (input.bankBranch !== undefined) updates.bankBranch = input.bankBranch || null
    if (input.bankAccountType !== undefined) updates.bankAccountType = input.bankAccountType || null
    if (input.bankAccountNumber !== undefined) updates.bankAccountNumber = input.bankAccountNumber || null
    if (input.invoiceNumber !== undefined) updates.invoiceNumber = input.invoiceNumber || null
    if (input.isActive !== undefined) updates.isActive = input.isActive

    const [updated] = await db.update(nwCompanies).set(updates).where(eq(nwCompanies.id, id)).returning()
    return updated
  },

  // NW会社詳細
  async getNwCompany(id: string) {
    const rows = await db.select().from(nwCompanies).where(eq(nwCompanies.id, id)).limit(1)
    if (rows.length === 0) throw notFound('NW会社')
    return rows[0]
  },

  // ブロードキャスト通知（指定ロールの全ユーザーへ同時送信）
  async broadcastNotification(input: BroadcastNotificationInput) {
    const where = input.target === 'all'
      ? undefined
      : eq(users.role, input.target)

    const targets = where
      ? await db.select({ id: users.id }).from(users).where(where)
      : await db.select({ id: users.id }).from(users)

    const notification = createNotificationService(db)
    let delivered = 0

    for (const target of targets) {
      const record = await notification.createSilently(
        {
          userId: target.id,
          event: 'broadcast',
          channel: input.channel,
          title: input.title,
          body: input.body,
          alsoEmail: input.channel !== 'system',
          linkUrl: input.linkUrl,
          linkLabel: input.linkLabel,
        },
        { userId: target.id, target: input.target },
      )
      if (record) delivered += 1
    }

    return { target: input.target, total: targets.length, delivered }
  },

  // 士業別KPI（紹介件数・成約件数・成約率・総報酬）
  async getProfessionalKPI() {
    const rows = await db
      .select({
        professionalId: professionals.id,
        name: users.name,
        qualificationType: professionals.qualificationType,
        referralCount: sql<number>`count(distinct ${properties.id})`,
        closedCount: sql<number>`count(distinct ${properties.id}) filter (where ${properties.status} = 'closed')`,
        totalReward: sql<number>`coalesce(sum(${revenueDistributions.professionalAmount}), 0)`,
      })
      .from(professionals)
      .leftJoin(users, eq(users.id, professionals.userId))
      .leftJoin(properties, eq(properties.referringProfessionalId, professionals.id))
      .leftJoin(revenueDistributions, eq(revenueDistributions.professionalId, professionals.id))
      .groupBy(professionals.id, users.name, professionals.qualificationType)
      .orderBy(desc(sql`count(distinct ${properties.id}) filter (where ${properties.status} = 'closed')`))

    return rows.map((r) => {
      const referral = Number(r.referralCount)
      const closed = Number(r.closedCount)
      return {
        professionalId: r.professionalId,
        name: r.name,
        qualificationType: r.qualificationType,
        referralCount: referral,
        closedCount: closed,
        closeRate: referral > 0 ? Number(((closed / referral) * 100).toFixed(2)) : 0,
        totalReward: Number(r.totalReward),
      }
    })
  },

  // NW別KPI（紹介件数・成約件数・成約率・総ロイヤリティ）
  async getNwKPI() {
    const rows = await db
      .select({
        nwCompanyId: nwCompanies.id,
        name: nwCompanies.name,
        referralCount: sql<number>`count(distinct ${properties.id})`,
        closedCount: sql<number>`count(distinct ${properties.id}) filter (where ${properties.status} = 'closed')`,
        totalRoyalty: sql<number>`coalesce(sum(${revenueDistributions.nwAmount}), 0)`,
      })
      .from(nwCompanies)
      .leftJoin(properties, eq(properties.referralNwCompanyId, nwCompanies.id))
      .leftJoin(revenueDistributions, eq(revenueDistributions.nwCompanyId, nwCompanies.id))
      .groupBy(nwCompanies.id, nwCompanies.name)
      .orderBy(desc(sql`count(distinct ${properties.id}) filter (where ${properties.status} = 'closed')`))

    return rows.map((r) => {
      const referral = Number(r.referralCount)
      const closed = Number(r.closedCount)
      return {
        nwCompanyId: r.nwCompanyId,
        name: r.name,
        referralCount: referral,
        closedCount: closed,
        closeRate: referral > 0 ? Number(((closed / referral) * 100).toFixed(2)) : 0,
        totalRoyalty: Number(r.totalRoyalty),
      }
    })
  },

  // 業者別KPI（成約件数・平均評価・総手数料）
  async getBrokerKPI() {
    const rows = await db
      .select({
        brokerId: brokers.id,
        companyName: brokers.companyName,
        totalDeals: brokers.totalDeals,
        closedCount: sql<number>`count(distinct ${cases.id}) filter (where ${cases.status} = 'settlement_done')`,
        totalBrokerFee: sql<number>`coalesce(sum(${revenueDistributions.brokerAmount}), 0)`,
      })
      .from(brokers)
      .leftJoin(cases, eq(cases.brokerId, brokers.id))
      .leftJoin(revenueDistributions, eq(revenueDistributions.brokerId, brokers.id))
      .groupBy(brokers.id, brokers.companyName, brokers.totalDeals)
      .orderBy(desc(brokers.totalDeals))

    return rows.map((r) => ({
      brokerId: r.brokerId,
      companyName: r.companyName,
      totalDeals: Number(r.totalDeals),
      settledCount: Number(r.closedCount),
      totalBrokerFee: Number(r.totalBrokerFee),
    }))
  },

  // エリア別KPI（都道府県・市区町村）
  async getAreaKPI() {
    const rows = await db
      .select({
        prefecture: properties.prefecture,
        city: properties.city,
        listingCount: sql<number>`count(*)`,
        bidCount: sql<number>`coalesce((select count(*) from ${bids} where ${bids.propertyId} = ${properties.id}), 0)`,
        closedCount: sql<number>`count(*) filter (where ${properties.status} = 'closed')`,
      })
      .from(properties)
      .groupBy(properties.prefecture, properties.city, properties.id)

    // 市区町村でさらに集約
    const agg = new Map<string, { prefecture: string; city: string; listingCount: number; bidCount: number; closedCount: number }>()
    for (const r of rows) {
      const key = `${r.prefecture}/${r.city}`
      const cur = agg.get(key) ?? { prefecture: r.prefecture, city: r.city, listingCount: 0, bidCount: 0, closedCount: 0 }
      cur.listingCount += Number(r.listingCount)
      cur.bidCount += Number(r.bidCount)
      cur.closedCount += Number(r.closedCount)
      agg.set(key, cur)
    }
    return Array.from(agg.values()).sort((a, b) => b.listingCount - a.listingCount)
  },

  // ファネルKPI（登録→公開→成約の平均日数、平均入札数/物件）
  async getFunnelKPI() {
    const [funnelRow] = await db
      .select({
        avgRegistrationToPublish: sql<number>`coalesce(avg(extract(epoch from (${properties.publishedAt} - ${properties.createdAt})) / 86400.0), 0)`,
        avgPublishToClose: sql<number>`coalesce(avg(extract(epoch from (${properties.closedAt} - ${properties.publishedAt})) / 86400.0) filter (where ${properties.status} = 'closed'), 0)`,
      })
      .from(properties)

    const [bidRow] = await db
      .select({
        avgBidsPerProperty: sql<number>`coalesce(count(*)::float / nullif((select count(*) from ${properties}), 0), 0)`,
      })
      .from(bids)

    const [counts] = await db
      .select({
        totalRegistered: sql<number>`count(*)`,
        totalPublished: sql<number>`count(*) filter (where ${properties.publishedAt} is not null)`,
        totalClosed: sql<number>`count(*) filter (where ${properties.status} = 'closed')`,
      })
      .from(properties)

    return {
      avgDaysRegistrationToPublish: Number(Number(funnelRow.avgRegistrationToPublish).toFixed(2)),
      avgDaysPublishToClose: Number(Number(funnelRow.avgPublishToClose).toFixed(2)),
      avgBidsPerProperty: Number(Number(bidRow.avgBidsPerProperty).toFixed(2)),
      totalRegistered: Number(counts.totalRegistered),
      totalPublished: Number(counts.totalPublished),
      totalClosed: Number(counts.totalClosed),
      publishRate: Number(counts.totalRegistered) > 0
        ? Number(((Number(counts.totalPublished) / Number(counts.totalRegistered)) * 100).toFixed(2))
        : 0,
      closeRate: Number(counts.totalPublished) > 0
        ? Number(((Number(counts.totalClosed) / Number(counts.totalPublished)) * 100).toFixed(2))
        : 0,
    }
  },

  // 売主選択入札の最終承認: 物件を closed に、案件を broker_assigned で作成
  async confirmSale(propertyId: string, brokerId: string) {
    const propRow = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1)
    if (propRow.length === 0) throw notFound('物件')
    const prop = propRow[0]
    if (prop.status !== 'pending_approval') {
      throw new AppError(
        ERROR_CODE.INVALID_STATUS_TRANSITION,
        `成約承認は承認待ち状態の物件のみ可能です（現在: ${prop.status}）`,
      )
    }

    const brokerRow = await db.select().from(brokers).where(eq(brokers.id, brokerId)).limit(1)
    if (brokerRow.length === 0) throw notFound('業者')

    const selectedBid = await db
      .select()
      .from(bids)
      .where(and(eq(bids.propertyId, propertyId), eq(bids.status, 'selected')))
      .limit(1)
    if (selectedBid.length === 0) {
      throw new AppError(ERROR_CODE.VALIDATION_ERROR, '選択された入札が見つかりません')
    }

    await db.update(properties)
      .set({ status: 'closed', assignedBrokerId: brokerId, updatedAt: new Date() })
      .where(eq(properties.id, propertyId))

    const created = await db.insert(cases).values({
      propertyId,
      brokerId,
      buyerId: selectedBid[0].buyerId,
      sellerId: prop.sellerId,
      status: 'broker_assigned',
    }).returning()

    await createNotificationService(db).createSilently(
      {
        userId: prop.sellerId,
        event: 'case_started',
        channel: 'email',
        title: '成約が確定し案件が開始されました',
        body: `物件「${prop.title}」の成約が確定しました。担当業者から連絡が届きます。`,
        relatedEntityType: 'case',
        relatedEntityId: created[0].id,
        alsoEmail: true,
      },
      { propertyId, caseId: created[0].id },
    )

    return { case: created[0] }
  },
})
