import type { Context } from 'hono'
import type { ApiResponse, PaginatedResponse } from '@shared/types'

// 成功レスポンス
export const ok = <T>(c: Context, data: T) =>
  c.json<ApiResponse<T>>({ success: true, data }, 200)

export const created = <T>(c: Context, data: T) =>
  c.json<ApiResponse<T>>({ success: true, data }, 201)

// ページネーション付きレスポンス
export const paginated = <T>(c: Context, response: PaginatedResponse<T>) =>
  c.json<ApiResponse<PaginatedResponse<T>>>({ success: true, data: response }, 200)

// エラーレスポンス
export const errorResponse = (c: Context, code: string, message: string, status: number = 400) =>
  c.json<ApiResponse<never>>({
    success: false,
    error: { code, message },
  }, status as Parameters<typeof c.json>[1])
