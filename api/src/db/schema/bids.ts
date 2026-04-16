import { pgTable, uuid, bigint, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'
import { properties } from './properties'

export const bidStatusEnum = pgEnum('bid_status', [
  'active',
  'superseded',
  'selected',
  'rejected',
])

export const nonHighestBidReasonEnum = pgEnum('non_highest_bid_reason', [
  'credit_concern',
  'condition_mismatch',
  'other',
])

export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').notNull().references(() => properties.id),
  buyerId: uuid('buyer_id').notNull().references(() => users.id),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  status: bidStatusEnum('status').notNull().default('active'),
  note: text('note'),
  // 売主が最高額以外を選んだ場合の理由
  selectionReason: nonHighestBidReasonEnum('selection_reason'),
  selectionReasonDetail: text('selection_reason_detail'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
