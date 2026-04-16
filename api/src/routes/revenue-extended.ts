import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateQuery } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { revenueQuerySchema, invoiceQuerySchema } from '../schemas/transaction'
import type { RevenueQuery, InvoiceQuery } from '../schemas/transaction'
import { services } from '../lib/services'
import { ok, paginated } from '../lib/response'

export const revenueExtendedRoutes = new Hono()

// 士業の報酬一覧
revenueExtendedRoutes.get(
  '/professional/me',
  auth,
  requireRole('professional'),
  validateQuery(revenueQuerySchema),
  async (c) => {
    const user = c.get('user')
    const query = c.get('validatedQuery') as RevenueQuery
    const professional = await services.transaction.getProfessionalByUserId(user.id)
    const result = await services.transaction.listProfessionalRevenue(professional.id, query)
    return paginated(c, result)
  },
)

// 士業の報酬サマリー
revenueExtendedRoutes.get(
  '/professional/me/summary',
  auth,
  requireRole('professional'),
  async (c) => {
    const user = c.get('user')
    const professional = await services.transaction.getProfessionalByUserId(user.id)
    const result = await services.transaction.getProfessionalRevenueSummary(professional.id)
    return ok(c, result)
  },
)

// 業者の収益一覧
revenueExtendedRoutes.get(
  '/broker/me',
  auth,
  requireRole('broker'),
  validateQuery(revenueQuerySchema),
  async (c) => {
    const user = c.get('user')
    const query = c.get('validatedQuery') as RevenueQuery
    const broker = await services.transaction.getBrokerByUserId(user.id)
    const result = await services.transaction.listBrokerRevenue(broker.id, query)
    return paginated(c, result)
  },
)

// 業者の請求書一覧
revenueExtendedRoutes.get(
  '/broker/me/invoices',
  auth,
  requireRole('broker'),
  validateQuery(invoiceQuerySchema),
  async (c) => {
    const user = c.get('user')
    const query = c.get('validatedQuery') as InvoiceQuery
    const broker = await services.transaction.getBrokerByUserId(user.id)
    const result = await services.transaction.listBrokerInvoices(broker.id, query)
    return paginated(c, result)
  },
)

// 業者の請求書詳細
revenueExtendedRoutes.get(
  '/broker/me/invoices/:id',
  auth,
  requireRole('broker'),
  validateUuidParam('id'),
  async (c) => {
    const user = c.get('user')
    const invoiceId = c.req.param('id')
    const broker = await services.transaction.getBrokerByUserId(user.id)
    const result = await services.transaction.getInvoice(invoiceId, broker.id)
    return ok(c, result)
  },
)

// 業者の請求書の仮生成
revenueExtendedRoutes.post(
  '/broker/me/invoices/:id/pdf',
  auth,
  requireRole('broker'),
  validateUuidParam('id'),
  async (c) => {
    const user = c.get('user')
    const invoiceId = c.req.param('id')
    const broker = await services.transaction.getBrokerByUserId(user.id)
    const result = await services.transaction.generateInvoicePdf(invoiceId, broker.id)
    return ok(c, result)
  },
)

// 管理者向け収益配分一覧
revenueExtendedRoutes.get(
  '/distributions',
  auth,
  requireRole('admin'),
  validateQuery(revenueQuerySchema),
  async (c) => {
    const query = c.get('validatedQuery') as RevenueQuery
    const result = await services.transaction.getRevenueDistributions(query)
    return paginated(c, result)
  },
)
