import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import type { AuthUser } from '../middleware/auth'
import { validateBody, validateQuery } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { auditLogQuerySchema } from '../schemas/audit'
import { userQuerySchema, userStatusSchema, analyticsQuerySchema } from '../schemas/admin-extended'
import type { AuditLogQuery } from '../schemas/audit'
import type { UserQuery, UserStatusInput, AnalyticsQuery } from '../schemas/admin-extended'
import { services } from '../lib/services'
import { ok, paginated } from '../lib/response'

export const adminExtendedRoutes = new Hono<{ Variables: { user: AuthUser } }>()

// 全ルートに管理者認証を適用
adminExtendedRoutes.use('*', auth, requireRole('admin'))

// 監査ログ一覧
adminExtendedRoutes.get('/audit-log', validateQuery(auditLogQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as AuditLogQuery
  const result = await services.audit.list(query)
  return paginated(c, result)
})

// 監査ログCSVエクスポート
adminExtendedRoutes.get('/audit-log/export', validateQuery(auditLogQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as AuditLogQuery
  const csvString = await services.audit.exportCsv(query)
  c.header('Content-Type', 'text/csv')
  c.header('Content-Disposition', 'attachment; filename=audit-log.csv')
  return c.body(csvString)
})

// システム稼働状況
adminExtendedRoutes.get('/system-health', async (c) => {
  const health = services.admin.getSystemHealth()
  return ok(c, health)
})

// ユーザー一覧
adminExtendedRoutes.get('/users', validateQuery(userQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as UserQuery
  const result = await services.admin.listUsers(query)
  return paginated(c, result)
})

// ユーザー詳細
adminExtendedRoutes.get('/users/:id', validateUuidParam('id'), async (c) => {
  const result = await services.admin.getUserDetail(c.req.param('id'))
  return ok(c, result)
})

// ユーザーステータス更新
adminExtendedRoutes.patch('/users/:id/status', validateUuidParam('id'), validateBody(userStatusSchema), async (c) => {
  const input = c.get('validatedBody') as UserStatusInput
  const user = c.get('user')
  const result = await services.admin.updateUserStatus(c.req.param('id'), input.status, user.id)
  return ok(c, result)
})

// ダッシュボード集計
adminExtendedRoutes.get('/dashboard', async (c) => {
  const result = await services.admin.getDashboard()
  return ok(c, result)
})

// 分析データ
adminExtendedRoutes.get('/analytics', validateQuery(analyticsQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as AnalyticsQuery
  const result = await services.admin.getAnalytics(query)
  return ok(c, result)
})

// 物件一覧（管理者用）
adminExtendedRoutes.get('/properties', validateQuery(userQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as UserQuery
  const result = await services.admin.listProperties({
    page: query.page,
    limit: query.limit,
    status: query.status,
    keyword: query.keyword,
  })
  return paginated(c, result)
})

// 収益サマリー
adminExtendedRoutes.get('/revenue/summary', async (c) => {
  const result = await services.admin.getRevenueSummary()
  return ok(c, result)
})
