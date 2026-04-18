import { eq, desc } from 'drizzle-orm'
import type { Database } from '../db/client'
import { cases, caseMessages } from '../db/schema/cases'
import { properties } from '../db/schema/properties'
import { brokers } from '../db/schema/brokers'
import type { CreateCaseInput, UpdateCaseStatusInput, SendMessageInput } from '../schemas/case'
import { AppError, ERROR_CODE, notFound } from '../lib/errors'
import { createRevenueService } from './revenue.service'
import { createBrokerService } from './broker.service'
import { createNotificationService } from './notification.service'
import { logger } from '../lib/logger'
import { NOTIFICATION_EVENT } from '@shared/constants'

// 有効なステータス遷移の定義
const VALID_TRANSITIONS: Record<string, string[]> = {
  broker_assigned: ['seller_contacted', 'cancelled'],
  seller_contacted: ['buyer_contacted', 'cancelled'],
  buyer_contacted: ['explanation_done', 'cancelled'],
  explanation_done: ['contract_signed', 'cancelled'],
  contract_signed: ['settlement_done', 'cancelled'],
  settlement_done: [],
  cancelled: [],
}

export const createCaseService = (db: Database) => ({
  // 案件一覧
  async list() {
    return db.select().from(cases).orderBy(desc(cases.createdAt))
  },

  // 案件詳細
  async getById(id: string) {
    const result = await db.select().from(cases).where(eq(cases.id, id)).limit(1)
    if (result.length === 0) {
      throw notFound('案件')
    }
    return result[0]
  },

  // 案件作成
  async create(input: CreateCaseInput) {
    const result = await db.insert(cases).values(input).returning()
    return result[0]
  },

  // ステータス更新（遷移チェック付き）
  // settlement_done への遷移時に収益配分を自動生成する
  async updateStatus(id: string, input: UpdateCaseStatusInput) {
    const existing = await this.getById(id)
    const allowed = VALID_TRANSITIONS[existing.status]

    if (!allowed || !allowed.includes(input.status)) {
      throw new AppError(
        ERROR_CODE.INVALID_STATUS_TRANSITION,
        `「${existing.status}」から「${input.status}」への遷移は許可されていません`,
      )
    }

    const updates: Record<string, unknown> = {
      status: input.status,
      updatedAt: new Date(),
    }
    if (input.status === 'cancelled' && input.cancelReason) {
      updates.cancelReason = input.cancelReason
    }

    const result = await db.update(cases)
      .set(updates)
      .where(eq(cases.id, id))
      .returning()

    // 決済完了時に収益配分を自動生成
    if (input.status === 'settlement_done' && existing.status !== 'settlement_done') {
      try {
        await this.generateDistributionForCase(result[0])
      } catch (err) {
        // 配分生成失敗はステータス遷移を巻き戻さない（管理画面から手動リカバリ可）
        logger.error('決済後の収益配分生成に失敗', {
          caseId: id,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    // 案件関係者（売主）へステータス変更通知
    try {
      const property = await db.select({ sellerId: properties.sellerId, title: properties.title })
        .from(properties)
        .where(eq(properties.id, existing.propertyId))
        .limit(1)

      if (property.length > 0) {
        const isSettlement = input.status === 'settlement_done'
        await createNotificationService(db).create({
          userId: property[0].sellerId,
          event: isSettlement ? NOTIFICATION_EVENT.SETTLEMENT_DONE : NOTIFICATION_EVENT.CASE_STATUS_CHANGED,
          channel: 'email',
          title: isSettlement ? '決済が完了しました' : '案件ステータスが更新されました',
          body: isSettlement
            ? `「${property[0].title}」の決済が完了しました。ご取引ありがとうございました。`
            : `「${property[0].title}」の案件ステータスが「${input.status}」に更新されました。`,
          relatedEntityType: 'case',
          relatedEntityId: id,
          alsoEmail: true,
        })
      }
    } catch (err) {
      logger.error('案件ステータス通知の送信に失敗', {
        caseId: id,
        error: err instanceof Error ? err.message : String(err),
      })
    }

    return result[0]
  },

  // 決済完了後、成約価格に基づいて収益配分と業者成約数を更新する
  async generateDistributionForCase(caseRecord: typeof cases.$inferSelect) {
    // 成約価格を決定する: 即決承認された最高入札、または売主が選択した入札
    // ここでは物件の askingPrice をフォールバックとして使用（最高入札額は別途取得）
    const propertyResult = await db.select()
      .from(properties)
      .where(eq(properties.id, caseRecord.propertyId))
      .limit(1)

    if (propertyResult.length === 0) {
      throw new Error(`物件が見つかりません: ${caseRecord.propertyId}`)
    }
    const property = propertyResult[0]

    const brokerResult = await db.select()
      .from(brokers)
      .where(eq(brokers.id, caseRecord.brokerId))
      .limit(1)

    if (brokerResult.length === 0) {
      throw new Error(`業者が見つかりません: ${caseRecord.brokerId}`)
    }
    const broker = brokerResult[0]

    // NW経由判定: 紹介NW会社の有無で判断
    const isNwReferral = Boolean(property.referralNwCompanyId)

    const revenueService = createRevenueService(db)
    const brokerService = createBrokerService(db)

    // 成約価格の決定: 即決入札があればその額、なければ askingPrice
    // TODO: 売主が選択した入札額を参照するロジックを追加
    const salePrice = property.askingPrice

    const distribution = await revenueService.createDistribution({
      caseId: caseRecord.id,
      propertyId: property.id,
      salePrice,
      brokerId: broker.id,
      brokerTotalDeals: broker.totalDeals,
      professionalId: property.referringProfessionalId ?? undefined,
      nwCompanyId: property.referralNwCompanyId ?? undefined,
      isNwReferral,
      isOneSided: caseRecord.isOneSided,
    })

    await brokerService.incrementDealCount(broker.id)

    logger.info('決済後の収益配分を生成', {
      caseId: caseRecord.id,
      distributionId: distribution.id,
      salePrice,
      isOneSided: caseRecord.isOneSided,
      isNwReferral,
      brokerTotalDealsBefore: broker.totalDeals,
    })

    return distribution
  },

  // メッセージ一覧
  async getMessages(caseId: string) {
    return db.select()
      .from(caseMessages)
      .where(eq(caseMessages.caseId, caseId))
      .orderBy(caseMessages.createdAt)
  },

  // メッセージ送信
  async sendMessage(caseId: string, senderId: string, input: SendMessageInput) {
    // 案件の存在確認
    await this.getById(caseId)

    const result = await db.insert(caseMessages).values({
      caseId,
      senderId,
      body: input.body,
    }).returning()

    return result[0]
  },
})
