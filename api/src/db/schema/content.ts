import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'
import { professionals } from './professionals'

// 紹介リンク（士業が発行する個別の紹介リンク — professionals.referralCode とは別の追跡用）
export const referralLinks = pgTable('referral_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id),
  code: varchar('code', { length: 20 }).notNull().unique(),
  label: varchar('label', { length: 100 }),
  clickCount: integer('click_count').notNull().default(0),
  registrationCount: integer('registration_count').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ヘルプ記事
export const helpArticles = pgTable('help_articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  body: text('body').notNull(),
  isPublished: boolean('is_published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// 記事フィードバック
export const articleFeedback = pgTable('article_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => helpArticles.id),
  isHelpful: boolean('is_helpful').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ブログ記事
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  excerpt: text('excerpt'),
  body: text('body').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  thumbnailUrl: text('thumbnail_url'),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorRole: varchar('author_role', { length: 50 }),
  readingMinutes: integer('reading_minutes').notNull().default(5),
  isPublished: boolean('is_published').notNull().default(true),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// メール通知登録（coming-soon等の通知購読）
export const emailSubscriptions = pgTable('email_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
