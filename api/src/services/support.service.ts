import { eq, desc, asc, and, sql } from 'drizzle-orm'
import type { Database } from '../db/client'
import { supportTickets, supportMessages, internalNotes } from '../db/schema/support'
import { notFound } from '../lib/errors'
import type { PaginatedResponse } from '@shared/types'
import type {
  CreateTicketInput,
  ContactInput,
  TicketQuery,
  UpdateTicketStatusInput,
  AssignTicketInput,
} from '../schemas/support'
import { createNotificationService } from './notification.service'
import { NOTIFICATION_EVENT } from '@shared/constants'

export const createSupportService = (db: Database) => ({
  // ユーザー自身のチケット一覧取得
  async listUserTickets(
    userId: string,
    query: TicketQuery,
  ): Promise<PaginatedResponse<typeof supportTickets.$inferSelect>> {
    const conditions = [eq(supportTickets.userId, userId)]

    if (query.status) {
      conditions.push(eq(supportTickets.status, query.status))
    }
    if (query.category) {
      conditions.push(eq(supportTickets.category, query.category))
    }

    const where = and(...conditions)
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db.select()
        .from(supportTickets)
        .where(where)
        .orderBy(desc(supportTickets.updatedAt))
        .limit(query.limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(supportTickets)
        .where(where),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    }
  },

  // ログインユーザーがチケットを作成
  async createTicket(userId: string, email: string, name: string, input: CreateTicketInput) {
    const ticket = await db.insert(supportTickets).values({
      userId,
      email,
      name,
      category: input.category,
      subject: input.subject,
    }).returning()

    // 最初のメッセージを挿入
    await db.insert(supportMessages).values({
      ticketId: ticket[0].id,
      senderId: userId,
      senderName: name,
      body: input.body,
      isStaffReply: false,
    })

    // 問い合わせ受領通知（起票者本人へ控えを送る）
    await createNotificationService(db).createSilently(
      {
        userId,
        event: NOTIFICATION_EVENT.INQUIRY_RECEIVED,
        channel: 'email',
        title: 'お問い合わせを受け付けました',
        body: `「${input.subject}」のお問い合わせを受け付けました。担当者より折り返しご連絡いたします。`,
        relatedEntityType: 'ticket',
        relatedEntityId: ticket[0].id,
        alsoEmail: true,
      },
      { ticketId: ticket[0].id },
    )

    return ticket[0]
  },

  // チケット詳細取得（内部メモは含まない）
  async getTicket(ticketId: string) {
    const ticket = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1)

    if (ticket.length === 0) {
      throw notFound('チケット')
    }

    const messages = await db.select()
      .from(supportMessages)
      .where(eq(supportMessages.ticketId, ticketId))
      .orderBy(asc(supportMessages.createdAt))

    return {
      ...ticket[0],
      messages,
    }
  },

  // チケットに返信
  async replyToTicket(ticketId: string, userId: string, name: string, body: string) {
    // チケットの存在確認
    const ticket = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1)

    if (ticket.length === 0) {
      throw notFound('チケット')
    }

    const message = await db.insert(supportMessages).values({
      ticketId,
      senderId: userId,
      senderName: name,
      body,
      isStaffReply: false,
    }).returning()

    // チケットの更新日時を更新
    await db.update(supportTickets)
      .set({ updatedAt: new Date() })
      .where(eq(supportTickets.id, ticketId))

    return message[0]
  },

  // 未ログインユーザーからのお問い合わせ
  async createContactTicket(input: ContactInput) {
    const ticket = await db.insert(supportTickets).values({
      userId: null,
      email: input.email,
      name: input.name,
      category: input.category,
      subject: input.subject,
    }).returning()

    await db.insert(supportMessages).values({
      ticketId: ticket[0].id,
      senderId: null,
      senderName: input.name,
      body: input.body,
      isStaffReply: false,
    })

    return ticket[0]
  },

  // 管理者向け: 全チケット一覧取得
  async listAllTickets(
    query: TicketQuery,
  ): Promise<PaginatedResponse<typeof supportTickets.$inferSelect>> {
    const conditions = []

    if (query.status) {
      conditions.push(eq(supportTickets.status, query.status))
    }
    if (query.category) {
      conditions.push(eq(supportTickets.category, query.category))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined
    const offset = (query.page - 1) * query.limit

    const [items, countResult] = await Promise.all([
      db.select()
        .from(supportTickets)
        .where(where)
        .orderBy(desc(supportTickets.updatedAt))
        .limit(query.limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(supportTickets)
        .where(where),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    }
  },

  // 管理者向け: チケット詳細（内部メモ含む）
  async getTicketWithNotes(ticketId: string) {
    const ticket = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1)

    if (ticket.length === 0) {
      throw notFound('チケット')
    }

    const [messages, notes] = await Promise.all([
      db.select()
        .from(supportMessages)
        .where(eq(supportMessages.ticketId, ticketId))
        .orderBy(asc(supportMessages.createdAt)),
      db.select()
        .from(internalNotes)
        .where(eq(internalNotes.ticketId, ticketId))
        .orderBy(asc(internalNotes.createdAt)),
    ])

    return {
      ...ticket[0],
      messages,
      internalNotes: notes,
    }
  },

  // 管理者向け: 担当者割当
  async assignTicket(ticketId: string, assigneeId: string) {
    const ticket = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1)

    if (ticket.length === 0) {
      throw notFound('チケット')
    }

    const result = await db.update(supportTickets)
      .set({ assigneeId, updatedAt: new Date() })
      .where(eq(supportTickets.id, ticketId))
      .returning()

    return result[0]
  },

  // 管理者向け: ステータス更新
  async updateTicketStatus(ticketId: string, status: UpdateTicketStatusInput['status']) {
    const ticket = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1)

    if (ticket.length === 0) {
      throw notFound('チケット')
    }

    const result = await db.update(supportTickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(supportTickets.id, ticketId))
      .returning()

    return result[0]
  },

  // 管理者向け: 内部メモ追加
  async addInternalNote(ticketId: string, authorId: string, body: string) {
    const ticket = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1)

    if (ticket.length === 0) {
      throw notFound('チケット')
    }

    const note = await db.insert(internalNotes).values({
      ticketId,
      authorId,
      body,
    }).returning()

    return note[0]
  },

  // 管理者向け: 管理者として返信
  async adminReply(ticketId: string, adminId: string, adminName: string, body: string) {
    const ticket = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1)

    if (ticket.length === 0) {
      throw notFound('チケット')
    }

    const message = await db.insert(supportMessages).values({
      ticketId,
      senderId: adminId,
      senderName: adminName,
      body,
      isStaffReply: true,
    }).returning()

    // チケットの更新日時を更新
    await db.update(supportTickets)
      .set({ updatedAt: new Date() })
      .where(eq(supportTickets.id, ticketId))

    // 起票ユーザーへ返信通知（未ログイン問い合わせ＝userId未設定は対象外）
    if (ticket[0].userId) {
      await createNotificationService(db).createSilently(
        {
          userId: ticket[0].userId,
          event: NOTIFICATION_EVENT.INQUIRY_REPLIED,
          channel: 'email',
          title: 'お問い合わせに返信がありました',
          body: `「${ticket[0].subject}」に運営から返信がありました。ご確認ください。`,
          relatedEntityType: 'ticket',
          relatedEntityId: ticketId,
          alsoEmail: true,
        },
        { ticketId },
      )
    }

    return message[0]
  },
})
