import { Hono } from 'hono'
import { getDb } from '../db/client'
import { runPropertyRegistryReminderJob } from '../jobs/property-registry-reminder'
import { runPropertyRegistryAutoRevertJob } from '../jobs/property-registry-auto-revert'
import { runInstantPriceApprovalExpiryJob } from '../jobs/instant-price-approval-expiry'
import { runBidPeriodAutoEndJob } from '../jobs/bid-period-auto-end'
import { logger } from '../lib/logger'

export const cronRoutes = new Hono()

// Vercel Cron は Authorization: Bearer <CRON_SECRET> を送る
const verifyCronAuth = (authHeader: string | undefined) => {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    // dev 環境では認証スキップ（本番は必ず設定）
    return true
  }
  return authHeader === `Bearer ${secret}`
}

// 全ジョブを順次実行するエンドポイント（Vercel Cron から 1時間ごとに呼ぶ）
cronRoutes.get('/run-all', async (c) => {
  if (!verifyCronAuth(c.req.header('authorization'))) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid cron secret' } }, 401)
  }

  const db = getDb()
  const startedAt = Date.now()

  const results = {
    registryReminder: await runPropertyRegistryReminderJob(db).catch((err) => {
      logger.error('registryReminder失敗', { error: err instanceof Error ? err.message : String(err) })
      return { error: err instanceof Error ? err.message : String(err) }
    }),
    registryAutoRevert: await runPropertyRegistryAutoRevertJob(db).catch((err) => {
      logger.error('registryAutoRevert失敗', { error: err instanceof Error ? err.message : String(err) })
      return { error: err instanceof Error ? err.message : String(err) }
    }),
    instantPriceExpiry: await runInstantPriceApprovalExpiryJob(db).catch((err) => {
      logger.error('instantPriceExpiry失敗', { error: err instanceof Error ? err.message : String(err) })
      return { error: err instanceof Error ? err.message : String(err) }
    }),
    bidPeriodEnd: await runBidPeriodAutoEndJob(db).catch((err) => {
      logger.error('bidPeriodEnd失敗', { error: err instanceof Error ? err.message : String(err) })
      return { error: err instanceof Error ? err.message : String(err) }
    }),
  }

  const durationMs = Date.now() - startedAt
  logger.info('cron全ジョブ実行完了', { durationMs, results })

  return c.json({ success: true, data: { durationMs, results } })
})
