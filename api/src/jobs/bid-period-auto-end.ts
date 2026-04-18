import { and, eq, lt } from 'drizzle-orm'
import type { Database } from '../db/client'
import { properties } from '../db/schema/properties'
import { NOTIFICATION_EVENT, PROPERTY_STATUS } from '@shared/constants'
import { createNotificationService } from '../services/notification.service'
import { logger } from '../lib/logger'

// 入札期間が終了した物件を bid_ended に遷移させる
export const runBidPeriodAutoEndJob = async (db: Database) => {
  const now = new Date()

  const targets = await db.select({
    id: properties.id,
    title: properties.title,
    sellerId: properties.sellerId,
  })
    .from(properties)
    .where(
      and(
        eq(properties.status, PROPERTY_STATUS.BIDDING),
        lt(properties.bidEndAt, now),
      ),
    )

  if (targets.length === 0) {
    logger.info('入札期間終了ジョブ: 対象なし')
    return { ended: 0 }
  }

  const notificationService = createNotificationService(db)

  for (const target of targets) {
    await db.update(properties)
      .set({ status: PROPERTY_STATUS.BID_ENDED, updatedAt: now })
      .where(eq(properties.id, target.id))

    await notificationService.create({
      userId: target.sellerId,
      event: NOTIFICATION_EVENT.BID_PERIOD_ENDED,
      channel: 'email',
      title: '入札期間が終了しました',
      body: `物件「${target.title}」の入札期間が終了しました。\n管理画面から入札者を選択してください。`,
      relatedEntityType: 'property',
      relatedEntityId: target.id,
      alsoEmail: true,
    })
  }

  logger.info('入札期間終了ジョブ完了', { ended: targets.length })
  return { ended: targets.length }
}
