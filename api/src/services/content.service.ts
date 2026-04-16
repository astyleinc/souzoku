import { eq, and, desc, asc, ne, sql } from 'drizzle-orm'
import type { Database } from '../db/client'
import { helpArticles, articleFeedback, blogPosts, emailSubscriptions } from '../db/schema/content'
import type { ArticleQuery, BlogQuery } from '../schemas/content'
import { notFound, conflict } from '../lib/errors'
import type { PaginatedResponse } from '@shared/types'

export const createContentService = (db: Database) => ({
  // ヘルプ記事一覧
  async listHelpArticles(query: ArticleQuery): Promise<PaginatedResponse<typeof helpArticles.$inferSelect>> {
    const conditions = [eq(helpArticles.isPublished, true)]

    if (query.category) {
      conditions.push(eq(helpArticles.category, query.category))
    }

    const where = and(...conditions)
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db.select()
        .from(helpArticles)
        .where(where)
        .orderBy(asc(helpArticles.sortOrder))
        .limit(query.limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(helpArticles)
        .where(where),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    }
  },

  // ヘルプ記事詳細
  async getHelpArticle(slug: string) {
    const result = await db.select()
      .from(helpArticles)
      .where(and(eq(helpArticles.slug, slug), eq(helpArticles.isPublished, true)))
      .limit(1)

    if (result.length === 0) {
      throw notFound('ヘルプ記事')
    }

    return result[0]
  },

  // 記事フィードバック送信
  async submitFeedback(articleId: string, isHelpful: boolean, comment?: string) {
    const result = await db.insert(articleFeedback).values({
      articleId,
      isHelpful,
      comment,
    }).returning()

    return result[0]
  },

  // ブログ記事一覧
  async listBlogPosts(query: BlogQuery): Promise<PaginatedResponse<typeof blogPosts.$inferSelect>> {
    const conditions = [eq(blogPosts.isPublished, true)]

    if (query.category) {
      conditions.push(eq(blogPosts.category, query.category))
    }

    const where = and(...conditions)
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db.select()
        .from(blogPosts)
        .where(where)
        .orderBy(desc(blogPosts.publishedAt))
        .limit(query.limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(blogPosts)
        .where(where),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    }
  },

  // ブログ記事詳細
  async getBlogPost(slug: string) {
    const result = await db.select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)))
      .limit(1)

    if (result.length === 0) {
      throw notFound('ブログ記事')
    }

    return result[0]
  },

  // 関連記事取得
  async getRelatedPosts(slug: string, limit = 3) {
    // 対象記事のカテゴリを取得
    const current = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1)

    if (current.length === 0) {
      return []
    }

    return db.select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.isPublished, true),
        eq(blogPosts.category, current[0].category),
        ne(blogPosts.slug, slug),
      ))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
  },

  // メール通知登録
  async subscribe(email: string, type: string) {
    // 重複チェック
    const existing = await db.select()
      .from(emailSubscriptions)
      .where(and(eq(emailSubscriptions.email, email), eq(emailSubscriptions.type, type)))
      .limit(1)

    if (existing.length > 0) {
      throw conflict('このメールアドレスは既に登録されています')
    }

    const result = await db.insert(emailSubscriptions).values({
      email,
      type,
    }).returning()

    return result[0]
  },
})
