import { pgTable, uuid, varchar, bigint, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { payments } from './revenue'
import { brokers } from './brokers'

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'issued',
  'paid',
  'cancelled',
])

export const invoiceTargetEnum = pgEnum('invoice_target_type', [
  'broker',
  'professional',
  'nw',
])

// 請求書
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  paymentId: uuid('payment_id').notNull().references(() => payments.id),
  brokerId: uuid('broker_id').notNull().references(() => brokers.id),
  // 請求書の発行対象種別。業者以外（士業・NW）の支払調書にも同テーブルを流用する
  targetType: invoiceTargetEnum('target_type').notNull().default('broker'),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  taxAmount: bigint('tax_amount', { mode: 'number' }).notNull(),
  totalAmount: bigint('total_amount', { mode: 'number' }).notNull(),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  issuedAt: timestamp('issued_at', { withTimezone: true }),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
