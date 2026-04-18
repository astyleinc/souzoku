import { and, eq, lt } from 'drizzle-orm'
import type { Database } from '../db/client'
import { properties } from '../db/schema/properties'
import {
  INSTANT_APPROVAL_DEADLINE_HOURS,
  NOTIFICATION_EVENT,
  ONE_HOUR_MS,
  PROPERTY_STATUS,
} from '@shared/constants'
import { createNotificationService } from '../services/notification.service'
import { logger } from '../lib/logger'

// 即決価格到達後、既定時間以内に売主承認されなかった物件を通常の入札状態に戻す
export const runInstantPriceApprovalExpiryJob = async (db: Database) => {
  const deadline = new Date(Date.now() - INSTANT_APPROVAL_DEADLINE_HOURS * ONE_HOUR_MS)

  const targets = await db.select({
    id: properties.id,
    title: properties.title,
    sellerId: properties.sellerId,
    bidEndAt: properties.bidEndAt,
  })
    .from(properties)
    .where(
      and(
        eq(properties.status, PROPERTY_STATUS.PENDING_APPROVAL),
        lt(properties.instantPriceReachedAt, deadline),
      ),
    )

  if (targets.length === 0) {
    logger.info('即決期限切れジョブ: 対象なし')
    return { expired: 0 }
  }

  const notificationService = createNotificationService(db)
  const now = new Date()

  for (const target of targets) {
    // 入札期間が既に終了している場合は bid_ended、継続中なら bidding に戻す
    const newStatus = target.bidEndAt && target.bidEndAt < now
      ? PROPERTY_STATUS.BID_ENDED
      : PROPERTY_STATUS.BIDDING

    await db.update(properties)
      .set({
        status: newStatus,
        instantPriceReachedAt: null,
        instantPriceBidId: null,
        updatedAt: now,
      })
      .where(eq(properties.id, target.id))

    await notificationService.create({
      userId: target.sellerId,
      event: NOTIFICATION_EVENT.INSTANT_APPROVAL_EXPIRED,
      channel: 'email',
      title: '即決価格の承認期限が切れました',
      body: `物件「${target.title}」の即決価格承認が${INSTANT_APPROVAL_DEADLINE_HOURS}時間以内に行われませんでした。\n通常の入札に戻ります。`,
      relatedEntityType: 'property',
      relatedEntityId: target.id,
      alsoEmail: true,
    })
  }

  logger.info('即決期限切れジョブ完了', { expired: targets.length })
  return { expired: targets.length }
}
