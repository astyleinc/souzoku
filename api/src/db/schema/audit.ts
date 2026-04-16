import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

// 監査ログの操作種別
export const auditActionEnum = pgEnum('audit_action', [
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
])

// 監査ログ
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorId: uuid('actor_id').references(() => users.id),
  action: auditActionEnum('action').notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(),
  targetId: uuid('target_id'),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
