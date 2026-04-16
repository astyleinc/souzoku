import { z } from 'zod'

// 監査ログの操作種別
const AUDIT_ACTIONS = [
  'user_login',
  'user_logout',
  'user_created',
  'user_updated',
  'user_suspended',
  'property_created',
  'property_updated',
  'property_status_changed',
  'property_approved',
  'property_returned',
  'bid_placed',
  'bid_selected',
  'case_created',
  'case_status_changed',
  'payment_status_changed',
  'professional_verified',
  'professional_rejected',
  'admin_action',
] as const

// 監査ログ検索クエリ
export const auditLogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  action: z.enum(AUDIT_ACTIONS).optional(),
  targetType: z.string().max(50).optional(),
  actorId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>
