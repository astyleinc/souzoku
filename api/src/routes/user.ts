import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody, validateQuery, paginationSchema } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { updateProfileSchema, changePasswordSchema, deletionRequestSchema } from '../schemas/user'
import type { UpdateProfileInput, ChangePasswordInput, DeletionRequestInput } from '../schemas/user'
import { services } from '../lib/services'
import { ok, created, paginated } from '../lib/response'
import { AppError, ERROR_CODE } from '../lib/errors'

export const userRoutes = new Hono()

// プロフィール取得
userRoutes.get('/me', auth, async (c) => {
  const user = c.get('user')
  const profile = await services.user.getProfile(user.id)
  return ok(c, profile)
})

// プロフィール更新
userRoutes.put('/me', auth, validateBody(updateProfileSchema), async (c) => {
  const user = c.get('user')
  const input = c.get('validatedBody') as UpdateProfileInput
  const updated = await services.user.updateProfile(user.id, input)
  return ok(c, updated)
})

// パスワード変更（BetterAuth APIに委譲）
userRoutes.put('/me/password', auth, validateBody(changePasswordSchema), async (c) => {
  const input = c.get('validatedBody') as ChangePasswordInput
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
  const user = c.get('user')
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
  const user = c.get('user')
  const input = c.get('validatedBody') as DeletionRequestInput
  const request = await services.user.requestDeletion(user.id, input.reason)
  return created(c, request)
})

// アカウント削除リクエストのキャンセル
userRoutes.delete('/me/delete-request', auth, async (c) => {
  const user = c.get('user')
  const result = await services.user.cancelDeletion(user.id)
  return ok(c, result)
})

// データエクスポート
userRoutes.post('/me/export-data', auth, async (c) => {
  const user = c.get('user')
  const data = await services.user.exportData(user.id)
  return ok(c, data)
})

// お気に入り一覧取得
userRoutes.get('/me/favorites', auth, requireRole('buyer'), validateQuery(paginationSchema), async (c) => {
  const user = c.get('user')
  const query = c.get('validatedQuery') as { page: number; limit: number }
  const result = await services.user.getFavorites(user.id, query.page, query.limit)
  return paginated(c, result)
})

// お気に入り追加
userRoutes.post('/me/favorites/:propertyId', auth, requireRole('buyer'), validateUuidParam('propertyId'), async (c) => {
  const user = c.get('user')
  const propertyId = c.req.param('propertyId')
  const favorite = await services.user.addFavorite(user.id, propertyId)
  return created(c, favorite)
})

// お気に入り削除
userRoutes.delete('/me/favorites/:propertyId', auth, requireRole('buyer'), validateUuidParam('propertyId'), async (c) => {
  const user = c.get('user')
  const propertyId = c.req.param('propertyId')
  const result = await services.user.removeFavorite(user.id, propertyId)
  return ok(c, result)
})
