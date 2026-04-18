import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { updateStatusSchema, assignBrokerSchema, updateVerificationSchema } from '../schemas/admin'
import type { UpdateStatusInput, AssignBrokerInput, UpdateVerificationInput } from '../schemas/admin'
import { services } from '../lib/services'
import { ok } from '../lib/response'
import { getValidatedBody } from '../lib/context-helpers'

export const adminRoutes = new Hono()

adminRoutes.use('*', auth, requireRole('admin'))

adminRoutes.get('/dashboard', async (c) => {
  const result = await services.admin.getDashboard()
  return ok(c, result)
})

adminRoutes.get('/professionals', async (c) => {
  const professionals = await services.professional.list()
  return ok(c, professionals)
})

adminRoutes.patch('/professionals/:id/verification', validateUuidParam('id'), validateBody(updateVerificationSchema), async (c) => {
  const input = getValidatedBody<UpdateVerificationInput>(c)
  const result = await services.professional.updateVerificationStatus(c.req.param('id'), input.status)
  return ok(c, result)
})

adminRoutes.patch('/properties/:id/approve', validateUuidParam('id'), validateBody(assignBrokerSchema), async (c) => {
  const input = getValidatedBody<AssignBrokerInput>(c)
  await services.property.assignBroker(c.req.param('id'), input.assignedBrokerId)
  const result = await services.property.updateStatus(c.req.param('id'), 'published')
  return ok(c, result)
})

adminRoutes.patch('/properties/:id/return', validateUuidParam('id'), validateBody(updateStatusSchema), async (c) => {
  const input = getValidatedBody<UpdateStatusInput>(c)
  const result = await services.property.updateStatus(c.req.param('id'), 'returned', input.returnReason)
  return ok(c, result)
})

adminRoutes.patch('/properties/:id/close', validateUuidParam('id'), async (c) => {
  const result = await services.property.updateStatus(c.req.param('id'), 'closed')
  return ok(c, result)
})

// 売主の入札選択後、運営が業者を割当てて成約を確定（pending_approval → closed + case 作成）
adminRoutes.patch('/properties/:id/confirm-sale', validateUuidParam('id'), validateBody(assignBrokerSchema), async (c) => {
  const input = getValidatedBody<AssignBrokerInput>(c)
  const result = await services.admin.confirmSale(c.req.param('id'), input.assignedBrokerId)
  return ok(c, result)
})
