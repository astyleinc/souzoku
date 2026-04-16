import { z } from 'zod'

// 書類種別の列挙値
const DOCUMENT_TYPES = [
  'registry_certificate',
  'inheritance_agreement',
  'registration_proof',
  'tax_notice',
  'identity_document',
  'property_photo',
  'important_matter_explanation',
  'sales_contract',
  'settlement_proof',
] as const

// 書類アップロード用スキーマ
export const uploadDocumentSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPES),
  fileName: z.string().min(1).max(255),
})

// 閲覧許可付与用スキーマ
export const grantPermissionSchema = z.object({
  professionalId: z.string().uuid(),
})

// 書類一覧クエリスキーマ
export const documentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>
export type GrantPermissionInput = z.infer<typeof grantPermissionSchema>
export type DocumentQuery = z.infer<typeof documentQuerySchema>
