import type { Context, MiddlewareHandler } from 'hono'
import { forbidden } from '../lib/errors'
import type { AuthUser } from './auth'

// 所有者チェック: 自分のリソースか管理者のみアクセス可能
export const requireOwnerOrAdmin = (
  getOwnerId: (c: Context) => Promise<string>,
): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get('user') as AuthUser
    if (user.role === 'admin') {
      await next()
      return
    }

    const ownerId = await getOwnerId(c)
    if (ownerId !== user.id) {
      throw forbidden('他のユーザーのリソースにはアクセスできません')
    }

    await next()
  }
}
