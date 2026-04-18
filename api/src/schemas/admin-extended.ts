import { z } from 'zod'

// ユーザー検索クエリ
export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(['seller', 'buyer', 'professional', 'broker', 'admin']).optional(),
  keyword: z.string().max(200).optional(),
  status: z.string().max(30).optional(),
})

// ユーザーステータス更新
export const userStatusSchema = z.object({
  status: z.enum(['active', 'suspended']),
})

// ユーザーロール更新
export const userRoleSchema = z.object({
  role: z.enum(['seller', 'buyer', 'professional', 'broker', 'admin']),
})

export type UserRoleInput = z.infer<typeof userRoleSchema>

// 分析クエリ
export const analyticsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('month'),
})

// ブロードキャスト通知入力
// target: 'all' | role | ユーザーID配列
export const broadcastNotificationSchema = z.object({
  target: z.union([
    z.literal('all'),
    z.enum(['seller', 'buyer', 'professional', 'broker', 'admin']),
  ]),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  channel: z.enum(['email', 'system']).default('system'),
  linkUrl: z.string().url().optional(),
  linkLabel: z.string().max(50).optional(),
})

export type UserQuery = z.infer<typeof userQuerySchema>
export type UserStatusInput = z.infer<typeof userStatusSchema>
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>
export type BroadcastNotificationInput = z.infer<typeof broadcastNotificationSchema>
