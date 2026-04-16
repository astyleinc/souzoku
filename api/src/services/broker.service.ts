import { eq, desc, avg } from 'drizzle-orm'
import type { Database } from '../db/client'
import { brokers, brokerEvaluations } from '../db/schema/brokers'
import { users } from '../db/schema/users'
import type { RegisterBrokerInput, EvaluateBrokerInput } from '../schemas/broker'
import { notFound } from '../lib/errors'

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
    await this.getById(brokerId)

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

    return result[0]
  },

  // 評価一覧
  async getEvaluations(brokerId: string) {
    return db.select()
      .from(brokerEvaluations)
      .where(eq(brokerEvaluations.brokerId, brokerId))
      .orderBy(desc(brokerEvaluations.createdAt))
  },

  // 成約数インクリメント
  async incrementDealCount(id: string) {
    const broker = await this.getById(id)
    await db.update(brokers)
      .set({ totalDeals: broker.totalDeals + 1, updatedAt: new Date() })
      .where(eq(brokers.id, id))
  },
})
