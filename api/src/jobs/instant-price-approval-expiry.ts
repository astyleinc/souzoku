import { and, eq, lt } from 'drizzle-orm'
import type { Database } from '../db/client'
import { properties } from '../db/schema/properties'
import { NOTIFICATION_EVENT } from '@shared/constants'
import { createNotificationService } from '../services/notification.service'
import { logger } from '../lib/logger'

// 即決価格到達後 48時間以内に売主承認されなかった物件を通常の入札状態に戻す
const EXPIRY_HOURS = 48

export const runInstantPriceApprovalExpiryJob = async (db: Database) => {
  const deadline = new Date(Date.now() - EXPIRY_HOURS * 60 * 60 * 1000)

  const targets = await db.select({
    id: properties.id,
    title: properties.title,
    sellerId: properties.sellerId,
    bidEndAt: properties.bidEndAt,
  })
    .from(properties)
    .where(
      and(
        eq(properties.status, 'pending_approval'),
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
    const newStatus = target.bidEndAt && target.bidEndAt < now ? 'bid_ended' : 'bidding'

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
      body: `物件「${target.title}」の即決価格承認が48時間以内に行われませんでした。\n通常の入札に戻ります。`,
      relatedEntityType: 'property',
      relatedEntityId: target.id,
      alsoEmail: true,
    })
  }

  logger.info('即決期限切れジョブ完了', { expired: targets.length })
  return { expired: targets.length }
}
