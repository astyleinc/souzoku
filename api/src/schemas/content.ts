import { z } from 'zod'

export const articleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
})

export const articleFeedbackSchema = z.object({
  isHelpful: z.boolean(),
  comment: z.string().max(1000).optional(),
})

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
})

export const subscribeSchema = z.object({
  email: z.string().email(),
  type: z.enum(['coming_soon', 'newsletter', 'product_update']),
})

export type ArticleQuery = z.infer<typeof articleQuerySchema>
export type ArticleFeedbackInput = z.infer<typeof articleFeedbackSchema>
export type BlogQuery = z.infer<typeof blogQuerySchema>
export type SubscribeInput = z.infer<typeof subscribeSchema>
