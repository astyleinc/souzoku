import { z } from 'zod'
import { MIN_LISTING_PRICE, ALLOWED_PREFECTURES } from '@shared/constants'

const propertyBaseSchema = z.object({
  propertyType: z.enum(['house', 'land', 'apartment', 'other']),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  prefecture: z.enum(ALLOWED_PREFECTURES, {
    errorMap: () => ({ message: `対応エリアは${ALLOWED_PREFECTURES.join('・')}のみです` }),
  }),
  city: z.string().min(1).max(50),
  address: z.string().min(1),
  nearestStation: z.string().max(100).optional(),
  walkMinutes: z.number().int().min(0).optional(),
  landArea: z.number().int().min(0).optional(),
  buildingArea: z.number().int().min(0).optional(),
  builtYear: z.number().int().min(1900).max(2030).optional(),
  floors: z.number().int().min(1).optional(),
  askingPrice: z.number().int().min(MIN_LISTING_PRICE, {
    message: `最低出品価格は${(MIN_LISTING_PRICE / 10000).toLocaleString()}万円です`,
  }),
  instantPrice: z.number().int().optional(),
  inheritanceStartDate: z.string().date().optional(),
  urgency: z.enum(['urgent', 'three_months', 'one_year', 'undecided']),
  isRegistrationComplete: z.boolean().default(false),
  bidStartAt: z.string().datetime().optional(),
  bidEndAt: z.string().datetime().optional(),
  referralNwCompanyId: z.string().uuid().optional(),
  referralChannel: z.enum(['nw', 'direct']).optional(),
})

export const createPropertySchema = propertyBaseSchema.refine(
  (data) => {
    if (data.instantPrice !== undefined) {
      return data.instantPrice > data.askingPrice
    }
    return true
  },
  { message: '即決価格は希望価格より高く設定してください', path: ['instantPrice'] },
)

// 更新時は紹介情報の変更を許可しない
export const updatePropertySchema = propertyBaseSchema
  .omit({ referralNwCompanyId: true, referralChannel: true })
  .partial()

export const propertyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  prefecture: z.string().optional(),
  propertyType: z.enum(['house', 'land', 'apartment', 'other']).optional(),
  urgency: z.enum(['urgent', 'three_months', 'one_year', 'undecided']).optional(),
  minPrice: z.coerce.number().int().optional(),
  maxPrice: z.coerce.number().int().optional(),
  status: z.string().optional(),
  biddingOnly: z.coerce.boolean().optional(),
  includeAll: z.coerce.boolean().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'area_desc']).default('newest'),
  keyword: z.string().optional(),
})

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>
export type PropertyQuery = z.infer<typeof propertyQuerySchema>
