import { eq, and, desc } from 'drizzle-orm'
import type { Database } from '../db/client'
import { bids } from '../db/schema/bids'
import { properties } from '../db/schema/properties'
import type { CreateBidInput, SelectBidInput } from '../schemas/bid'
import { AppError, ERROR_CODE, notFound } from '../lib/errors'

export const createBidService = (db: Database) => ({
  // 物件の入札一覧取得
  async listByProperty(propertyId: string) {
    return db.select()
      .from(bids)
      .where(and(eq(bids.propertyId, propertyId), eq(bids.status, 'active')))
      .orderBy(desc(bids.amount))
  },

  // 買い手自身の入札一覧取得
  async listByBuyer(buyerId: string) {
    const rows = await db.select({
      id: bids.id,
      propertyId: bids.propertyId,
      propertyTitle: properties.title,
      amount: bids.amount,
      status: bids.status,
      createdAt: bids.createdAt,
      updatedAt: bids.updatedAt,
    })
      .from(bids)
      .innerJoin(properties, eq(bids.propertyId, properties.id))
      .where(eq(bids.buyerId, buyerId))
      .orderBy(desc(bids.createdAt))

    return { items: rows }
  },

  // 入札する
  async placeBid(input: CreateBidInput, buyerId: string) {
    // 物件の存在確認と入札可能チェック
    const property = await db.select()
      .from(properties)
      .where(eq(properties.id, input.propertyId))
      .limit(1)

    if (property.length === 0) {
      throw notFound('物件')
    }

    const prop = property[0]

    if (prop.status !== 'bidding') {
      throw new AppError(ERROR_CODE.BID_PERIOD_CLOSED, 'この物件は入札受付期間外です')
    }

    if (prop.bidEndAt && new Date() > prop.bidEndAt) {
      throw new AppError(ERROR_CODE.BID_PERIOD_CLOSED, '入札期間が終了しています')
    }

    if (input.amount < prop.askingPrice) {
      throw new AppError(
        ERROR_CODE.BID_TOO_LOW,
        `入札額は希望価格（${prop.askingPrice.toLocaleString()}円）以上にしてください`,
      )
    }

    // 既存入札を superseded に
    await db.update(bids)
      .set({ status: 'superseded', updatedAt: new Date() })
      .where(and(eq(bids.propertyId, input.propertyId), eq(bids.buyerId, buyerId), eq(bids.status, 'active')))

    // 新規入札を作成
    const result = await db.insert(bids).values({
      propertyId: input.propertyId,
      buyerId,
      amount: input.amount,
      note: input.note,
    }).returning()

    return result[0]
  },

  // 買い手が自分の入札をキャンセル
  async cancelBid(bidId: string, buyerId: string) {
    const bid = await db.select()
      .from(bids)
      .where(and(eq(bids.id, bidId), eq(bids.buyerId, buyerId)))
      .limit(1)

    if (bid.length === 0) {
      throw notFound('入札')
    }

    if (bid[0].status !== 'active') {
      throw new AppError(ERROR_CODE.VALIDATION_ERROR, 'アクティブな入札のみキャンセルできます')
    }

    const result = await db.update(bids)
      .set({ status: 'superseded', updatedAt: new Date() })
      .where(eq(bids.id, bidId))
      .returning()

    return result[0]
  },

  // 売主が入札者を選択
  async selectBid(input: SelectBidInput, propertyId: string) {
    // 対象入札の取得
    const bid = await db.select()
      .from(bids)
      .where(and(eq(bids.id, input.bidId), eq(bids.propertyId, propertyId)))
      .limit(1)

    if (bid.length === 0) {
      throw notFound('入札')
    }

    // 最高額チェック（最高額以外を選んだ場合は理由必須）
    const allBids = await this.listByProperty(propertyId)
    const highestBid = allBids[0]

    if (highestBid && highestBid.id !== input.bidId && !input.selectionReason) {
      throw new AppError(
        ERROR_CODE.VALIDATION_ERROR,
        '最高額以外の入札を選択する場合は理由を選択してください',
      )
    }

    // 選択した入札を selected に
    await db.update(bids)
      .set({
        status: 'selected',
        selectionReason: input.selectionReason,
        selectionReasonDetail: input.selectionReasonDetail,
        updatedAt: new Date(),
      })
      .where(eq(bids.id, input.bidId))

    // 他の入札を rejected に
    await db.update(bids)
      .set({ status: 'rejected', updatedAt: new Date() })
      .where(and(
        eq(bids.propertyId, propertyId),
        eq(bids.status, 'active'),
      ))

    // 物件ステータスを承認待ちに
    await db.update(properties)
      .set({ status: 'pending_approval', updatedAt: new Date() })
      .where(eq(properties.id, propertyId))

    return bid[0]
  },
})
