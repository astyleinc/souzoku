import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'
import { AppError } from '../lib/errors'
import { logger } from '../lib/logger'

export const errorHandler: ErrorHandler = (err, c) => {
  const requestId = c.get('requestId') ?? 'unknown'

  // AppError: アプリケーション固有のエラー
  if (err instanceof AppError) {
    logger.warn('アプリケーションエラー', {
      requestId,
      code: err.code,
      message: err.message,
      path: c.req.path,
    })
    return c.json(
      { success: false, error: { code: err.code, message: err.message, requestId } },
      err.statusCode as Parameters<typeof c.json>[1],
    )
  }

  // HTTPException: Honoのビルトインエラー
  if (err instanceof HTTPException) {
    logger.warn('HTTPエラー', {
      requestId,
      status: err.status,
      message: err.message,
      path: c.req.path,
    })
    return c.json(
      { success: false, error: { code: 'HTTP_ERROR', message: err.message, requestId } },
      err.status,
    )
  }

  // ZodError: バリデーションエラー（フォールバック）
  if (err instanceof ZodError) {
    const firstError = err.errors[0]
    const path = firstError.path.join('.')
    const message = path ? `${path}: ${firstError.message}` : firstError.message
    logger.warn('バリデーションエラー', {
      requestId,
      errors: err.errors,
      path: c.req.path,
    })
    return c.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message, requestId } },
      400,
    )
  }

  // 予期しないエラー: スタックトレースはログのみ。クライアントには漏らさない
  const cause = (err as Error & { cause?: unknown }).cause
  logger.error('予期しないエラー', {
    requestId,
    message: err.message,
    stack: err.stack,
    name: err.name,
    path: c.req.path,
    method: c.req.method,
    cause: cause instanceof Error
      ? { name: cause.name, message: cause.message, stack: cause.stack, ...cause }
      : cause,
  })

  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'サーバーエラーが発生しました。問題が続く場合はサポートにお問い合わせください。',
        requestId,
      },
    },
    500,
  )
}
