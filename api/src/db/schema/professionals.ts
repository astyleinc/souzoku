import { pgTable, uuid, varchar, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'

export const qualificationTypeEnum = pgEnum('qualification_type', [
  'tax_accountant',
  'judicial_scrivener',
  'lawyer',
  'administrative_scrivener',
  'other',
])

export const employmentTypeEnum = pgEnum('employment_type', [
  'employee',
  'sole_proprietor',
  'representative',
])

export const verificationStatusEnum = pgEnum('verification_status', [
  'pending',
  'auto_verified',
  'manually_verified',
  'rejected',
  'suspended',
])

export const paymentRecipientEnum = pgEnum('payment_recipient', [
  'self',
  'office',
])

export const professionals = pgTable('professionals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  qualificationType: qualificationTypeEnum('qualification_type').notNull(),
  registrationNumber: varchar('registration_number', { length: 50 }).notNull(),
  verificationStatus: verificationStatusEnum('verification_status').notNull().default('pending'),
  employmentType: employmentTypeEnum('employment_type').notNull(),
  officeName: varchar('office_name', { length: 200 }).notNull(),
  officeAddress: text('office_address').notNull(),
  officePhone: varchar('office_phone', { length: 20 }),
  referralCode: varchar('referral_code', { length: 50 }).notNull().unique(),
  paymentRecipient: paymentRecipientEnum('payment_recipient').notNull(),
  paymentRecipientName: varchar('payment_recipient_name', { length: 200 }).notNull(),
  bankName: varchar('bank_name', { length: 100 }).notNull(),
  bankBranch: varchar('bank_branch', { length: 100 }).notNull(),
  bankAccountType: varchar('bank_account_type', { length: 20 }).notNull(),
  bankAccountNumber: varchar('bank_account_number', { length: 20 }).notNull(),
  invoiceNumber: varchar('invoice_number', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// 士業変更履歴（事務所・NW・報酬設定・就業形態）
export const professionalHistory = pgTable('professional_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id),
  fieldName: varchar('field_name', { length: 50 }).notNull(),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  changedAt: timestamp('changed_at', { withTimezone: true }).notNull().defaultNow(),
  changedBy: uuid('changed_by').references(() => users.id),
})

// NW会社マスタ
export const nwCompanies = pgTable('nw_companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  bankName: varchar('bank_name', { length: 100 }),
  bankBranch: varchar('bank_branch', { length: 100 }),
  bankAccountType: varchar('bank_account_type', { length: 20 }),
  bankAccountNumber: varchar('bank_account_number', { length: 20 }),
  invoiceNumber: varchar('invoice_number', { length: 50 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// 士業とNWの所属関係（多対多、履歴付き）
export const professionalNwAffiliations = pgTable('professional_nw_affiliations', {
  id: uuid('id').primaryKey().defaultRandom(),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id),
  nwCompanyId: uuid('nw_company_id').notNull().references(() => nwCompanies.id),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  leftAt: timestamp('left_at', { withTimezone: true }),
})
