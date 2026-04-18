import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateQuery } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { transactionQuerySchema } from '../schemas/transaction'
import type { TransactionQuery } from '../schemas/transaction'
import { services } from '../lib/services'
import { ok, paginated } from '../lib/response'
import { getValidatedQuery, getCurrentUser } from '../lib/context-helpers'

export const transactionRoutes = new Hono()

transactionRoutes.use('/:id', validateUuidParam('id'))

// 売主の取引履歴
transactionRoutes.get(
  '/seller',
  auth,
  requireRole('seller'),
  validateQuery(transactionQuerySchema),
  async (c) => {
    const user = getCurrentUser(c)
    const query = getValidatedQuery<TransactionQuery>(c)
    const result = await services.transaction.listSellerTransactions(user.id, query)
    return paginated(c, result)
  },
)

// 買い手の取引履歴
transactionRoutes.get(
  '/buyer',
  auth,
  requireRole('buyer'),
  validateQuery(transactionQuerySchema),
  async (c) => {
    const user = getCurrentUser(c)
    const query = getValidatedQuery<TransactionQuery>(c)
    const result = await services.transaction.listBuyerTransactions(user.id, query)
    return paginated(c, result)
  },
)

// 取引詳細
transactionRoutes.get(
  '/:id',
  auth,
  async (c) => {
    const user = getCurrentUser(c)
    const caseId = c.req.param('id')
    const result = await services.transaction.getTransaction(caseId, user.id, user.role)
    return ok(c, result)
  },
)
