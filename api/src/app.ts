import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { bodyLimit } from 'hono/body-limit'
import { errorHandler } from './middleware/error-handler'
import { requestId } from './middleware/request-id'
import { requestLogger } from './middleware/request-logger'
import { rateLimit } from './middleware/rate-limit'
import { propertyRoutes } from './routes/property'
import { bidRoutes } from './routes/bid'
import { professionalRoutes } from './routes/professional'
import { brokerRoutes } from './routes/broker'
import { caseRoutes } from './routes/case'
import { revenueRoutes } from './routes/revenue'
import { notificationRoutes } from './routes/notification'
import { adminRoutes } from './routes/admin'
import { userRoutes } from './routes/user'
import { documentRoutes } from './routes/document'
import { supportRoutes, supportAdminRoutes } from './routes/support'
import { adminExtendedRoutes } from './routes/admin-extended'
import { transactionRoutes } from './routes/transaction'
import { revenueExtendedRoutes } from './routes/revenue-extended'
import { referralRoutes } from './routes/referral'
import { contentRoutes } from './routes/content'
import { cronRoutes } from './routes/cron'
import { getAuth } from './lib/auth'
import {
  CORS_MAX_AGE_SECONDS,
  ONE_MINUTE_MS,
  RATE_LIMIT_API_PER_MINUTE,
  RATE_LIMIT_AUTH_PER_MINUTE,
  RATE_LIMIT_BID_PER_MINUTE,
  RATE_LIMIT_SUPPORT_PER_MINUTE,
} from '@shared/constants'

// リクエストボディの上限（バイト）
// フォーム/JSONリクエストのみを想定。ファイルアップロードは別経路（Supabase Storage 署名URL）
const REQUEST_BODY_LIMIT_BYTES = 1 * 1024 * 1024

export const createApp = () => {
  const app = new Hono()

  // グローバルミドルウェア
  app.use('*', requestId)
  const frontendOrigin = process.env.FRONTEND_URL ?? (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000')

  app.use('*', cors({
    origin: frontendOrigin ? [frontendOrigin] : [],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: CORS_MAX_AGE_SECONDS,
  }))
  app.use('*', secureHeaders())
  app.use('*', requestLogger)

  // ボディサイズ制限
  app.use('*', bodyLimit({ maxSize: REQUEST_BODY_LIMIT_BYTES }))

  // レート制限: エンドポイントの性質ごとに上限値を切り替え
  app.use('/api/*', rateLimit({ windowMs: ONE_MINUTE_MS, max: RATE_LIMIT_API_PER_MINUTE }))
  app.use('/api/bids', rateLimit({ windowMs: ONE_MINUTE_MS, max: RATE_LIMIT_BID_PER_MINUTE }))
  app.use('/api/auth/*', rateLimit({ windowMs: ONE_MINUTE_MS, max: RATE_LIMIT_AUTH_PER_MINUTE }))
  app.use('/api/support/contact', rateLimit({ windowMs: ONE_MINUTE_MS, max: RATE_LIMIT_SUPPORT_PER_MINUTE }))

  // エラーハンドラ
  app.onError(errorHandler)

  // ヘルスチェック
  app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))
  app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

  // BetterAuth認証エンドポイント
  app.on(['POST', 'GET'], '/api/auth/*', (c) => {
    const auth = getAuth()
    return auth.handler(c.req.raw)
  })

  // ルート登録
  app.route('/api/properties', propertyRoutes)
  app.route('/api/bids', bidRoutes)
  app.route('/api/professionals', professionalRoutes)
  app.route('/api/brokers', brokerRoutes)
  app.route('/api/cases', caseRoutes)
  app.route('/api/revenue', revenueRoutes)
  app.route('/api/notifications', notificationRoutes)
  app.route('/api/admin', adminExtendedRoutes)
  app.route('/api/admin', adminRoutes)
  app.route('/api/admin/inquiries', supportAdminRoutes)
  app.route('/api/users', userRoutes)
  app.route('/api', documentRoutes)
  app.route('/api/support', supportRoutes)
  app.route('/api/transactions', transactionRoutes)
  app.route('/api/revenue', revenueExtendedRoutes)
  app.route('/api/referrals', referralRoutes)
  app.route('/api', contentRoutes)
  app.route('/api/cron', cronRoutes)

  // 404
  app.notFound((c) =>
    c.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'エンドポイントが見つかりません',
        requestId: c.get('requestId') ?? 'unknown',
      },
    }, 404),
  )

  return app
}

export const app = createApp()

export type AppType = typeof app
