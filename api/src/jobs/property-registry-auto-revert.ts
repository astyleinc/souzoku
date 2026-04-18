import { and, eq, lt } from 'drizzle-orm'
import type { Database } from '../db/client'
import { properties } from '../db/schema/properties'
import {
  NOTIFICATION_EVENT,
  ONE_DAY_MS,
  PROPERTY_STATUS,
  REGISTRATION_AUTO_RETURN_DAYS,
} from '@shared/constants'
import { createNotificationService } from '../services/notification.service'
import { logger } from '../lib/logger'

// 登記中に入って既定日数を超過した物件を自動で差戻し（returned）に遷移
export const runPropertyRegistryAutoRevertJob = async (db: Database) => {
  const revertThreshold = new Date(Date.now() - REGISTRATION_AUTO_RETURN_DAYS * ONE_DAY_MS)

  const targets = await db.select({
    id: properties.id,
    title: properties.title,
    sellerId: properties.sellerId,
  })
    .from(properties)
    .where(
      and(
        eq(properties.status, PROPERTY_STATUS.PUBLISHED_REGISTERING),
        lt(properties.registeringStartedAt, revertThreshold),
      ),
    )

  if (targets.length === 0) {
    logger.info('登記自動差戻しジョブ: 対象なし')
    return { reverted: 0 }
  }

  const notificationService = createNotificationService(db)

  for (const target of targets) {
    await db.update(properties)
      .set({
        status: PROPERTY_STATUS.RETURNED,
        returnReason: `登記が${REGISTRATION_AUTO_RETURN_DAYS}日以内に完了しなかったため自動差戻し`,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, target.id))

    await notificationService.create({
      userId: target.sellerId,
      event: NOTIFICATION_EVENT.REGISTRATION_AUTO_RETURN,
      channel: 'email',
      title: '物件が自動差戻しされました',
      body: `物件「${target.title}」は登記が${REGISTRATION_AUTO_RETURN_DAYS}日以内に完了しなかったため、自動的に差戻し状態となりました。\n登記完了後、再度お申し込みください。`,
      relatedEntityType: 'property',
      relatedEntityId: target.id,
      alsoEmail: true,
    })
  }

  logger.info('登記自動差戻しジョブ完了', { reverted: targets.length })
  return { reverted: targets.length }
}
