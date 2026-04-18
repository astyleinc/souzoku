import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody, validateQuery, paginationSchema } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { updateProfileSchema, changePasswordSchema, deletionRequestSchema, updateBuyerProfileSchema } from '../schemas/user'
import type { UpdateProfileInput, ChangePasswordInput, DeletionRequestInput, UpdateBuyerProfileInput } from '../schemas/user'
import { services } from '../lib/services'
import { ok, created, paginated } from '../lib/response'
import { AppError, ERROR_CODE } from '../lib/errors'
import { getValidatedBody, getValidatedQuery, getCurrentUser } from '../lib/context-helpers'

export const userRoutes = new Hono()

// プロフィール取得
userRoutes.get('/me', auth, async (c) => {
  const user = getCurrentUser(c)
  const profile = await services.user.getProfile(user.id)
  return ok(c, profile)
})

// プロフィール更新
userRoutes.put('/me', auth, validateBody(updateProfileSchema), async (c) => {
  const user = getCurrentUser(c)
  const input = getValidatedBody<UpdateProfileInput>(c)
  const updated = await services.user.updateProfile(user.id, input)
  return ok(c, updated)
})

// パスワード変更（BetterAuth APIに委譲）
userRoutes.put('/me/password', auth, validateBody(changePasswordSchema), async (c) => {
  const input = getValidatedBody<ChangePasswordInput>(c)
  const { getAuth } = await import('../lib/auth')
  const authInstance = getAuth()
  try {
    await authInstance.api.changePassword({
      headers: c.req.raw.headers,
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      },
    })
    return ok(c, { message: 'パスワードを変更しました' })
  } catch {
    throw new AppError(ERROR_CODE.VALIDATION_ERROR, '現在のパスワードが正しくありません', 400)
  }
})

// セキュリティログ取得
userRoutes.get('/me/security-log', auth, async (c) => {
  const user = getCurrentUser(c)
  const logs = await services.user.getSecurityLog(user.id)
  return ok(c, logs)
})

// 全セッション無効化（BetterAuth APIに委譲）
userRoutes.post('/me/sessions/revoke-all', auth, async (c) => {
  const { getAuth } = await import('../lib/auth')
  const authInstance = getAuth()
  try {
    await authInstance.api.revokeSessions({
      headers: c.req.raw.headers,
    })
    return ok(c, { message: '全セッションを無効化しました' })
  } catch {
    throw new AppError(ERROR_CODE.INTERNAL_ERROR, 'セッション無効化に失敗しました', 500)
  }
})

// アカウント削除リクエスト
userRoutes.post('/me/delete-request', auth, validateBody(deletionRequestSchema), async (c) => {
  const user = getCurrentUser(c)
  const input = getValidatedBody<DeletionRequestInput>(c)
  const request = await services.user.requestDeletion(user.id, input.reason)
  return created(c, request)
})

// アカウント削除リクエストのキャンセル
userRoutes.delete('/me/delete-request', auth, async (c) => {
  const user = getCurrentUser(c)
  const result = await services.user.cancelDeletion(user.id)
  return ok(c, result)
})

// データエクスポート
userRoutes.post('/me/export-data', auth, async (c) => {
  const user = getCurrentUser(c)
  const data = await services.user.exportData(user.id)
  return ok(c, data)
})

// 買い手プロフィール取得
userRoutes.get('/me/buyer-profile', auth, requireRole('buyer'), async (c) => {
  const user = getCurrentUser(c)
  const profile = await services.user.getBuyerProfile(user.id)
  return ok(c, profile)
})

// 買い手プロフィール更新
userRoutes.put('/me/buyer-profile', auth, requireRole('buyer'), validateBody(updateBuyerProfileSchema), async (c) => {
  const user = getCurrentUser(c)
  const input = getValidatedBody<UpdateBuyerProfileInput>(c)
  const profile = await services.user.upsertBuyerProfile(user.id, input)
  return ok(c, profile)
})

// お気に入り一覧取得
userRoutes.get('/me/favorites', auth, requireRole('buyer'), validateQuery(paginationSchema), async (c) => {
  const user = getCurrentUser(c)
  const query = getValidatedQuery<{ page: number; limit: number }>(c)
  const result = await services.user.getFavorites(user.id, query.page, query.limit)
  return paginated(c, result)
})

// お気に入り追加
userRoutes.post('/me/favorites/:propertyId', auth, requireRole('buyer'), validateUuidParam('propertyId'), async (c) => {
  const user = getCurrentUser(c)
  const propertyId = c.req.param('propertyId')
  const favorite = await services.user.addFavorite(user.id, propertyId)
  return created(c, favorite)
})

// お気に入り削除
userRoutes.delete('/me/favorites/:propertyId', auth, requireRole('buyer'), validateUuidParam('propertyId'), async (c) => {
  const user = getCurrentUser(c)
  const propertyId = c.req.param('propertyId')
  const result = await services.user.removeFavorite(user.id, propertyId)
  return ok(c, result)
})
