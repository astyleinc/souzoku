import { Hono } from 'hono'
import { getDb } from '../db/client'
import { runPropertyRegistryReminderJob } from '../jobs/property-registry-reminder'
import { runPropertyRegistryAutoRevertJob } from '../jobs/property-registry-auto-revert'
import { runInstantPriceApprovalExpiryJob } from '../jobs/instant-price-approval-expiry'
import { runBidPeriodAutoEndJob } from '../jobs/bid-period-auto-end'
import { logger } from '../lib/logger'
import { safeRunJob } from '../lib/cron-runner'
import { unauthorized } from '../lib/errors'
import { ok } from '../lib/response'

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
    throw unauthorized('Invalid cron secret')
  }

  const db = getDb()
  const startedAt = Date.now()

  // 各ジョブは他ジョブの失敗に巻き込まれないよう safeRunJob で独立実行する
  const results = {
    registryReminder: await safeRunJob('registryReminder', () => runPropertyRegistryReminderJob(db)),
    registryAutoRevert: await safeRunJob('registryAutoRevert', () => runPropertyRegistryAutoRevertJob(db)),
    instantPriceExpiry: await safeRunJob('instantPriceExpiry', () => runInstantPriceApprovalExpiryJob(db)),
    bidPeriodEnd: await safeRunJob('bidPeriodEnd', () => runBidPeriodAutoEndJob(db)),
  }

  const durationMs = Date.now() - startedAt
  logger.info('cron全ジョブ実行完了', { durationMs, results })

  return ok(c, { durationMs, results })
})
