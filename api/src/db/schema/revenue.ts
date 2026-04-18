import { pgTable, uuid, bigint, numeric, varchar, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { properties } from './properties'
import { brokers } from './brokers'
import { professionals } from './professionals'
import { nwCompanies } from './professionals'
import { cases } from './cases'

export const paymentStatusEnum = pgEnum('payment_status', [
  'not_invoiced',
  'invoiced',
  'confirmed',
])

// 収益配分レコード（成約ごとに1レコード）
export const revenueDistributions = pgTable('revenue_distributions', {
  id: uuid('id').primaryKey().defaultRandom(),
  caseId: uuid('case_id').notNull().references(() => cases.id),
  propertyId: uuid('property_id').notNull().references(() => properties.id),
  salePrice: bigint('sale_price', { mode: 'number' }).notNull(),
  brokerageFee: bigint('brokerage_fee', { mode: 'number' }).notNull(),
  brokerageFeeWithTax: bigint('brokerage_fee_with_tax', { mode: 'number' }).notNull(),
  // 各者の配分額
  brokerAmount: bigint('broker_amount', { mode: 'number' }).notNull(),
  ouverAmount: bigint('ouver_amount', { mode: 'number' }).notNull(),
  professionalAmount: bigint('professional_amount', { mode: 'number' }).notNull(),
  nwAmount: bigint('nw_amount', { mode: 'number' }).notNull(),
  // 配分率（記録用）
  brokerRate: numeric('broker_rate', { precision: 5, scale: 4 }).notNull(),
  ouverRate: numeric('ouver_rate', { precision: 5, scale: 4 }).notNull(),
  professionalRate: numeric('professional_rate', { precision: 5, scale: 4 }).notNull(),
  nwRate: numeric('nw_rate', { precision: 5, scale: 4 }).notNull(),
  // 関連エンティティ
  brokerId: uuid('broker_id').notNull().references(() => brokers.id),
  professionalId: uuid('professional_id').references(() => professionals.id),
  nwCompanyId: uuid('nw_company_id').references(() => nwCompanies.id),
  isNwReferral: varchar('is_nw_referral', { length: 10 }).notNull(),
  // 片手仲介フラグ（true: 売主側のみ担当 → 業者60%）
  isOneSided: boolean('is_one_sided').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// 支払い管理
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  revenueDistributionId: uuid('revenue_distribution_id').notNull().references(() => revenueDistributions.id),
  // 支払先の種別と対象
  payeeType: varchar('payee_type', { length: 20 }).notNull(),
  payeeId: uuid('payee_id').notNull(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  status: paymentStatusEnum('status').notNull().default('not_invoiced'),
  invoiceUrl: text('invoice_url'),
  invoicedAt: timestamp('invoiced_at', { withTimezone: true }),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  confirmedBy: uuid('confirmed_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
