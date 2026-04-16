import type { MiddlewareHandler } from 'hono'
import { validationError } from '../lib/errors'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// パスパラメータのUUIDバリデーション
export const validateUuidParam = (paramName: string): MiddlewareHandler => {
  return async (c, next) => {
    const value = c.req.param(paramName)
    if (value && !UUID_REGEX.test(value)) {
      throw validationError(`${paramName}の形式が不正です`)
    }
    await next()
  }
}
