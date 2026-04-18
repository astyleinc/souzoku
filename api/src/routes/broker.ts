import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { registerBrokerSchema, evaluateBrokerSchema } from '../schemas/broker'
import type { RegisterBrokerInput, EvaluateBrokerInput } from '../schemas/broker'
import { services } from '../lib/services'
import { ok, created } from '../lib/response'
import { getValidatedBody, getCurrentUser } from '../lib/context-helpers'

export const brokerRoutes = new Hono()

brokerRoutes.use('/:id', validateUuidParam('id'))
brokerRoutes.use('/:id/*', validateUuidParam('id'))

brokerRoutes.get('/', auth, requireRole('admin'), async (c) => {
  const brokers = await services.broker.listWithRatingStatus()
  return ok(c, brokers)
})

brokerRoutes.get('/:id', auth, requireRole('admin', 'broker'), async (c) => {
  const broker = await services.broker.getById(c.req.param('id'))
  return ok(c, broker)
})

brokerRoutes.post('/', auth, requireRole('admin'), validateBody(registerBrokerSchema), async (c) => {
  const input = getValidatedBody<RegisterBrokerInput>(c)
  const broker = await services.broker.register(input)
  return created(c, broker)
})

brokerRoutes.post('/:id/evaluate', auth, requireRole('seller'), validateBody(evaluateBrokerSchema), async (c) => {
  const input = getValidatedBody<EvaluateBrokerInput>(c)
  const user = getCurrentUser(c)
  const evaluation = await services.broker.evaluate(c.req.param('id'), user.id, input)
  return created(c, evaluation)
})

brokerRoutes.get('/:id/evaluations', auth, requireRole('admin', 'broker'), async (c) => {
  const evaluations = await services.broker.getEvaluations(c.req.param('id'))
  return ok(c, evaluations)
})
