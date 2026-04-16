import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

export const notificationChannelEnum = pgEnum('notification_channel', [
  'email',
  'system',
  'slack',
])

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  event: varchar('event', { length: 50 }).notNull(),
  channel: notificationChannelEnum('channel').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  relatedEntityType: varchar('related_entity_type', { length: 50 }),
  relatedEntityId: uuid('related_entity_id'),
  isRead: boolean('is_read').notNull().default(false),
  sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
})

// 通知設定（ユーザーごと）
export const notificationSettings = pgTable('notification_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  emailEnabled: boolean('email_enabled').notNull().default(true),
  systemEnabled: boolean('system_enabled').notNull().default(true),
  slackWebhookUrl: text('slack_webhook_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
