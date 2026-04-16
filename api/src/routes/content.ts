import { Hono } from 'hono'
import { validateBody, validateQuery } from '../middleware/validate'
import { articleQuerySchema, articleFeedbackSchema, blogQuerySchema, subscribeSchema } from '../schemas/content'
import type { ArticleQuery, ArticleFeedbackInput, BlogQuery, SubscribeInput } from '../schemas/content'
import { services } from '../lib/services'
import { ok, created, paginated } from '../lib/response'

export const contentRoutes = new Hono()

// ヘルプ記事一覧
contentRoutes.get('/help/articles', validateQuery(articleQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as ArticleQuery
  const result = await services.content.listHelpArticles(query)
  return paginated(c, result)
})

// ヘルプ記事詳細
contentRoutes.get('/help/articles/:slug', async (c) => {
  const slug = c.req.param('slug')
  const article = await services.content.getHelpArticle(slug)
  return ok(c, article)
})

// ヘルプ記事フィードバック
contentRoutes.post('/help/articles/:slug/feedback', validateBody(articleFeedbackSchema), async (c) => {
  const slug = c.req.param('slug')
  const input = c.get('validatedBody') as ArticleFeedbackInput
  // 記事の存在確認とID取得
  const article = await services.content.getHelpArticle(slug)
  const feedback = await services.content.submitFeedback(article.id, input.isHelpful, input.comment)
  return created(c, feedback)
})

// ブログ記事一覧
contentRoutes.get('/blog/posts', validateQuery(blogQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as BlogQuery
  const result = await services.content.listBlogPosts(query)
  return paginated(c, result)
})

// ブログ記事詳細（関連記事も取得）
contentRoutes.get('/blog/posts/:slug', async (c) => {
  const slug = c.req.param('slug')
  const [post, relatedPosts] = await Promise.all([
    services.content.getBlogPost(slug),
    services.content.getRelatedPosts(slug),
  ])
  return ok(c, { ...post, relatedPosts })
})

// メール通知登録
contentRoutes.post('/subscribe', validateBody(subscribeSchema), async (c) => {
  const input = c.get('validatedBody') as SubscribeInput
  const subscription = await services.content.subscribe(input.email, input.type)
  return created(c, subscription)
})
