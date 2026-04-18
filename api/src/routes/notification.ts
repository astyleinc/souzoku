import { Hono } from 'hono'
import { auth } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { updateNotificationSettingsSchema } from '../schemas/admin'
import type { UpdateNotificationSettingsInput } from '../schemas/admin'
import { services } from '../lib/services'
import { ok } from '../lib/response'
import { getValidatedBody, getCurrentUser } from '../lib/context-helpers'

export const notificationRoutes = new Hono()

notificationRoutes.get('/', auth, async (c) => {
  const user = getCurrentUser(c)
  const unreadOnly = c.req.query('unreadOnly') === 'true'
  const notifications = await services.notification.listByUser(user.id, unreadOnly)
  return ok(c, notifications)
})

notificationRoutes.patch('/:id/read', auth, validateUuidParam('id'), async (c) => {
  const user = getCurrentUser(c)
  const notification = await services.notification.markAsRead(c.req.param('id'), user.id)
  return ok(c, notification)
})

notificationRoutes.post('/read-all', auth, async (c) => {
  const user = getCurrentUser(c)
  await services.notification.markAllAsRead(user.id)
  return ok(c, { message: '全ての通知を既読にしました' })
})

notificationRoutes.get('/settings', auth, async (c) => {
  const user = getCurrentUser(c)
  const settings = await services.notification.getSettings(user.id)
  return ok(c, settings)
})

notificationRoutes.put('/settings', auth, validateBody(updateNotificationSettingsSchema), async (c) => {
  const user = getCurrentUser(c)
  const input = getValidatedBody<UpdateNotificationSettingsInput>(c)
  const settings = await services.notification.updateSettings(user.id, input)
  return ok(c, settings)
})
