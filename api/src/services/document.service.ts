import { eq, and, desc, sql } from 'drizzle-orm'
import type { Database } from '../db/client'
import { properties, propertyDocuments, documentPermissions } from '../db/schema'
import { bids } from '../db/schema'
import type { UploadDocumentInput, DocumentQuery } from '../schemas/document'
import { notFound, forbidden, conflict } from '../lib/errors'
import { storage } from '../lib/storage'
import type { PaginatedResponse } from '@shared/types'

export const createDocumentService = (db: Database) => ({
  // 物件の書類一覧取得（ページネーション付き）
  async listByProperty(
    propertyId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<typeof propertyDocuments.$inferSelect>> {
    const offset = (page - 1) * limit

    const [items, countResult] = await Promise.all([
      db.select()
        .from(propertyDocuments)
        .where(eq(propertyDocuments.propertyId, propertyId))
        .orderBy(desc(propertyDocuments.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(propertyDocuments)
        .where(eq(propertyDocuments.propertyId, propertyId)),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // 書類レコードの登録
  async upload(propertyId: string, input: UploadDocumentInput, uploadedBy: string) {
    const fileUrl = `properties/${propertyId}/${input.documentType}/${input.fileName}`

    const result = await db.insert(propertyDocuments).values({
      propertyId,
      documentType: input.documentType,
      fileName: input.fileName,
      fileUrl,
      uploadedBy,
    }).returning()

    const record = result[0]

    const signedUploadUrl = await storage.createSignedUploadUrl(fileUrl)

    return {
      ...record,
      signedUploadUrl,
    }
  },

  // 書類の削除（アップロード者のみ）
  async delete(documentId: string, userId: string) {
    const doc = await db.select()
      .from(propertyDocuments)
      .where(eq(propertyDocuments.id, documentId))
      .limit(1)

    if (doc.length === 0) {
      throw notFound('書類')
    }

    if (doc[0].uploadedBy !== userId) {
      throw forbidden('この書類を削除する権限がありません')
    }

    // ストレージからファイル削除
    await storage.deleteFile(doc[0].fileUrl).catch(() => {
      // ファイルが既に削除済みの場合は無視
    })

    // 関連する閲覧許可も削除
    await db.delete(documentPermissions)
      .where(eq(documentPermissions.documentId, documentId))

    await db.delete(propertyDocuments)
      .where(eq(propertyDocuments.id, documentId))

    return doc[0]
  },

  // ダウンロード用の署名付きURL取得（権限チェック付き）
  async getDownloadUrl(documentId: string, userId: string) {
    const doc = await db.select()
      .from(propertyDocuments)
      .where(eq(propertyDocuments.id, documentId))
      .limit(1)

    if (doc.length === 0) {
      throw notFound('書類')
    }

    // 物件情報を取得して所有者チェック
    const property = await db.select()
      .from(properties)
      .where(eq(properties.id, doc[0].propertyId))
      .limit(1)

    if (property.length === 0) {
      throw notFound('物件')
    }

    // 売主（物件所有者）はアクセス可能
    if (property[0].sellerId === userId) {
      const downloadUrl = await storage.createSignedDownloadUrl(doc[0].fileUrl)
      return { documentId, downloadUrl }
    }

    // 閲覧許可がある士業はアクセス可能
    const permission = await db.select()
      .from(documentPermissions)
      .where(and(
        eq(documentPermissions.documentId, documentId),
        eq(documentPermissions.professionalId, userId),
      ))
      .limit(1)

    if (permission.length > 0) {
      const downloadUrl = await storage.createSignedDownloadUrl(doc[0].fileUrl)
      return { documentId, downloadUrl }
    }

    throw forbidden('この書類を閲覧する権限がありません')
  },

  // 管理者向けダウンロード用URL取得（権限チェック不要）
  async getDownloadUrlForAdmin(documentId: string) {
    const doc = await db.select()
      .from(propertyDocuments)
      .where(eq(propertyDocuments.id, documentId))
      .limit(1)

    if (doc.length === 0) {
      throw notFound('書類')
    }

    const downloadUrl = await storage.createSignedDownloadUrl(doc[0].fileUrl)
    return { documentId, downloadUrl }
  },

  // 書類の閲覧許可を付与
  async grantPermission(documentId: string, professionalId: string, grantedBy: string) {
    // 書類の存在確認
    const doc = await db.select()
      .from(propertyDocuments)
      .where(eq(propertyDocuments.id, documentId))
      .limit(1)

    if (doc.length === 0) {
      throw notFound('書類')
    }

    // 重複チェック
    const existing = await db.select()
      .from(documentPermissions)
      .where(and(
        eq(documentPermissions.documentId, documentId),
        eq(documentPermissions.professionalId, professionalId),
      ))
      .limit(1)

    if (existing.length > 0) {
      throw conflict('この士業には既に閲覧許可が付与されています')
    }

    const result = await db.insert(documentPermissions).values({
      documentId,
      professionalId,
      grantedBy,
    }).returning()

    return result[0]
  },

  // 書類の閲覧許可を取り消し
  async revokePermission(documentId: string, professionalId: string) {
    const existing = await db.select()
      .from(documentPermissions)
      .where(and(
        eq(documentPermissions.documentId, documentId),
        eq(documentPermissions.professionalId, professionalId),
      ))
      .limit(1)

    if (existing.length === 0) {
      throw notFound('閲覧許可')
    }

    await db.delete(documentPermissions)
      .where(and(
        eq(documentPermissions.documentId, documentId),
        eq(documentPermissions.professionalId, professionalId),
      ))

    return existing[0]
  },

  // 物件の全書類に対する閲覧許可一覧
  async listPermissions(propertyId: string) {
    return db.select({
      permission: documentPermissions,
      document: propertyDocuments,
    })
      .from(documentPermissions)
      .innerJoin(
        propertyDocuments,
        eq(documentPermissions.documentId, propertyDocuments.id),
      )
      .where(eq(propertyDocuments.propertyId, propertyId))
      .orderBy(desc(documentPermissions.grantedAt))
  },

  // 売主の物件一覧取得（ページネーション付き）
  async listSellerProperties(
    sellerId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<typeof properties.$inferSelect>> {
    const offset = (page - 1) * limit

    const [items, countResult] = await Promise.all([
      db.select()
        .from(properties)
        .where(eq(properties.sellerId, sellerId))
        .orderBy(desc(properties.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(properties)
        .where(eq(properties.sellerId, sellerId)),
    ])

    const total = Number(countResult[0].count)

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // 買い手が入札した物件一覧取得（ページネーション付き）
  async listBuyerBidProperties(
    buyerId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<typeof properties.$inferSelect>> {
    const offset = (page - 1) * limit

    // 入札済みの物件IDを重複なく取得
    const subquery = db.selectDistinct({ propertyId: bids.propertyId })
      .from(bids)
      .where(eq(bids.buyerId, buyerId))
      .as('buyer_bids')

    const [items, countResult] = await Promise.all([
      db.select({ property: properties })
        .from(properties)
        .innerJoin(subquery, eq(properties.id, subquery.propertyId))
        .orderBy(desc(properties.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(properties)
        .innerJoin(subquery, eq(properties.id, subquery.propertyId)),
    ])

    const total = Number(countResult[0].count)

    return {
      items: items.map((row) => row.property),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },
})
