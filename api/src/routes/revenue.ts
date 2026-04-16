import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { updatePaymentStatusSchema } from '../schemas/admin'
import type { UpdatePaymentStatusInput } from '../schemas/admin'
import { services } from '../lib/services'
import { ok } from '../lib/response'

export const revenueRoutes = new Hono()

revenueRoutes.use('/:id', validateUuidParam('id'))
revenueRoutes.use('/:id/*', validateUuidParam('id'))

revenueRoutes.get('/', auth, requireRole('admin'), async (c) => {
  const distributions = await services.revenue.list()
  return ok(c, distributions)
})

revenueRoutes.get('/:id', auth, requireRole('admin'), async (c) => {
  const distribution = await services.revenue.getById(c.req.param('id'))
  return ok(c, distribution)
})

revenueRoutes.get('/:id/payments', auth, requireRole('admin'), async (c) => {
  const payments = await services.revenue.getPayments(c.req.param('id'))
  return ok(c, payments)
})

revenueRoutes.patch('/payments/:paymentId/status', auth, requireRole('admin'), validateUuidParam('paymentId'), validateBody(updatePaymentStatusSchema), async (c) => {
  const input = c.get('validatedBody') as UpdatePaymentStatusInput
  const user = c.get('user')
  const payment = await services.revenue.updatePaymentStatus(c.req.param('paymentId'), input.status, user.id)
  return ok(c, payment)
})
