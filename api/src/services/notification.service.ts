import { eq, desc, and } from 'drizzle-orm'
import type { Database } from '../db/client'
import { notifications, notificationSettings } from '../db/schema/notifications'
import { users } from '../db/schema/users'
import { notFound } from '../lib/errors'
import { sendMail, renderSimpleTemplate } from '../lib/mail'
import { sendSlack } from '../lib/slack'
import { logger } from '../lib/logger'

type CreateNotificationParams = {
  userId: string
  event: string
  channel: 'email' | 'system' | 'slack'
  title: string
  body: string
  relatedEntityType?: string
  relatedEntityId?: string
  // システム通知と同時にメール/Slackも送る場合に使用
  alsoEmail?: boolean
  // 末尾のCTAボタン用リンク（メール・Slack双方で使用）
  linkUrl?: string
  linkLabel?: string
  // ロール宛の共通Slack通知（NW宛など、特定ユーザーに紐づかない場合）
  slackWebhookUrl?: string
}

export const createNotificationService = (db: Database) => ({
  // 通知を作成（DB保存 + 設定に応じてメール/Slackも送信）
  async create(params: CreateNotificationParams) {
    const {
      alsoEmail,
      linkUrl,
      linkLabel,
      slackWebhookUrl,
      ...dbParams
    } = params

    const result = await db.insert(notifications).values(dbParams).returning()
    const record = result[0]

    // 送信処理は失敗しても DB 書き込みは守る（非同期）
    this.deliver({ ...params }).catch((err) => {
      logger.error('通知配送で例外', {
        userId: params.userId,
        event: params.event,
        error: err instanceof Error ? err.message : String(err),
      })
    })

    return record
  },

  // 通知送信の失敗を本処理に影響させない用のラッパー。
  // 業務フロー（入札・案件更新・決済など）から「通知は副作用で、失敗してもトランザクションを巻き戻さない」
  // という意図で呼び出される箇所が多いため、try/catch + logger.error の重複を集約する。
  // context はログに残すメタデータ（例: { propertyId, caseId } など）。
  async createSilently(
    params: CreateNotificationParams,
    context: Record<string, unknown> = {},
  ) {
    try {
      return await this.create(params)
    } catch (err) {
      logger.error('通知の作成に失敗（処理継続）', {
        event: params.event,
        userId: params.userId,
        ...context,
        error: err instanceof Error ? err.message : String(err),
      })
      return null
    }
  },

  // 配送（メール + Slack）。チャネル指定に応じて該当先に配る
  async deliver(params: CreateNotificationParams) {
    const { channel, alsoEmail, linkUrl, linkLabel, slackWebhookUrl, title, body } = params

    const needMail = channel === 'email' || alsoEmail === true
    const needSlack = channel === 'slack' || Boolean(slackWebhookUrl)

    if (needMail) {
      const user = await db.select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, params.userId))
        .limit(1)

      const settings = await this.getSettings(params.userId)
      if (user.length > 0 && settings.emailEnabled) {
        await sendMail({
          to: user[0].email,
          subject: title,
          html: renderSimpleTemplate({ title, body, ctaLabel: linkLabel, ctaUrl: linkUrl }),
          text: `${title}\n\n${body}${linkUrl ? `\n\n${linkUrl}` : ''}`,
        })
      }
    }

    if (needSlack) {
      const settings = await this.getSettings(params.userId)
      const webhookUrl = slackWebhookUrl ?? settings.slackWebhookUrl ?? ''
      if (webhookUrl && settings.systemEnabled !== false) {
        await sendSlack({
          webhookUrl,
          title,
          body,
          linkUrl,
          linkLabel,
        })
      }
    }
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
