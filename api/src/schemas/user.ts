import { z } from 'zod'

// プロフィール更新
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
  role: z.enum(['seller', 'buyer', 'professional']).optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// パスワード変更
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// アカウント削除リクエスト
export const deletionRequestSchema = z.object({
  reason: z.string().max(1000),
  password: z.string().min(1),
})

export type DeletionRequestInput = z.infer<typeof deletionRequestSchema>

// お気に入りパラメータ
export const favoriteParamSchema = z.object({
  propertyId: z.string().uuid(),
})

export type FavoriteParam = z.infer<typeof favoriteParamSchema>

// 買い手プロフィール更新
export const updateBuyerProfileSchema = z.object({
  buyerType: z.enum(['individual', 'real_estate_company', 'investor', 'other_company']),
  companyName: z.string().max(200).optional(),
  preferredAreas: z.string().max(500).optional(),
  preferredPriceMin: z.string().max(20).optional(),
  preferredPriceMax: z.string().max(20).optional(),
  preferredPropertyTypes: z.string().max(500).optional(),
})

export type UpdateBuyerProfileInput = z.infer<typeof updateBuyerProfileSchema>
