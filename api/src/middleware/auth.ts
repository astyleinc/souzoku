import type { MiddlewareHandler } from 'hono'
import type { UserRole } from '@shared/types'
import { unauthorized, forbidden } from '../lib/errors'
import { getAuth } from '../lib/auth'

// 認証情報の型
export type AuthUser = {
  id: string
  role: UserRole
  email: string
}

// 認証コンテキストの型
type AuthEnv = {
  Variables: {
    user: AuthUser
  }
}

// BetterAuthセッション検証ミドルウェア
export const auth: MiddlewareHandler<AuthEnv> = async (c, next) => {
  const betterAuth = getAuth()
  const session = await betterAuth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session?.user) {
    throw unauthorized()
  }

  const user: AuthUser = {
    id: session.user.id,
    role: ((session.user as Record<string, unknown>).role as UserRole) ?? 'buyer',
    email: session.user.email,
  }

  c.set('user', user)
  await next()
}

// 任意認証ミドルウェア（ログイン済みならユーザー情報をセット、未ログインでも通過）
export const optionalAuth: MiddlewareHandler<AuthEnv> = async (c, next) => {
  const betterAuth = getAuth()
  const session = await betterAuth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (session?.user) {
    const user: AuthUser = {
      id: session.user.id,
      role: ((session.user as Record<string, unknown>).role as UserRole) ?? 'buyer',
      email: session.user.email,
    }
    c.set('user', user)
  }

  await next()
}

// ロール制限ミドルウェア
export const requireRole = (...roles: UserRole[]): MiddlewareHandler<AuthEnv> => {
  return async (c, next) => {
    const user = c.get('user')
    if (!user) {
      throw unauthorized()
    }
    if (!roles.includes(user.role)) {
      throw forbidden()
    }
    await next()
  }
}
