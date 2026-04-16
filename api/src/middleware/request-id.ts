import type { MiddlewareHandler } from 'hono'
import { v4 as uuidv4 } from 'uuid'

declare module 'hono' {
  interface ContextVariableMap {
    requestId: string
  }
}

// リクエストごとに一意のIDを付与（ログの追跡用）
export const requestId: MiddlewareHandler = async (c, next) => {
  const id = c.req.header('x-request-id') ?? uuidv4()
  c.set('requestId', id)
  c.header('X-Request-Id', id)
  await next()
}
