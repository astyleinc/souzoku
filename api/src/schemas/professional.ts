import { z } from 'zod'

export const registerProfessionalSchema = z.object({
  qualificationType: z.enum([
    'tax_accountant',
    'judicial_scrivener',
    'lawyer',
    'administrative_scrivener',
    'other',
  ]),
  registrationNumber: z.string().min(1).max(50),
  employmentType: z.enum(['employee', 'sole_proprietor', 'representative']),
  officeName: z.string().min(1).max(200),
  officeAddress: z.string().min(1),
  officePhone: z.string().max(20).optional(),
  paymentRecipient: z.enum(['self', 'office']),
  paymentRecipientName: z.string().min(1).max(200),
  bankName: z.string().min(1).max(100),
  bankBranch: z.string().min(1).max(100),
  bankAccountType: z.string().min(1).max(20),
  bankAccountNumber: z.string().min(1).max(20),
  invoiceNumber: z.string().max(50).optional(),
  nwCompanyIds: z.array(z.string().uuid()).optional(),
})

export const updateProfessionalSchema = registerProfessionalSchema.partial()

export type RegisterProfessionalInput = z.infer<typeof registerProfessionalSchema>
export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>
