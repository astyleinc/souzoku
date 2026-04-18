import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { createBidSchema, selectBidSchema } from '../schemas/bid'
import type { CreateBidInput, SelectBidInput } from '../schemas/bid'
import { services } from '../lib/services'
import { ok, created } from '../lib/response'
import { forbidden } from '../lib/errors'
import { getValidatedBody, getCurrentUser } from '../lib/context-helpers'

export const bidRoutes = new Hono()

bidRoutes.use('/property/:propertyId', validateUuidParam('propertyId'))
bidRoutes.use('/property/:propertyId/*', validateUuidParam('propertyId'))

// 売主が物件の所有者かチェック
const checkPropertyOwnership = async (propertyId: string, userId: string) => {
  const property = await services.property.getById(propertyId)
  if (property.sellerId !== userId) {
    throw forbidden('他の売主の物件にはアクセスできません')
  }
}

// 買い手自身の入札一覧
bidRoutes.get('/me', auth, requireRole('buyer'), async (c) => {
  const user = getCurrentUser(c)
  const result = await services.bid.listByBuyer(user.id)
  return ok(c, result)
})

bidRoutes.get('/property/:propertyId', auth, requireRole('seller', 'professional', 'broker', 'admin'), async (c) => {
  const user = getCurrentUser(c)
  if (user.role === 'seller') {
    await checkPropertyOwnership(c.req.param('propertyId'), user.id)
  }
  const bids = await services.bid.listByProperty(c.req.param('propertyId'))
  return ok(c, bids)
})

bidRoutes.post('/', auth, requireRole('buyer'), validateBody(createBidSchema), async (c) => {
  const input = getValidatedBody<CreateBidInput>(c)
  const user = getCurrentUser(c)
  const bid = await services.bid.placeBid(input, user.id)
  return created(c, bid)
})

// 買い手が自分の入札をキャンセル
bidRoutes.patch('/:bidId/cancel', auth, requireRole('buyer'), validateUuidParam('bidId'), async (c) => {
  const user = getCurrentUser(c)
  const bidId = c.req.param('bidId')
  const result = await services.bid.cancelBid(bidId, user.id)
  return ok(c, result)
})

bidRoutes.post('/property/:propertyId/select', auth, requireRole('seller'), validateBody(selectBidSchema), async (c) => {
  const user = getCurrentUser(c)
  await checkPropertyOwnership(c.req.param('propertyId'), user.id)

  const input = getValidatedBody<SelectBidInput>(c)
  const result = await services.bid.selectBid(input, c.req.param('propertyId'))
  return ok(c, result)
})
