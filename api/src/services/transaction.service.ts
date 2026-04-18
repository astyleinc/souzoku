import { eq, desc, and, sql, count, sum, gte, lte } from 'drizzle-orm'
import type { Database } from '../db/client'
import { cases } from '../db/schema/cases'
import { properties } from '../db/schema/properties'
import { users } from '../db/schema/users'
import { revenueDistributions, payments } from '../db/schema/revenue'
import { invoices } from '../db/schema/invoices'
import { professionals, nwCompanies } from '../db/schema/professionals'
import { brokers } from '../db/schema/brokers'
import { notFound, forbidden } from '../lib/errors'
import type { TransactionQuery, RevenueQuery, InvoiceQuery } from '../schemas/transaction'
import { renderInvoicePdf, type InvoiceTarget } from '../lib/pdf/invoice'
import { storage } from '../lib/storage'
import { logger } from '../lib/logger'

const INVOICE_BUCKET = 'invoices'

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

  // 請求書PDFを生成して Storage にアップロード
  async generateInvoicePdf(invoiceId: string, brokerId: string) {
    const invoice = await this.getInvoice(invoiceId, brokerId)
    const pdfUrl = await this._renderAndUploadInvoice(invoiceId)
    return { ...invoice, pdfUrl }
  },

  // 管理者向け: 対象種別を問わず PDF を生成（士業・NW支払調書含む）
  async generateInvoicePdfByAdmin(invoiceId: string) {
    const row = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1)
    if (row.length === 0) throw notFound('請求書')
    const pdfUrl = await this._renderAndUploadInvoice(invoiceId)
    return { ...row[0], pdfUrl }
  },

  // 管理者向け: 支払IDから請求書を自動作成してPDF生成
  async ensureInvoicePdfForPayment(paymentId: string) {
    // 支払・配分・請求書の結合
    const rows = await db.select({
      payment: payments,
      distribution: revenueDistributions,
    })
      .from(payments)
      .innerJoin(revenueDistributions, eq(payments.revenueDistributionId, revenueDistributions.id))
      .where(eq(payments.id, paymentId))
      .limit(1)
    if (rows.length === 0) throw notFound('支払い')
    const { payment, distribution } = rows[0]

    const targetMap: Record<string, InvoiceTarget> = { broker: 'broker', professional: 'professional', nw: 'nw' }
    const target = targetMap[payment.payeeType] ?? 'broker'

    // 既存の請求書を確認（payment にひもづく最新の1件）
    const existing = await db.select().from(invoices).where(eq(invoices.paymentId, paymentId)).limit(1)

    let invoiceId: string
    if (existing.length > 0) {
      invoiceId = existing[0].id
    } else {
      const amount = Number(payment.amount)
      const taxAmount = Math.round(amount * 0.1)
      const totalAmount = amount + taxAmount
      const invoiceNumber = `INV-${new Date().getFullYear()}-${paymentId.slice(0, 8).toUpperCase()}`
      const inserted = await db.insert(invoices).values({
        paymentId,
        brokerId: distribution.brokerId,
        targetType: target,
        invoiceNumber,
        amount,
        taxAmount,
        totalAmount,
        status: 'draft',
      }).returning()
      invoiceId = inserted[0].id
    }

    const pdfUrl = await this._renderAndUploadInvoice(invoiceId)
    return { invoiceId, pdfUrl }
  },

  // 内部ヘルパー: invoiceId から関連情報を集めて PDF を生成・アップロード
  async _renderAndUploadInvoice(invoiceId: string): Promise<string> {
    const row = await db.select({
      invoice: invoices,
      payment: payments,
      distribution: revenueDistributions,
      property: properties,
    })
      .from(invoices)
      .innerJoin(payments, eq(invoices.paymentId, payments.id))
      .innerJoin(revenueDistributions, eq(payments.revenueDistributionId, revenueDistributions.id))
      .innerJoin(properties, eq(revenueDistributions.propertyId, properties.id))
      .where(eq(invoices.id, invoiceId))
      .limit(1)

    if (row.length === 0) throw notFound('請求書')

    const { invoice, payment, distribution, property } = row[0]
    const target = invoice.targetType as InvoiceTarget

    // 宛先（請求書を受け取る側）名称の解決
    let recipientName = ''
    let recipientAddress: string | undefined
    if (target === 'broker') {
      const b = await db.select().from(brokers).where(eq(brokers.id, payment.payeeId)).limit(1)
      recipientName = b[0]?.companyName ?? '業者'
      recipientAddress = b[0]?.address ?? undefined
    } else if (target === 'professional') {
      const rows = await db.select({ name: users.name, officeName: professionals.officeName, officeAddress: professionals.officeAddress })
        .from(professionals)
        .innerJoin(users, eq(users.id, professionals.userId))
        .where(eq(professionals.id, payment.payeeId))
        .limit(1)
      recipientName = rows[0]?.officeName || rows[0]?.name || '士業'
      recipientAddress = rows[0]?.officeAddress ?? undefined
    } else {
      const rows = await db.select().from(nwCompanies).where(eq(nwCompanies.id, payment.payeeId)).limit(1)
      recipientName = rows[0]?.name ?? 'NW会社'
    }

    const amount = Number(invoice.amount)
    const taxAmount = Number(invoice.taxAmount)
    const totalAmount = Number(invoice.totalAmount)

    const descriptionByTarget: Record<InvoiceTarget, string> = {
      broker: `仲介手数料（物件: ${property.title}）`,
      professional: `紹介料（物件: ${property.title}）`,
      nw: `紹介ロイヤリティ（物件: ${property.title}）`,
    }

    const pdfBytes = await renderInvoicePdf({
      target,
      invoiceNumber: invoice.invoiceNumber,
      issuedAt: invoice.issuedAt ?? new Date(),
      issuerName: '株式会社Ouver',
      issuerAddress: process.env.INVOICE_ISSUER_ADDRESS,
      issuerQualifiedNumber: process.env.INVOICE_ISSUER_QUALIFIED_NUMBER,
      recipientName,
      recipientAddress,
      items: [{
        description: descriptionByTarget[target],
        quantity: 1,
        unitPrice: amount,
      }],
      amount,
      taxAmount,
      totalAmount,
      note: `配分対象: 売買価格 ${Number(distribution.salePrice).toLocaleString()} 円（片手: ${distribution.isOneSided ? 'あり' : 'なし'}）`,
    })

    const path = `${target}/${invoice.id}.pdf`
    let pdfUrl: string
    try {
      pdfUrl = await storage.uploadBinary(INVOICE_BUCKET, path, pdfBytes, 'application/pdf')
    } catch (err) {
      logger.error('請求書PDFのアップロードに失敗', { invoiceId, error: err })
      throw err
    }

    await db.update(invoices)
      .set({ pdfUrl, status: 'issued', issuedAt: invoice.issuedAt ?? new Date(), updatedAt: new Date() })
      .where(eq(invoices.id, invoiceId))

    return pdfUrl
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
