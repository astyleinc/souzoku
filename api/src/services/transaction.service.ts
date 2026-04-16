import { eq, desc, and, sql, count, sum, gte, lte } from 'drizzle-orm'
import type { Database } from '../db/client'
import { cases } from '../db/schema/cases'
import { properties } from '../db/schema/properties'
import { users } from '../db/schema/users'
import { revenueDistributions, payments } from '../db/schema/revenue'
import { invoices } from '../db/schema/invoices'
import { professionals } from '../db/schema/professionals'
import { brokers } from '../db/schema/brokers'
import { notFound, forbidden } from '../lib/errors'
import type { TransactionQuery, RevenueQuery, InvoiceQuery } from '../schemas/transaction'

// ページネーション結果の組み立て
const buildPaginatedResult = <T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
) => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
})

export const createTransactionService = (db: Database) => ({
  // 売主の取引一覧
  async listSellerTransactions(sellerId: string, query: TransactionQuery) {
    const { page, limit, status } = query
    const offset = (page - 1) * limit

    const conditions = [eq(cases.sellerId, sellerId)]
    if (status) {
      conditions.push(eq(cases.status, status as typeof cases.status.enumValues[number]))
    }

    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions)

    const [items, totalResult] = await Promise.all([
      db.select({
        id: cases.id,
        status: cases.status,
        createdAt: cases.createdAt,
        updatedAt: cases.updatedAt,
        propertyId: cases.propertyId,
        propertyTitle: properties.title,
        askingPrice: properties.askingPrice,
        buyerName: users.name,
        salePrice: revenueDistributions.salePrice,
      })
        .from(cases)
        .innerJoin(properties, eq(cases.propertyId, properties.id))
        .innerJoin(users, eq(cases.buyerId, users.id))
        .leftJoin(revenueDistributions, eq(revenueDistributions.caseId, cases.id))
        .where(whereClause)
        .orderBy(desc(cases.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() })
        .from(cases)
        .where(whereClause),
    ])

    return buildPaginatedResult(items, totalResult[0].total, page, limit)
  },

  // 買い手の取引一覧
  async listBuyerTransactions(buyerId: string, query: TransactionQuery) {
    const { page, limit, status } = query
    const offset = (page - 1) * limit

    const conditions = [eq(cases.buyerId, buyerId)]
    if (status) {
      conditions.push(eq(cases.status, status as typeof cases.status.enumValues[number]))
    }

    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions)

    const [items, totalResult] = await Promise.all([
      db.select({
        id: cases.id,
        status: cases.status,
        createdAt: cases.createdAt,
        updatedAt: cases.updatedAt,
        propertyId: cases.propertyId,
        propertyTitle: properties.title,
        askingPrice: properties.askingPrice,
        sellerName: users.name,
        salePrice: revenueDistributions.salePrice,
      })
        .from(cases)
        .innerJoin(properties, eq(cases.propertyId, properties.id))
        .innerJoin(users, eq(cases.sellerId, users.id))
        .leftJoin(revenueDistributions, eq(revenueDistributions.caseId, cases.id))
        .where(whereClause)
        .orderBy(desc(cases.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() })
        .from(cases)
        .where(whereClause),
    ])

    return buildPaginatedResult(items, totalResult[0].total, page, limit)
  },

  // 取引詳細（アクセス権チェック付き）
  async getTransaction(caseId: string, userId: string, userRole: string) {
    const result = await db.select({
      id: cases.id,
      status: cases.status,
      cancelReason: cases.cancelReason,
      explanationDocUrl: cases.explanationDocUrl,
      contractDocUrl: cases.contractDocUrl,
      settlementDocUrl: cases.settlementDocUrl,
      createdAt: cases.createdAt,
      updatedAt: cases.updatedAt,
      propertyId: cases.propertyId,
      propertyTitle: properties.title,
      askingPrice: properties.askingPrice,
      prefecture: properties.prefecture,
      city: properties.city,
      sellerId: cases.sellerId,
      buyerId: cases.buyerId,
      brokerId: cases.brokerId,
      salePrice: revenueDistributions.salePrice,
      brokerageFee: revenueDistributions.brokerageFee,
      brokerageFeeWithTax: revenueDistributions.brokerageFeeWithTax,
    })
      .from(cases)
      .innerJoin(properties, eq(cases.propertyId, properties.id))
      .leftJoin(revenueDistributions, eq(revenueDistributions.caseId, cases.id))
      .where(eq(cases.id, caseId))
      .limit(1)

    if (result.length === 0) {
      throw notFound('取引')
    }

    const transaction = result[0]

    // アクセス権チェック（管理者は常にアクセス可能）
    if (userRole !== 'admin') {
      const hasAccess =
        transaction.sellerId === userId ||
        transaction.buyerId === userId ||
        await this.isBrokerUser(userId, transaction.brokerId)

      if (!hasAccess) {
        throw forbidden('この取引へのアクセス権がありません')
      }
    }

    // 関係者名を取得
    const [sellerResult, buyerResult] = await Promise.all([
      db.select({ name: users.name }).from(users).where(eq(users.id, transaction.sellerId)).limit(1),
      db.select({ name: users.name }).from(users).where(eq(users.id, transaction.buyerId)).limit(1),
    ])

    return {
      ...transaction,
      sellerName: sellerResult[0]?.name ?? null,
      buyerName: buyerResult[0]?.name ?? null,
    }
  },

  // 業者のユーザーIDチェック
  async isBrokerUser(userId: string, brokerId: string) {
    const result = await db.select({ id: brokers.id })
      .from(brokers)
      .where(and(eq(brokers.id, brokerId), eq(brokers.userId, userId)))
      .limit(1)
    return result.length > 0
  },

  // 士業の報酬一覧
  async listProfessionalRevenue(professionalId: string, query: RevenueQuery) {
    const { page, limit, from, to } = query
    const offset = (page - 1) * limit

    const conditions = [eq(revenueDistributions.professionalId, professionalId)]
    if (from) {
      conditions.push(gte(revenueDistributions.createdAt, new Date(from)))
    }
    if (to) {
      conditions.push(lte(revenueDistributions.createdAt, new Date(to)))
    }

    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions)

    const [items, totalResult] = await Promise.all([
      db.select({
        id: revenueDistributions.id,
        caseId: revenueDistributions.caseId,
        propertyId: revenueDistributions.propertyId,
        propertyTitle: properties.title,
        salePrice: revenueDistributions.salePrice,
        professionalAmount: revenueDistributions.professionalAmount,
        professionalRate: revenueDistributions.professionalRate,
        isNwReferral: revenueDistributions.isNwReferral,
        caseStatus: cases.status,
        createdAt: revenueDistributions.createdAt,
      })
        .from(revenueDistributions)
        .innerJoin(properties, eq(revenueDistributions.propertyId, properties.id))
        .innerJoin(cases, eq(revenueDistributions.caseId, cases.id))
        .where(whereClause)
        .orderBy(desc(revenueDistributions.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() })
        .from(revenueDistributions)
        .where(whereClause),
    ])

    return buildPaginatedResult(items, totalResult[0].total, page, limit)
  },

  // 士業の報酬サマリー
  async getProfessionalRevenueSummary(professionalId: string) {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalResult, thisMonthResult, pendingResult] = await Promise.all([
      // 合計報酬額と案件数
      db.select({
        totalEarned: sum(revenueDistributions.professionalAmount),
        totalCases: count(),
      })
        .from(revenueDistributions)
        .where(eq(revenueDistributions.professionalId, professionalId)),

      // 今月の報酬額
      db.select({
        thisMonthEarned: sum(revenueDistributions.professionalAmount),
      })
        .from(revenueDistributions)
        .where(and(
          eq(revenueDistributions.professionalId, professionalId),
          gte(revenueDistributions.createdAt, monthStart),
        )),

      // 未払い（未請求）の支払い合計
      db.select({
        pendingAmount: sum(payments.amount),
      })
        .from(payments)
        .innerJoin(revenueDistributions, eq(payments.revenueDistributionId, revenueDistributions.id))
        .where(and(
          eq(revenueDistributions.professionalId, professionalId),
          eq(payments.payeeType, 'professional'),
          eq(payments.status, 'not_invoiced'),
        )),
    ])

    return {
      totalEarned: Number(totalResult[0].totalEarned ?? 0),
      totalCases: totalResult[0].totalCases,
      thisMonthEarned: Number(thisMonthResult[0].thisMonthEarned ?? 0),
      pendingPayments: Number(pendingResult[0].pendingAmount ?? 0),
    }
  },

  // 業者の収益一覧
  async listBrokerRevenue(brokerId: string, query: RevenueQuery) {
    const { page, limit, from, to } = query
    const offset = (page - 1) * limit

    const conditions = [eq(revenueDistributions.brokerId, brokerId)]
    if (from) {
      conditions.push(gte(revenueDistributions.createdAt, new Date(from)))
    }
    if (to) {
      conditions.push(lte(revenueDistributions.createdAt, new Date(to)))
    }

    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions)

    const [items, totalResult] = await Promise.all([
      db.select({
        id: revenueDistributions.id,
        caseId: revenueDistributions.caseId,
        propertyId: revenueDistributions.propertyId,
        propertyTitle: properties.title,
        salePrice: revenueDistributions.salePrice,
        brokerageFee: revenueDistributions.brokerageFee,
        brokerageFeeWithTax: revenueDistributions.brokerageFeeWithTax,
        brokerAmount: revenueDistributions.brokerAmount,
        brokerRate: revenueDistributions.brokerRate,
        isNwReferral: revenueDistributions.isNwReferral,
        caseStatus: cases.status,
        createdAt: revenueDistributions.createdAt,
      })
        .from(revenueDistributions)
        .innerJoin(properties, eq(revenueDistributions.propertyId, properties.id))
        .innerJoin(cases, eq(revenueDistributions.caseId, cases.id))
        .where(whereClause)
        .orderBy(desc(revenueDistributions.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() })
        .from(revenueDistributions)
        .where(whereClause),
    ])

    return buildPaginatedResult(items, totalResult[0].total, page, limit)
  },

  // 業者の請求書一覧
  async listBrokerInvoices(brokerId: string, query: InvoiceQuery) {
    const { page, limit, status } = query
    const offset = (page - 1) * limit

    const conditions = [eq(invoices.brokerId, brokerId)]
    if (status) {
      conditions.push(eq(invoices.status, status))
    }

    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions)

    const [items, totalResult] = await Promise.all([
      db.select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        amount: invoices.amount,
        taxAmount: invoices.taxAmount,
        totalAmount: invoices.totalAmount,
        status: invoices.status,
        issuedAt: invoices.issuedAt,
        pdfUrl: invoices.pdfUrl,
        createdAt: invoices.createdAt,
      })
        .from(invoices)
        .where(whereClause)
        .orderBy(desc(invoices.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() })
        .from(invoices)
        .where(whereClause),
    ])

    return buildPaginatedResult(items, totalResult[0].total, page, limit)
  },

  // 請求書詳細
  async getInvoice(invoiceId: string, brokerId: string) {
    const result = await db.select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      amount: invoices.amount,
      taxAmount: invoices.taxAmount,
      totalAmount: invoices.totalAmount,
      status: invoices.status,
      issuedAt: invoices.issuedAt,
      pdfUrl: invoices.pdfUrl,
      createdAt: invoices.createdAt,
      updatedAt: invoices.updatedAt,
      paymentId: invoices.paymentId,
      paymentAmount: payments.amount,
      paymentStatus: payments.status,
      distributionId: revenueDistributions.id,
      salePrice: revenueDistributions.salePrice,
      brokerageFee: revenueDistributions.brokerageFee,
      propertyTitle: properties.title,
    })
      .from(invoices)
      .innerJoin(payments, eq(invoices.paymentId, payments.id))
      .innerJoin(revenueDistributions, eq(payments.revenueDistributionId, revenueDistributions.id))
      .innerJoin(properties, eq(revenueDistributions.propertyId, properties.id))
      .where(and(eq(invoices.id, invoiceId), eq(invoices.brokerId, brokerId)))
      .limit(1)

    if (result.length === 0) {
      throw notFound('請求書')
    }

    return result[0]
  },

  // 請求書の仮生成（プレースホルダー）
  async generateInvoicePdf(invoiceId: string, brokerId: string) {
    // 請求書の存在とアクセス権を確認
    const invoice = await this.getInvoice(invoiceId, brokerId)

    const pdfUrl = `/storage/invoices/${brokerId}/${invoiceId}.pdf`

    await db.update(invoices)
      .set({ pdfUrl, updatedAt: new Date() })
      .where(eq(invoices.id, invoiceId))

    return { ...invoice, pdfUrl }
  },

  // 管理者向け収益配分一覧（ページネーション付き）
  async getRevenueDistributions(query: RevenueQuery) {
    const { page, limit, from, to } = query
    const offset = (page - 1) * limit

    const conditions = []
    if (from) {
      conditions.push(gte(revenueDistributions.createdAt, new Date(from)))
    }
    if (to) {
      conditions.push(lte(revenueDistributions.createdAt, new Date(to)))
    }

    const whereClause = conditions.length > 0
      ? (conditions.length === 1 ? conditions[0] : and(...conditions))
      : undefined

    const [items, totalResult] = await Promise.all([
      db.select({
        id: revenueDistributions.id,
        caseId: revenueDistributions.caseId,
        propertyId: revenueDistributions.propertyId,
        propertyTitle: properties.title,
        salePrice: revenueDistributions.salePrice,
        brokerageFee: revenueDistributions.brokerageFee,
        brokerageFeeWithTax: revenueDistributions.brokerageFeeWithTax,
        brokerAmount: revenueDistributions.brokerAmount,
        ouverAmount: revenueDistributions.ouverAmount,
        professionalAmount: revenueDistributions.professionalAmount,
        nwAmount: revenueDistributions.nwAmount,
        isNwReferral: revenueDistributions.isNwReferral,
        createdAt: revenueDistributions.createdAt,
      })
        .from(revenueDistributions)
        .innerJoin(properties, eq(revenueDistributions.propertyId, properties.id))
        .where(whereClause)
        .orderBy(desc(revenueDistributions.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() })
        .from(revenueDistributions)
        .where(whereClause),
    ])

    return buildPaginatedResult(items, totalResult[0].total, page, limit)
  },

  // ユーザーIDから士業レコードを取得
  async getProfessionalByUserId(userId: string) {
    const result = await db.select()
      .from(professionals)
      .where(eq(professionals.userId, userId))
      .limit(1)
    if (result.length === 0) {
      throw notFound('士業登録')
    }
    return result[0]
  },

  // ユーザーIDから業者レコードを取得
  async getBrokerByUserId(userId: string) {
    const result = await db.select()
      .from(brokers)
      .where(eq(brokers.userId, userId))
      .limit(1)
    if (result.length === 0) {
      throw notFound('業者登録')
    }
    return result[0]
  },
})
