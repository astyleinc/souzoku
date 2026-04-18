import { eq, desc, avg } from 'drizzle-orm'
import type { Database } from '../db/client'
import { brokers, brokerEvaluations } from '../db/schema/brokers'
import { users } from '../db/schema/users'
import type { RegisterBrokerInput, EvaluateBrokerInput } from '../schemas/broker'
import { notFound } from '../lib/errors'
import { createNotificationService } from './notification.service'
import { NOTIFICATION_EVENT } from '@shared/constants'
import { logger } from '../lib/logger'

const LOW_RATING_THRESHOLD = 3.0
const LOW_RATING_WINDOW = 3

export const createBrokerService = (db: Database) => ({
  // 業者一覧
  async list() {
    return db.select().from(brokers).orderBy(desc(brokers.createdAt))
  },

  // 業者詳細
  async getById(id: string) {
    const result = await db.select().from(brokers).where(eq(brokers.id, id)).limit(1)
    if (result.length === 0) {
      throw notFound('業者')
    }
    return result[0]
  },

  // 業者登録（管理者が行う）
  async register(input: RegisterBrokerInput) {
    // まずユーザーアカウントを作成
    const userResult = await db.insert(users).values({
      role: 'broker',
      email: input.email,
      name: input.contactPersonName,
      phone: input.phone,
      address: input.address,
    }).returning()

    const result = await db.insert(brokers).values({
      userId: userResult[0].id,
      companyName: input.companyName,
      representativeName: input.representativeName,
      address: input.address,
      licenseNumber: input.licenseNumber,
      contactPersonName: input.contactPersonName,
      bankName: input.bankName,
      bankBranch: input.bankBranch,
      bankAccountType: input.bankAccountType,
      bankAccountNumber: input.bankAccountNumber,
      invoiceNumber: input.invoiceNumber,
    }).returning()

    return result[0]
  },

  // 評価登録
  async evaluate(brokerId: string, evaluatorId: string, input: EvaluateBrokerInput) {
    const broker = await this.getById(brokerId)

    const result = await db.insert(brokerEvaluations).values({
      brokerId,
      evaluatorId,
      propertyId: input.propertyId,
      speedRating: input.speedRating,
      clarityRating: input.clarityRating,
      politenessRating: input.politenessRating,
      overallRating: input.overallRating,
      comment: input.comment,
    }).returning()

    // 直近N件の平均評価を算出し、閾値を下回ったら管理者にアラート
    try {
      const recent = await this.getRecentAverage(brokerId)
      if (recent.count >= LOW_RATING_WINDOW && recent.average < LOW_RATING_THRESHOLD) {
        await this.notifyAdminsLowRating(broker.id, broker.companyName, recent.average, recent.count)
      }
    } catch (err) {
      logger.error('低評価アラート判定に失敗', { brokerId, error: err })
    }

    return result[0]
  },

  // 直近N件の平均評価（overallRating）
  async getRecentAverage(brokerId: string) {
    const rows = await db.select({ overallRating: brokerEvaluations.overallRating })
      .from(brokerEvaluations)
      .where(eq(brokerEvaluations.brokerId, brokerId))
      .orderBy(desc(brokerEvaluations.createdAt))
      .limit(LOW_RATING_WINDOW)

    if (rows.length === 0) {
      return { average: 0, count: 0 }
    }
    const sum = rows.reduce((acc, r) => acc + Number(r.overallRating ?? 0), 0)
    return { average: sum / rows.length, count: rows.length }
  },

  // 管理者宛の低評価通知
  async notifyAdminsLowRating(brokerId: string, companyName: string, average: number, count: number) {
    const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin'))
    const notifier = createNotificationService(db)
    const title = '業者の低評価アラート'
    const body = `${companyName} の直近${count}件の平均評価が ${average.toFixed(2)} となり、閾値(${LOW_RATING_THRESHOLD})を下回りました。対応をご検討ください。`

    for (const admin of admins) {
      await notifier.createSilently(
        {
          userId: admin.id,
          event: NOTIFICATION_EVENT.BROKER_LOW_RATING,
          channel: 'system',
          title,
          body,
          relatedEntityType: 'broker',
          relatedEntityId: brokerId,
          alsoEmail: true,
        },
        { brokerId, adminId: admin.id },
      )
    }
  },

  // 評価一覧
  async getEvaluations(brokerId: string) {
    return db.select()
      .from(brokerEvaluations)
      .where(eq(brokerEvaluations.brokerId, brokerId))
      .orderBy(desc(brokerEvaluations.createdAt))
  },

  // 業者一覧 + 低評価フラグ
  async listWithRatingStatus() {
    const list = await this.list()
    const enriched = await Promise.all(list.map(async (b) => {
      const recent = await this.getRecentAverage(b.id)
      return {
        ...b,
        recentAverage: recent.count > 0 ? Number(recent.average.toFixed(2)) : null,
        recentCount: recent.count,
        lowRatingAlert: recent.count >= LOW_RATING_WINDOW && recent.average < LOW_RATING_THRESHOLD,
      }
    }))
    return enriched
  },

  // 成約数インクリメント
  async incrementDealCount(id: string) {
    const broker = await this.getById(id)
    await db.update(brokers)
      .set({ totalDeals: broker.totalDeals + 1, updatedAt: new Date() })
      .where(eq(brokers.id, id))
  },
})
