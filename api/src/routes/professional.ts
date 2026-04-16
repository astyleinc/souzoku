import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { registerProfessionalSchema, updateProfessionalSchema } from '../schemas/professional'
import { updateVerificationSchema } from '../schemas/admin'
import type { RegisterProfessionalInput, UpdateProfessionalInput } from '../schemas/professional'
import type { UpdateVerificationInput } from '../schemas/admin'
import { services } from '../lib/services'
import { ok, created } from '../lib/response'

export const professionalRoutes = new Hono()

professionalRoutes.use('/:id', validateUuidParam('id'))
professionalRoutes.use('/:id/*', validateUuidParam('id'))

professionalRoutes.post('/register', auth, validateBody(registerProfessionalSchema), async (c) => {
  const input = c.get('validatedBody') as RegisterProfessionalInput
  const user = c.get('user')
  const professional = await services.professional.register(input, user.id)
  return created(c, professional)
})

professionalRoutes.get('/me', auth, requireRole('professional'), async (c) => {
  const user = c.get('user')
  const professional = await services.professional.getByUserId(user.id)
  return ok(c, professional)
})

professionalRoutes.put('/:id', auth, requireRole('professional', 'admin'), validateBody(updateProfessionalSchema), async (c) => {
  const input = c.get('validatedBody') as UpdateProfessionalInput
  const user = c.get('user')
  const professional = await services.professional.update(c.req.param('id'), input, user.id)
  return ok(c, professional)
})

professionalRoutes.get('/:id/nw', auth, async (c) => {
  const affiliations = await services.professional.getNwAffiliations(c.req.param('id'))
  return ok(c, affiliations)
})

professionalRoutes.delete('/:id/nw/:nwId', auth, requireRole('professional', 'admin'), validateUuidParam('nwId'), async (c) => {
  await services.professional.leaveNw(c.req.param('id'), c.req.param('nwId'))
  return ok(c, { message: 'NW脱退が完了しました' })
})

professionalRoutes.get('/:id/history', auth, requireRole('professional', 'admin'), async (c) => {
  const history = await services.professional.getHistory(c.req.param('id'))
  return ok(c, history)
})

professionalRoutes.patch('/:id/verification', auth, requireRole('admin'), validateBody(updateVerificationSchema), async (c) => {
  const input = c.get('validatedBody') as UpdateVerificationInput
  const result = await services.professional.updateVerificationStatus(c.req.param('id'), input.status)
  return ok(c, result)
})
