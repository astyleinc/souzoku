import { eq, desc } from 'drizzle-orm'
import type { Database } from '../db/client'
import { revenueDistributions, payments } from '../db/schema/revenue'
import { calculateRevenueDistribution } from '../lib/revenue'
import { notFound } from '../lib/errors'

export const createRevenueService = (db: Database) => ({
  // 収益配分を計算・記録
  async createDistribution(params: {
    caseId: string
    propertyId: string
    salePrice: number
    brokerId: string
    brokerTotalDeals: number
    professionalId?: string
    nwCompanyId?: string
    isNwReferral: boolean
  }) {
    const breakdown = calculateRevenueDistribution(
      params.salePrice,
      params.isNwReferral,
      params.brokerTotalDeals,
    )

    const result = await db.insert(revenueDistributions).values({
      caseId: params.caseId,
      propertyId: params.propertyId,
      salePrice: params.salePrice,
      brokerageFee: breakdown.brokerageFee,
      brokerageFeeWithTax: breakdown.brokerageFeeWithTax,
      brokerAmount: breakdown.brokerAmount,
      ouverAmount: breakdown.ouverAmount,
      professionalAmount: breakdown.professionalAmount,
      nwAmount: breakdown.nwAmount,
      brokerRate: String(breakdown.brokerRate),
      ouverRate: String(breakdown.ouverRate),
      professionalRate: String(breakdown.professionalRate),
      nwRate: String(breakdown.nwRate),
      brokerId: params.brokerId,
      professionalId: params.professionalId,
      nwCompanyId: params.nwCompanyId,
      isNwReferral: params.isNwReferral ? 'true' : 'false',
    }).returning()

    const distribution = result[0]

    // 支払いレコードを作成（業者→Ouver以外の3者への支払い）
    const paymentRecords = [
      { payeeType: 'professional', payeeId: params.professionalId, amount: breakdown.professionalAmount },
      { payeeType: 'nw', payeeId: params.nwCompanyId, amount: breakdown.nwAmount },
    ].filter((p) => p.payeeId && p.amount > 0)

    if (paymentRecords.length > 0) {
      await db.insert(payments).values(
        paymentRecords.map((p) => ({
          revenueDistributionId: distribution.id,
          payeeType: p.payeeType,
          payeeId: p.payeeId!,
          amount: p.amount,
        })),
      )
    }

    return distribution
  },

  // 収益配分一覧
  async list() {
    return db.select()
      .from(revenueDistributions)
      .orderBy(desc(revenueDistributions.createdAt))
  },

  // 収益配分詳細
  async getById(id: string) {
    const result = await db.select()
      .from(revenueDistributions)
      .where(eq(revenueDistributions.id, id))
      .limit(1)
    if (result.length === 0) {
      throw notFound('収益配分')
    }
    return result[0]
  },

  // 支払い一覧
  async getPayments(distributionId: string) {
    return db.select()
      .from(payments)
      .where(eq(payments.revenueDistributionId, distributionId))
  },

  // 支払いステータス更新
  async updatePaymentStatus(
    paymentId: string,
    status: 'invoiced' | 'confirmed',
    confirmedBy?: string,
  ) {
    const updates: Record<string, unknown> = { status, updatedAt: new Date() }

    if (status === 'invoiced') {
      updates.invoicedAt = new Date()
    }
    if (status === 'confirmed') {
      updates.confirmedAt = new Date()
      updates.confirmedBy = confirmedBy
    }

    const result = await db.update(payments)
      .set(updates)
      .where(eq(payments.id, paymentId))
      .returning()

    if (result.length === 0) {
      throw notFound('支払い')
    }
    return result[0]
  },
})
