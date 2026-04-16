import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { createCaseSchema, updateCaseStatusSchema, sendMessageSchema } from '../schemas/case'
import type { CreateCaseInput, UpdateCaseStatusInput, SendMessageInput } from '../schemas/case'
import { services } from '../lib/services'
import { ok, created } from '../lib/response'
import { forbidden } from '../lib/errors'
import type { AuthUser } from '../middleware/auth'

export const caseRoutes = new Hono()

caseRoutes.use('/:id', validateUuidParam('id'))
caseRoutes.use('/:id/*', validateUuidParam('id'))

// 案件の関係者チェック
const checkCaseAccess = async (caseId: string, user: AuthUser) => {
  if (user.role === 'admin') return
  const caseItem = await services.case.getById(caseId)
  const isBroker = user.role === 'broker'
  const isSeller = caseItem.sellerId === user.id
  const isBuyer = caseItem.buyerId === user.id
  if (!isSeller && !isBuyer && !isBroker) {
    throw forbidden('この案件にアクセスする権限がありません')
  }
}

caseRoutes.get('/', auth, requireRole('admin', 'broker'), async (c) => {
  const cases = await services.case.list()
  return ok(c, cases)
})

caseRoutes.get('/:id', auth, async (c) => {
  await checkCaseAccess(c.req.param('id'), c.get('user'))
  const caseItem = await services.case.getById(c.req.param('id'))
  return ok(c, caseItem)
})

caseRoutes.post('/', auth, requireRole('admin'), validateBody(createCaseSchema), async (c) => {
  const input = c.get('validatedBody') as CreateCaseInput
  const caseItem = await services.case.create(input)
  return created(c, caseItem)
})

caseRoutes.patch('/:id/status', auth, requireRole('broker', 'admin'), validateBody(updateCaseStatusSchema), async (c) => {
  const input = c.get('validatedBody') as UpdateCaseStatusInput
  const caseItem = await services.case.updateStatus(c.req.param('id'), input)
  return ok(c, caseItem)
})

caseRoutes.get('/:id/messages', auth, async (c) => {
  await checkCaseAccess(c.req.param('id'), c.get('user'))
  const messages = await services.case.getMessages(c.req.param('id'))
  return ok(c, messages)
})

caseRoutes.post('/:id/messages', auth, validateBody(sendMessageSchema), async (c) => {
  const user = c.get('user')
  await checkCaseAccess(c.req.param('id'), user)
  const input = c.get('validatedBody') as SendMessageInput
  const message = await services.case.sendMessage(c.req.param('id'), user.id, input)
  return created(c, message)
})
