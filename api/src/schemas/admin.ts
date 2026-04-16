import { z } from 'zod'

export const updateStatusSchema = z.object({
  status: z.string().min(1).max(30),
  returnReason: z.string().max(1000).optional(),
})

export const assignBrokerSchema = z.object({
  assignedBrokerId: z.string().uuid(),
})

export const updateVerificationSchema = z.object({
  status: z.enum([
    'pending',
    'auto_verified',
    'manually_verified',
    'rejected',
    'suspended',
  ]),
})

export const updatePaymentStatusSchema = z.object({
  status: z.enum(['invoiced', 'confirmed']),
})

export const updateNotificationSettingsSchema = z.object({
  emailEnabled: z.boolean().optional(),
  systemEnabled: z.boolean().optional(),
  slackWebhookUrl: z.string().url().nullable().optional(),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
export type AssignBrokerInput = z.infer<typeof assignBrokerSchema>
export type UpdateVerificationInput = z.infer<typeof updateVerificationSchema>
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>
export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>
