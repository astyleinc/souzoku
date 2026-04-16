import { pgTable, uuid, varchar, text, timestamp, integer, bigint, pgEnum, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'
import { professionals } from './professionals'
import { nwCompanies } from './professionals'

export const propertyStatusEnum = pgEnum('property_status', [
  'reviewing',
  'published',
  'published_registering',
  'bidding',
  'bid_ended',
  'pending_approval',
  'closed',
  'returned',
  'failed',
  'normal_listing',
])

export const propertyTypeEnum = pgEnum('property_type', [
  'house',
  'land',
  'apartment',
  'other',
])

export const urgencyEnum = pgEnum('urgency', [
  'urgent',
  'three_months',
  'one_year',
  'undecided',
])

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').notNull().references(() => users.id),
  referringProfessionalId: uuid('referring_professional_id').references(() => professionals.id),
  referralNwCompanyId: uuid('referral_nw_company_id').references(() => nwCompanies.id),
  referralChannel: varchar('referral_channel', { length: 10 }),
  assignedBrokerId: uuid('assigned_broker_id'),
  status: propertyStatusEnum('status').notNull().default('reviewing'),
  propertyType: propertyTypeEnum('property_type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  prefecture: varchar('prefecture', { length: 10 }).notNull(),
  city: varchar('city', { length: 50 }).notNull(),
  address: text('address').notNull(),
  nearestStation: varchar('nearest_station', { length: 100 }),
  walkMinutes: integer('walk_minutes'),
  landArea: integer('land_area'),
  buildingArea: integer('building_area'),
  builtYear: integer('built_year'),
  floors: integer('floors'),
  askingPrice: bigint('asking_price', { mode: 'number' }).notNull(),
  instantPrice: bigint('instant_price', { mode: 'number' }),
  urgency: urgencyEnum('urgency').notNull(),
  isRegistrationComplete: boolean('is_registration_complete').notNull().default(false),
  bidStartAt: timestamp('bid_start_at', { withTimezone: true }),
  bidEndAt: timestamp('bid_end_at', { withTimezone: true }),
  bidPeriodChangeCount: integer('bid_period_change_count').notNull().default(0),
  returnReason: text('return_reason'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// 書類種別
export const documentTypeEnum = pgEnum('document_type', [
  'registry_certificate',
  'inheritance_agreement',
  'registration_proof',
  'tax_notice',
  'identity_document',
  'property_photo',
  'important_matter_explanation',
  'sales_contract',
  'settlement_proof',
])

// 物件書類
export const propertyDocuments = pgTable('property_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id),
  documentType: documentTypeEnum('document_type').notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// 書類閲覧許可（売主が士業ごとに設定）
export const documentPermissions = pgTable('document_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').notNull().references(() => propertyDocuments.id),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id),
  grantedBy: uuid('granted_by').notNull().references(() => users.id),
  grantedAt: timestamp('granted_at', { withTimezone: true }).notNull().defaultNow(),
})
