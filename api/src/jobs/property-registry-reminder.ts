import { and, eq, isNull, lt, or } from 'drizzle-orm'
import type { Database } from '../db/client'
import { properties } from '../db/schema/properties'
import { users } from '../db/schema/users'
import { NOTIFICATION_EVENT } from '@shared/constants'
import { createNotificationService } from '../services/notification.service'
import { logger } from '../lib/logger'

// 登記中に入って14日経過した物件の売主に催促通知を送る
export const runPropertyRegistryReminderJob = async (db: Database) => {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

  const targets = await db.select({
    id: properties.id,
    title: properties.title,
    sellerId: properties.sellerId,
  })
    .from(properties)
    .where(
      and(
        eq(properties.status, 'published_registering'),
        lt(properties.registeringStartedAt, fourteenDaysAgo),
        or(
          isNull(properties.registeringReminderSentAt),
          lt(properties.registeringReminderSentAt, fourteenDaysAgo),
        ),
      ),
    )

  if (targets.length === 0) {
    logger.info('登記催促ジョブ: 対象なし')
    return { sent: 0 }
  }

  const notificationService = createNotificationService(db)

  for (const target of targets) {
    await notificationService.create({
      userId: target.sellerId,
      event: NOTIFICATION_EVENT.REGISTRATION_REMINDER,
      channel: 'email',
      title: '【重要】登記の完了をお願いします',
      body: `物件「${target.title}」の登記が未完了です。2ヶ月経過すると自動で差戻しとなります。\n司法書士様にお問い合わせのうえ、登記完了をお知らせください。`,
      relatedEntityType: 'property',
      relatedEntityId: target.id,
      alsoEmail: true,
    })

    await db.update(properties)
      .set({ registeringReminderSentAt: new Date() })
      .where(eq(properties.id, target.id))
  }

  logger.info('登記催促ジョブ完了', { sent: targets.length })
  return { sent: targets.length }
}
