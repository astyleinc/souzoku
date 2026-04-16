import { z } from 'zod'

export const registerBrokerSchema = z.object({
  companyName: z.string().min(1).max(200),
  representativeName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1).max(20),
  address: z.string().min(1),
  licenseNumber: z.string().min(1).max(50),
  contactPersonName: z.string().min(1).max(100),
  bankName: z.string().min(1).max(100),
  bankBranch: z.string().min(1).max(100),
  bankAccountType: z.string().min(1).max(20),
  bankAccountNumber: z.string().min(1).max(20),
  invoiceNumber: z.string().max(50).optional(),
})

export const evaluateBrokerSchema = z.object({
  propertyId: z.string().uuid(),
  speedRating: z.number().int().min(1).max(5),
  clarityRating: z.number().int().min(1).max(5),
  politenessRating: z.number().int().min(1).max(5),
  overallRating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

export type RegisterBrokerInput = z.infer<typeof registerBrokerSchema>
export type EvaluateBrokerInput = z.infer<typeof evaluateBrokerSchema>
