import type { Context, MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { validationError } from '../lib/errors'
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
} from '@shared/constants'

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
// page/limit の既定値と上限は packages/shared/constants/pagination.ts に集約
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION_DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION_MAX_LIMIT).default(PAGINATION_DEFAULT_LIMIT),
})
