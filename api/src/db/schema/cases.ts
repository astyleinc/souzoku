import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'
import { properties } from './properties'
import { brokers } from './brokers'

export const caseStatusEnum = pgEnum('case_status', [
  'broker_assigned',
  'seller_contacted',
  'buyer_contacted',
  'explanation_done',
  'contract_signed',
  'settlement_done',
  'cancelled',
])

export const cases = pgTable('cases', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id),
  brokerId: uuid('broker_id').notNull().references(() => brokers.id),
  buyerId: uuid('buyer_id').notNull().references(() => users.id),
  sellerId: uuid('seller_id').notNull().references(() => users.id),
  status: caseStatusEnum('status').notNull().default('broker_assigned'),
  // 業者がアップロードする書類のURL
  explanationDocUrl: text('explanation_doc_url'),
  contractDocUrl: text('contract_doc_url'),
  settlementDocUrl: text('settlement_doc_url'),
  cancelReason: text('cancel_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// 案件メッセージ（問い合わせスレッド）
export const caseMessages = pgTable('case_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  caseId: uuid('case_id').notNull().references(() => cases.id),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
