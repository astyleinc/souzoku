import { pgTable, uuid, varchar, text, timestamp, integer, numeric } from 'drizzle-orm/pg-core'
import { users } from './users'

export const brokers = pgTable('brokers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  companyName: varchar('company_name', { length: 200 }).notNull(),
  representativeName: varchar('representative_name', { length: 100 }).notNull(),
  address: text('address').notNull(),
  licenseNumber: varchar('license_number', { length: 50 }).notNull(),
  contactPersonName: varchar('contact_person_name', { length: 100 }).notNull(),
  bankName: varchar('bank_name', { length: 100 }).notNull(),
  bankBranch: varchar('bank_branch', { length: 100 }).notNull(),
  bankAccountType: varchar('bank_account_type', { length: 20 }).notNull(),
  bankAccountNumber: varchar('bank_account_number', { length: 20 }).notNull(),
  invoiceNumber: varchar('invoice_number', { length: 50 }),
  totalDeals: integer('total_deals').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// 業者評価
export const brokerEvaluations = pgTable('broker_evaluations', {
  id: uuid('id').primaryKey().defaultRandom(),
  brokerId: uuid('broker_id').notNull().references(() => brokers.id),
  evaluatorId: uuid('evaluator_id').notNull().references(() => users.id),
  propertyId: uuid('property_id').notNull(),
  speedRating: integer('speed_rating').notNull(),
  clarityRating: integer('clarity_rating').notNull(),
  politenessRating: integer('politeness_rating').notNull(),
  overallRating: integer('overall_rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
