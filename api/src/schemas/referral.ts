import { z } from 'zod'

export const createReferralLinkSchema = z.object({
  label: z.string().max(100).optional(),
})

export const referralQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreateReferralLinkInput = z.infer<typeof createReferralLinkSchema>
export type ReferralQuery = z.infer<typeof referralQuerySchema>
