import { z } from 'zod'

export const createCaseSchema = z.object({
  propertyId: z.string().uuid(),
  brokerId: z.string().uuid(),
  buyerId: z.string().uuid(),
  sellerId: z.string().uuid(),
})

export const updateCaseStatusSchema = z.object({
  status: z.enum([
    'broker_assigned',
    'seller_contacted',
    'buyer_contacted',
    'explanation_done',
    'contract_signed',
    'settlement_done',
    'cancelled',
  ]),
  cancelReason: z.string().max(500).optional(),
})

export const sendMessageSchema = z.object({
  body: z.string().min(1).max(5000),
})

export type CreateCaseInput = z.infer<typeof createCaseSchema>
export type UpdateCaseStatusInput = z.infer<typeof updateCaseStatusSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
