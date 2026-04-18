import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody, validateQuery } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { createPropertySchema, updatePropertySchema, propertyQuerySchema } from '../schemas/property'
import { updateStatusSchema } from '../schemas/admin'
import type { CreatePropertyInput, UpdatePropertyInput, PropertyQuery } from '../schemas/property'
import type { UpdateStatusInput } from '../schemas/admin'
import { services } from '../lib/services'
import { ok, created, paginated } from '../lib/response'
import { forbidden, validationError } from '../lib/errors'

export const propertyRoutes = new Hono()

propertyRoutes.use('/:id', validateUuidParam('id'))
propertyRoutes.use('/:id/*', validateUuidParam('id'))

propertyRoutes.get('/', validateQuery(propertyQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as PropertyQuery
  const result = await services.property.list(query)
  return paginated(c, result)
})

propertyRoutes.get('/:id', async (c) => {
  const property = await services.property.getById(c.req.param('id'))
  return ok(c, property)
})

propertyRoutes.post('/', auth, requireRole('seller', 'professional', 'admin'), validateBody(createPropertySchema), async (c) => {
  const input = c.get('validatedBody') as CreatePropertyInput
  const user = c.get('user')
  const property = await services.property.create(input, user.id)
  return created(c, property)
})

propertyRoutes.put('/:id', auth, requireRole('seller', 'admin'), validateBody(updatePropertySchema), async (c) => {
  const input = c.get('validatedBody') as UpdatePropertyInput
  const user = c.get('user')

  if (user.role !== 'admin') {
    const existing = await services.property.getById(c.req.param('id'))
    if (existing.sellerId !== user.id) {
      throw forbidden('他のユーザーの物件は更新できません')
    }
  }

  const property = await services.property.update(c.req.param('id'), input)
  return ok(c, property)
})

propertyRoutes.patch('/:id/status', auth, requireRole('admin'), validateBody(updateStatusSchema), async (c) => {
  const input = c.get('validatedBody') as UpdateStatusInput
  const property = await services.property.updateStatus(
    c.req.param('id'),
    input.status as typeof import('../db/schema/properties').propertyStatusEnum.enumValues[number],
    input.returnReason,
  )
  return ok(c, property)
})

// 売主向け：不成立物件の通常掲載切替 / 再出品
// status-machine 上 failed → { normal_listing, bidding } のみ許可される
propertyRoutes.patch('/:id/relist', auth, requireRole('seller'), async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const mode = body?.mode as 'normal_listing' | 'bidding'
  if (mode !== 'normal_listing' && mode !== 'bidding') {
    throw validationError('modeはnormal_listingまたはbiddingを指定してください')
  }

  const user = c.get('user')
  const existing = await services.property.getById(c.req.param('id'))
  if (existing.sellerId !== user.id) {
    throw forbidden('他のユーザーの物件は変更できません')
  }

  const property = await services.property.updateStatus(c.req.param('id'), mode)
  return ok(c, property)
})

propertyRoutes.get('/:id/documents', auth, async (c) => {
  const documents = await services.property.getDocuments(c.req.param('id'))
  return ok(c, documents)
})
