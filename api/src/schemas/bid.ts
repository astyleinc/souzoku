import { z } from 'zod'

export const createBidSchema = z.object({
  propertyId: z.string().uuid(),
  amount: z.number().int().min(1),
  note: z.string().max(1000).optional(),
})

export const selectBidSchema = z.object({
  bidId: z.string().uuid(),
  selectionReason: z.enum(['credit_concern', 'condition_mismatch', 'other']).optional(),
  selectionReasonDetail: z.string().max(500).optional(),
})

export type CreateBidInput = z.infer<typeof createBidSchema>
export type SelectBidInput = z.infer<typeof selectBidSchema>
