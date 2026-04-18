import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody, validateQuery } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import {
  uploadDocumentSchema,
  grantPermissionSchema,
  documentQuerySchema,
} from '../schemas/document'
import type {
  UploadDocumentInput,
  GrantPermissionInput,
  DocumentQuery,
} from '../schemas/document'
import { services } from '../lib/services'
import { ok, created, paginated } from '../lib/response'
import { forbidden } from '../lib/errors'
import { getValidatedBody, getValidatedQuery, getCurrentUser } from '../lib/context-helpers'

export const documentRoutes = new Hono()

// 売主自身の物件一覧
documentRoutes.get(
  '/properties/seller/me',
  auth,
  requireRole('seller'),
  validateQuery(documentQuerySchema),
  async (c) => {
    const query = getValidatedQuery<DocumentQuery>(c)
    const user = getCurrentUser(c)
    const result = await services.document.listSellerProperties(user.id, query.page, query.limit)
    return paginated(c, result)
  },
)

// 買い手が入札した物件一覧
documentRoutes.get(
  '/properties/buyer/bids',
  auth,
  requireRole('buyer'),
  validateQuery(documentQuerySchema),
  async (c) => {
    const query = getValidatedQuery<DocumentQuery>(c)
    const user = getCurrentUser(c)
    const result = await services.document.listBuyerBidProperties(user.id, query.page, query.limit)
    return paginated(c, result)
  },
)

// パスパラメータのバリデーション
documentRoutes.use('/properties/:propertyId/*', validateUuidParam('propertyId'))
documentRoutes.use('/properties/:propertyId', validateUuidParam('propertyId'))

// 物件の書類一覧取得
documentRoutes.get(
  '/properties/:propertyId/documents',
  auth,
  validateQuery(documentQuerySchema),
  async (c) => {
    const query = getValidatedQuery<DocumentQuery>(c)
    const propertyId = c.req.param('propertyId')
    const result = await services.document.listByProperty(propertyId, query.page, query.limit)
    return paginated(c, result)
  },
)

// 物件の全書類に対する閲覧許可一覧
documentRoutes.get(
  '/properties/:propertyId/documents/permissions',
  auth,
  requireRole('seller', 'admin'),
  async (c) => {
    const propertyId = c.req.param('propertyId')
    const user = getCurrentUser(c)

    // 売主の場合は所有者チェック
    if (user.role !== 'admin') {
      const property = await services.property.getById(propertyId)
      if (property.sellerId !== user.id) {
        throw forbidden('他のユーザーの物件の閲覧許可は確認できません')
      }
    }

    const permissions = await services.document.listPermissions(propertyId)
    return ok(c, permissions)
  },
)

// 書類のUUIDパラメータバリデーション
documentRoutes.use('/properties/:propertyId/documents/:docId/*', validateUuidParam('docId'))
documentRoutes.use('/properties/:propertyId/documents/:docId', validateUuidParam('docId'))

// 書類アップロード（レコード登録）
documentRoutes.post(
  '/properties/:propertyId/documents',
  auth,
  requireRole('seller', 'broker', 'admin'),
  validateBody(uploadDocumentSchema),
  async (c) => {
    const input = getValidatedBody<UploadDocumentInput>(c)
    const propertyId = c.req.param('propertyId')
    const user = getCurrentUser(c)

    // 売主の場合は所有者チェック
    if (user.role === 'seller') {
      const property = await services.property.getById(propertyId)
      if (property.sellerId !== user.id) {
        throw forbidden('他のユーザーの物件には書類をアップロードできません')
      }
    }

    const document = await services.document.upload(propertyId, input, user.id)
    return created(c, document)
  },
)

// 書類削除
documentRoutes.delete(
  '/properties/:propertyId/documents/:docId',
  auth,
  async (c) => {
    const docId = c.req.param('docId')
    const user = getCurrentUser(c)
    const document = await services.document.delete(docId, user.id)
    return ok(c, document)
  },
)

// 書類ダウンロードURL取得
documentRoutes.get(
  '/properties/:propertyId/documents/:docId/download',
  auth,
  async (c) => {
    const docId = c.req.param('docId')
    const user = getCurrentUser(c)

    // 管理者は無条件でアクセス可能
    if (user.role === 'admin') {
      const result = await services.document.getDownloadUrlForAdmin(docId)
      return ok(c, result)
    }

    const result = await services.document.getDownloadUrl(docId, user.id)
    return ok(c, result)
  },
)

// 書類の閲覧許可を付与
documentRoutes.post(
  '/properties/:propertyId/documents/:docId/permissions',
  auth,
  requireRole('seller'),
  validateBody(grantPermissionSchema),
  async (c) => {
    const input = getValidatedBody<GrantPermissionInput>(c)
    const propertyId = c.req.param('propertyId')
    const docId = c.req.param('docId')
    const user = getCurrentUser(c)

    // 所有者チェック
    const property = await services.property.getById(propertyId)
    if (property.sellerId !== user.id) {
      throw forbidden('他のユーザーの物件の閲覧許可は変更できません')
    }

    const permission = await services.document.grantPermission(docId, input.professionalId, user.id)
    return created(c, permission)
  },
)

// 書類の閲覧許可を取り消し
documentRoutes.delete(
  '/properties/:propertyId/documents/:docId/permissions/:professionalId',
  auth,
  requireRole('seller'),
  validateUuidParam('professionalId'),
  async (c) => {
    const propertyId = c.req.param('propertyId')
    const docId = c.req.param('docId')
    const professionalId = c.req.param('professionalId')
    const user = getCurrentUser(c)

    // 所有者チェック
    const property = await services.property.getById(propertyId)
    if (property.sellerId !== user.id) {
      throw forbidden('他のユーザーの物件の閲覧許可は変更できません')
    }

    const result = await services.document.revokePermission(docId, professionalId)
    return ok(c, result)
  },
)
