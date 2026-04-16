import { eq, desc, and } from 'drizzle-orm'
import type { Database } from '../db/client'
import { notifications, notificationSettings } from '../db/schema/notifications'
import { notFound } from '../lib/errors'

export const createNotificationService = (db: Database) => ({
  // 通知を作成
  async create(params: {
    userId: string
    event: string
    channel: 'email' | 'system' | 'slack'
    title: string
    body: string
    relatedEntityType?: string
    relatedEntityId?: string
  }) {
    const result = await db.insert(notifications).values(params).returning()
    return result[0]
  },

  // ユーザーの通知一覧
  async listByUser(userId: string, unreadOnly = false) {
    const conditions = [eq(notifications.userId, userId)]
    if (unreadOnly) {
      conditions.push(eq(notifications.isRead, false))
    }

    return db.select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.sentAt))
      .limit(50)
  },

  // 既読にする
  async markAsRead(id: string, userId: string) {
    const result = await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning()

    if (result.length === 0) {
      throw notFound('通知')
    }
    return result[0]
  },

  // 全て既読にする
  async markAllAsRead(userId: string) {
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
  },

  // 通知設定の取得
  async getSettings(userId: string) {
    const result = await db.select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId))
      .limit(1)

    if (result.length === 0) {
      // デフォルト設定を作成して返す
      const created = await db.insert(notificationSettings)
        .values({ userId })
        .returning()
      return created[0]
    }
    return result[0]
  },

  // 通知設定の更新
  async updateSettings(userId: string, settings: {
    emailEnabled?: boolean
    systemEnabled?: boolean
    slackWebhookUrl?: string | null
  }) {
    const existing = await this.getSettings(userId)

    const result = await db.update(notificationSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(notificationSettings.id, existing.id))
      .returning()

    return result[0]
  },
})
