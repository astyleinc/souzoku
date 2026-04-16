import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', [
  'seller',
  'buyer',
  'professional',
  'broker',
  'admin',
])

export const buyerTypeEnum = pgEnum('buyer_type', [
  'individual',
  'real_estate_company',
  'investor',
  'other_company',
])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  authId: text('auth_id').unique(),
  role: userRoleEnum('role').notNull().default('buyer'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// 売主追加情報
export const sellerProfiles = pgTable('seller_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  identityDocumentUrl: text('identity_document_url'),
  referralCode: varchar('referral_code', { length: 50 }),
  referredByProfessionalId: uuid('referred_by_professional_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// 買い手追加情報
export const buyerProfiles = pgTable('buyer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  buyerType: buyerTypeEnum('buyer_type').notNull(),
  companyName: varchar('company_name', { length: 200 }),
  preferredAreas: text('preferred_areas'),
  preferredPriceMin: text('preferred_price_min'),
  preferredPriceMax: text('preferred_price_max'),
  preferredPropertyTypes: text('preferred_property_types'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
