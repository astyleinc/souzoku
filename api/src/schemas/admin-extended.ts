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

// 分析クエリ
export const analyticsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('month'),
})

export type UserQuery = z.infer<typeof userQuerySchema>
export type UserStatusInput = z.infer<typeof userStatusSchema>
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>
