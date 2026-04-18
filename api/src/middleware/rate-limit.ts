import type { MiddlewareHandler } from 'hono'
import { ONE_SECOND_MS, RATE_LIMIT_CLEANUP_INTERVAL_MS } from '@shared/constants'

// インメモリレート制限（本番ではRedis等に差し替え）
const store = new Map<string, { count: number; resetAt: number }>()

// 定期的にストアをクリーンアップ
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) {
      store.delete(key)
    }
  }
}, RATE_LIMIT_CLEANUP_INTERVAL_MS)

export const rateLimit = (opts: {
  windowMs: number
  max: number
  keyGenerator?: (c: { req: { header: (name: string) => string | undefined; url: string } }) => string
}): MiddlewareHandler => {
  const { windowMs, max, keyGenerator } = opts

  return async (c, next) => {
    // 開発環境ではレート制限を無効化
    if (process.env.NODE_ENV !== 'production') {
      await next()
      return
    }

    const key = keyGenerator
      ? keyGenerator(c)
      : c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown'

    const now = Date.now()
    const record = store.get(key)

    if (!record || record.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs })
      c.header('X-RateLimit-Limit', String(max))
      c.header('X-RateLimit-Remaining', String(max - 1))
      await next()
      return
    }

    record.count++

    if (record.count > max) {
      c.header('X-RateLimit-Limit', String(max))
      c.header('X-RateLimit-Remaining', '0')
      c.header('Retry-After', String(Math.ceil((record.resetAt - now) / ONE_SECOND_MS)))
      return c.json(
        { success: false, error: { code: 'RATE_LIMITED', message: 'リクエスト回数の上限に達しました' } },
        429,
      )
    }

    c.header('X-RateLimit-Limit', String(max))
    c.header('X-RateLimit-Remaining', String(max - record.count))
    await next()
  }
}
