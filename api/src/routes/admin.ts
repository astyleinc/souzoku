import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { updateStatusSchema, assignBrokerSchema, updateVerificationSchema } from '../schemas/admin'
import type { UpdateStatusInput, AssignBrokerInput, UpdateVerificationInput } from '../schemas/admin'
import { services } from '../lib/services'
import { ok } from '../lib/response'

export const adminRoutes = new Hono()

adminRoutes.use('*', auth, requireRole('admin'))

adminRoutes.get('/dashboard', async (c) => {
  // TODO: 実際の集計クエリに差し替え
  return ok(c, {
    properties: { total: 0, reviewing: 0, published: 0, bidding: 0, closed: 0 },
    bids: { total: 0, active: 0 },
    revenue: { monthlyTotal: 0, monthlyOuver: 0, pendingPayments: 0 },
    professionals: { total: 0, verified: 0, pending: 0 },
    brokers: { total: 0, averageRating: 0 },
  })
})

adminRoutes.get('/professionals', async (c) => {
  const professionals = await services.professional.list()
  return ok(c, professionals)
})

adminRoutes.patch('/professionals/:id/verification', validateUuidParam('id'), validateBody(updateVerificationSchema), async (c) => {
  const input = c.get('validatedBody') as UpdateVerificationInput
  const result = await services.professional.updateVerificationStatus(c.req.param('id'), input.status)
  return ok(c, result)
})

adminRoutes.patch('/properties/:id/approve', validateUuidParam('id'), validateBody(assignBrokerSchema), async (c) => {
  const input = c.get('validatedBody') as AssignBrokerInput
  await services.property.assignBroker(c.req.param('id'), input.assignedBrokerId)
  const result = await services.property.updateStatus(c.req.param('id'), 'published')
  return ok(c, result)
})

adminRoutes.patch('/properties/:id/return', validateUuidParam('id'), validateBody(updateStatusSchema), async (c) => {
  const input = c.get('validatedBody') as UpdateStatusInput
  const result = await services.property.updateStatus(c.req.param('id'), 'returned', input.returnReason)
  return ok(c, result)
})

adminRoutes.patch('/properties/:id/close', validateUuidParam('id'), async (c) => {
  const result = await services.property.updateStatus(c.req.param('id'), 'closed')
  return ok(c, result)
})
