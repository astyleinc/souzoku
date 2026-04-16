import type { MiddlewareHandler } from 'hono'
import { logger } from '../lib/logger'

export const requestLogger: MiddlewareHandler = async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  const path = c.req.path

  await next()

  const duration = Date.now() - start
  const status = c.res.status
  const requestId = c.get('requestId') ?? 'unknown'

  const logFn = status >= 500 ? logger.error : status >= 400 ? logger.warn : logger.info
  logFn('リクエスト処理', {
    requestId,
    method,
    path,
    status,
    duration: `${duration}ms`,
  })
}
