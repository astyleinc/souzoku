import { z } from 'zod'

const TICKET_STATUS_VALUES = ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'] as const
const TICKET_CATEGORY_VALUES = ['general', 'account', 'property', 'bidding', 'payment', 'technical', 'other'] as const

// ログインユーザーがチケットを作成
export const createTicketSchema = z.object({
  category: z.enum(TICKET_CATEGORY_VALUES),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
})

// チケットに返信
export const replyTicketSchema = z.object({
  body: z.string().min(1).max(5000),
})

// 未ログインユーザーからのお問い合わせ
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  category: z.enum(TICKET_CATEGORY_VALUES),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
})

// チケットステータス更新
export const updateTicketStatusSchema = z.object({
  status: z.enum(TICKET_STATUS_VALUES),
})

// チケット担当者割当
export const assignTicketSchema = z.object({
  assigneeId: z.string().uuid(),
})

// 内部メモ追加
export const addInternalNoteSchema = z.object({
  body: z.string().min(1).max(5000),
})

// チケット一覧クエリ
export const ticketQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(TICKET_STATUS_VALUES).optional(),
  category: z.enum(TICKET_CATEGORY_VALUES).optional(),
})

export type CreateTicketInput = z.infer<typeof createTicketSchema>
export type ReplyTicketInput = z.infer<typeof replyTicketSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>
export type AssignTicketInput = z.infer<typeof assignTicketSchema>
export type AddInternalNoteInput = z.infer<typeof addInternalNoteSchema>
export type TicketQuery = z.infer<typeof ticketQuerySchema>
