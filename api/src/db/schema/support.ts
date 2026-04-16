import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

// チケットステータス
export const ticketStatusEnum = pgEnum('ticket_status', [
  'open',
  'in_progress',
  'waiting_customer',
  'resolved',
  'closed',
])

// チケットカテゴリ
export const ticketCategoryEnum = pgEnum('ticket_category', [
  'general',
  'account',
  'property',
  'bidding',
  'payment',
  'technical',
  'other',
])

// サポートチケット
export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  category: ticketCategoryEnum('category').notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  status: ticketStatusEnum('status').notNull().default('open'),
  assigneeId: uuid('assignee_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// チケットメッセージ（ユーザーと管理者の返信）
export const supportMessages = pgTable('support_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').notNull().references(() => supportTickets.id),
  senderId: uuid('sender_id').references(() => users.id),
  senderName: varchar('sender_name', { length: 100 }).notNull(),
  body: text('body').notNull(),
  isStaffReply: boolean('is_staff_reply').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// 内部メモ（管理者間のみ閲覧可）
export const internalNotes = pgTable('internal_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').notNull().references(() => supportTickets.id),
  authorId: uuid('author_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
