import { z } from 'zod'

export const createReferralLinkSchema = z.object({
  label: z.string().max(100).optional(),
})

export const referralQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// 登録直後に紹介コードを売主プロフィールへ紐づける
export const linkReferralSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  nwCompanyId: z.string().uuid().optional(),
}).refine((data) => data.code || data.nwCompanyId, {
  message: '紹介コードまたは NW ID のいずれかが必要です',
})

// 士業による売主の代理登録（/referrals/me/clients）
// フロントが送るペイロード構造に合わせる
export const proxyClientCreateSchema = z.object({
  nwRoute: z.string().default('direct'),
  nwCompanyId: z.string().uuid().optional(),
  seller: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().max(20).optional(),
    address: z.string().max(500).optional(),
  }),
  property: z.object({
    title: z.string().min(1).max(200),
    address: z.string().min(1).max(500),
    type: z.enum(['mansion', 'house', 'land', 'building']),
    area: z.number().min(0).optional(),
    askingPrice: z.number().int().min(1),
    buyNowPrice: z.number().int().optional(),
    bidDuration: z.number().int().min(1).max(90),
    note: z.string().max(2000).optional(),
  }),
})

export type CreateReferralLinkInput = z.infer<typeof createReferralLinkSchema>
export type ReferralQuery = z.infer<typeof referralQuerySchema>
export type LinkReferralInput = z.infer<typeof linkReferralSchema>
export type ProxyClientCreateInput = z.infer<typeof proxyClientCreateSchema>
