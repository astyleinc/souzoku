import type { Context, MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { validationError } from '../lib/errors'

// バリデーション済みデータの型キー
declare module 'hono' {
  interface ContextVariableMap {
    validatedBody: unknown
    validatedQuery: unknown
  }
}

// Zodスキーマによるリクエストボディのバリデーション
export const validateBody = <T extends z.ZodType>(schema: T): MiddlewareHandler => {
  return async (c, next) => {
    const body = await c.req.json().catch(() => null)
    if (body === null) {
      throw validationError('リクエストボディが不正です')
    }

    const result = schema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.errors[0]
      const path = firstError.path.join('.')
      const message = path
        ? `${path}: ${firstError.message}`
        : firstError.message
      throw validationError(message)
    }

    c.set('validatedBody', result.data)
    await next()
  }
}

// クエリパラメータのバリデーション
export const validateQuery = <T extends z.ZodType>(schema: T): MiddlewareHandler => {
  return async (c, next) => {
    const query = Object.fromEntries(
      new URL(c.req.url).searchParams.entries()
    )

    const result = schema.safeParse(query)
    if (!result.success) {
      const firstError = result.error.errors[0]
      const path = firstError.path.join('.')
      const message = path
        ? `${path}: ${firstError.message}`
        : firstError.message
      throw validationError(message)
    }

    c.set('validatedQuery', result.data)
    await next()
  }
}

// ページネーションクエリの共通スキーマ
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})
