import { eq, and, gte, lte, desc, sql } from 'drizzle-orm'
import type { Database } from '../db/client'
import { auditLogs } from '../db/schema'
import { users } from '../db/schema'
import type { AuditLogQuery } from '../schemas/audit'
import type { PaginatedResponse } from '@shared/types'

// 監査ログ登録パラメータ
type AuditLogParams = {
  actorId?: string
  action: typeof auditLogs.action.enumValues[number]
  targetType: string
  targetId?: string
  details?: string
  ipAddress?: string
}

export const createAuditService = (db: Database) => ({
  // 監査ログを記録
  async log(params: AuditLogParams) {
    const result = await db.insert(auditLogs).values({
      actorId: params.actorId ?? null,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId ?? null,
      details: params.details ?? null,
      ipAddress: params.ipAddress ?? null,
    }).returning()
    return result[0]
  },

  // 監査ログ一覧取得（ページネーション・フィルタ付き）
  async list(query: AuditLogQuery): Promise<PaginatedResponse<Record<string, unknown>>> {
    const conditions = []

    if (query.action) {
      conditions.push(eq(auditLogs.action, query.action))
    }
    if (query.targetType) {
      conditions.push(eq(auditLogs.targetType, query.targetType))
    }
    if (query.actorId) {
      conditions.push(eq(auditLogs.actorId, query.actorId))
    }
    if (query.from) {
      conditions.push(gte(auditLogs.createdAt, new Date(query.from)))
    }
    if (query.to) {
      conditions.push(lte(auditLogs.createdAt, new Date(query.to)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db
        .select({
          id: auditLogs.id,
          actorId: auditLogs.actorId,
          actorName: users.name,
          actorEmail: users.email,
          action: auditLogs.action,
          targetType: auditLogs.targetType,
          targetId: auditLogs.targetId,
          details: auditLogs.details,
          ipAddress: auditLogs.ipAddress,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.actorId, users.id))
        .where(where)
        .orderBy(desc(auditLogs.createdAt))
        .limit(query.limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(auditLogs)
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

  // 監査ログをCSV形式でエクスポート（最大10000件）
  async exportCsv(query: Omit<AuditLogQuery, 'page' | 'limit'>): Promise<string> {
    const conditions = []

    if (query.action) {
      conditions.push(eq(auditLogs.action, query.action))
    }
    if (query.targetType) {
      conditions.push(eq(auditLogs.targetType, query.targetType))
    }
    if (query.actorId) {
      conditions.push(eq(auditLogs.actorId, query.actorId))
    }
    if (query.from) {
      conditions.push(gte(auditLogs.createdAt, new Date(query.from)))
    }
    if (query.to) {
      conditions.push(lte(auditLogs.createdAt, new Date(query.to)))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const rows = await db
      .select({
        createdAt: auditLogs.createdAt,
        actorName: users.name,
        action: auditLogs.action,
        targetType: auditLogs.targetType,
        targetId: auditLogs.targetId,
        details: auditLogs.details,
        ipAddress: auditLogs.ipAddress,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.actorId, users.id))
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10000)

    // CSVヘッダー
    const header = '日時,操作者,種別,対象,詳細,IP'

    // CSV文字列のエスケープ
    const escapeCsv = (value: string | null | undefined): string => {
      if (value === null || value === undefined) return ''
      const str = String(value)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const lines = rows.map((row) => {
      const dateStr = row.createdAt ? row.createdAt.toISOString() : ''
      const target = row.targetType + (row.targetId ? `:${row.targetId}` : '')
      return [
        escapeCsv(dateStr),
        escapeCsv(row.actorName),
        escapeCsv(row.action),
        escapeCsv(target),
        escapeCsv(row.details),
        escapeCsv(row.ipAddress),
      ].join(',')
    })

    return [header, ...lines].join('\n')
  },
})
