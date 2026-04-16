import { eq, desc } from 'drizzle-orm'
import type { Database } from '../db/client'
import { cases, caseMessages } from '../db/schema/cases'
import type { CreateCaseInput, UpdateCaseStatusInput, SendMessageInput } from '../schemas/case'
import { AppError, ERROR_CODE, notFound } from '../lib/errors'

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

    return result[0]
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
