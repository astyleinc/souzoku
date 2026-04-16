import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import type { AuthUser } from '../middleware/auth'
import { validateBody, validateQuery } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import {
  createTicketSchema,
  replyTicketSchema,
  contactSchema,
  updateTicketStatusSchema,
  assignTicketSchema,
  addInternalNoteSchema,
  ticketQuerySchema,
} from '../schemas/support'
import type {
  CreateTicketInput,
  ReplyTicketInput,
  ContactInput,
  UpdateTicketStatusInput,
  AssignTicketInput,
  AddInternalNoteInput,
  TicketQuery,
} from '../schemas/support'
import { services } from '../lib/services'
import { ok, created, paginated } from '../lib/response'
import { forbidden } from '../lib/errors'

// ユーザー向けサポートルート
export const supportRoutes = new Hono()

supportRoutes.use('/tickets/:id', validateUuidParam('id'))
supportRoutes.use('/tickets/:id/*', validateUuidParam('id'))

// ユーザー自身のチケット一覧
supportRoutes.get('/tickets', auth, validateQuery(ticketQuerySchema), async (c) => {
  const user = c.get('user')
  const query = c.get('validatedQuery') as TicketQuery
  const result = await services.support.listUserTickets(user.id, query)
  return paginated(c, result)
})

// チケット作成
supportRoutes.post('/tickets', auth, validateBody(createTicketSchema), async (c) => {
  const user = c.get('user')
  const input = c.get('validatedBody') as CreateTicketInput
  const ticket = await services.support.createTicket(user.id, user.email, user.email, input)
  return created(c, ticket)
})

// チケット詳細取得（自分のチケットまたは管理者のみ）
supportRoutes.get('/tickets/:id', auth, async (c) => {
  const user = c.get('user')
  const ticket = await services.support.getTicket(c.req.param('id'))

  if (ticket.userId !== user.id && user.role !== 'admin') {
    throw forbidden('他のユーザーのチケットは閲覧できません')
  }

  return ok(c, ticket)
})

// チケットに返信（自分のチケットまたは管理者のみ）
supportRoutes.post('/tickets/:id/messages', auth, validateBody(replyTicketSchema), async (c) => {
  const user = c.get('user')
  const input = c.get('validatedBody') as ReplyTicketInput
  const ticketId = c.req.param('id')

  // チケットの所有者確認
  const ticket = await services.support.getTicket(ticketId)
  if (ticket.userId !== user.id && user.role !== 'admin') {
    throw forbidden('他のユーザーのチケットには返信できません')
  }

  const message = await services.support.replyToTicket(ticketId, user.id, user.email, input.body)
  return created(c, message)
})

// 未ログインお問い合わせ（レート制限を別途適用すべき）
supportRoutes.post('/contact', validateBody(contactSchema), async (c) => {
  const input = c.get('validatedBody') as ContactInput
  const ticket = await services.support.createContactTicket(input)
  return created(c, ticket)
})

// 管理者向けお問い合わせ管理ルート
export const supportAdminRoutes = new Hono<{ Variables: { user: AuthUser } }>()

supportAdminRoutes.use('*', auth, requireRole('admin'))
supportAdminRoutes.use('/:id', validateUuidParam('id'))
supportAdminRoutes.use('/:id/*', validateUuidParam('id'))

// 全チケット一覧
supportAdminRoutes.get('/', validateQuery(ticketQuerySchema), async (c) => {
  const query = c.get('validatedQuery') as TicketQuery
  const result = await services.support.listAllTickets(query)
  return paginated(c, result)
})

// チケット詳細（内部メモ含む）
supportAdminRoutes.get('/:id', async (c) => {
  const ticket = await services.support.getTicketWithNotes(c.req.param('id'))
  return ok(c, ticket)
})

// 担当者割当
supportAdminRoutes.patch('/:id/assign', validateBody(assignTicketSchema), async (c) => {
  const input = c.get('validatedBody') as AssignTicketInput
  const ticket = await services.support.assignTicket(c.req.param('id'), input.assigneeId)
  return ok(c, ticket)
})

// ステータス更新
supportAdminRoutes.patch('/:id/status', validateBody(updateTicketStatusSchema), async (c) => {
  const input = c.get('validatedBody') as UpdateTicketStatusInput
  const ticket = await services.support.updateTicketStatus(c.req.param('id'), input.status)
  return ok(c, ticket)
})

// 内部メモ追加
supportAdminRoutes.post('/:id/notes', validateBody(addInternalNoteSchema), async (c) => {
  const user = c.get('user')
  const input = c.get('validatedBody') as AddInternalNoteInput
  const note = await services.support.addInternalNote(c.req.param('id'), user.id, input.body)
  return created(c, note)
})

// 管理者として返信
supportAdminRoutes.post('/:id/reply', validateBody(replyTicketSchema), async (c) => {
  const user = c.get('user')
  const input = c.get('validatedBody') as ReplyTicketInput
  const message = await services.support.adminReply(c.req.param('id'), user.id, user.email, input.body)
  return created(c, message)
})
