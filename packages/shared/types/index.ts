import type {
  PropertyStatus,
  PropertyType,
  Urgency,
  BidStatus,
  CaseStatus,
  VerificationStatus,
  PaymentStatus,
  NotificationEvent,
  NotificationChannel,
} from '../constants'

// ユーザーロール
export const USER_ROLE = {
  SELLER: 'seller',
  BUYER: 'buyer',
  PROFESSIONAL: 'professional',
  BROKER: 'broker',
  ADMIN: 'admin',
} as const

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]

// 買い手種別
export const BUYER_TYPE = {
  INDIVIDUAL: 'individual',
  REAL_ESTATE_COMPANY: 'real_estate_company',
  INVESTOR: 'investor',
  OTHER_COMPANY: 'other_company',
} as const

export type BuyerType = (typeof BUYER_TYPE)[keyof typeof BUYER_TYPE]

// 資格種別
export const QUALIFICATION_TYPE = {
  TAX_ACCOUNTANT: 'tax_accountant',
  JUDICIAL_SCRIVENER: 'judicial_scrivener',
  LAWYER: 'lawyer',
  ADMINISTRATIVE_SCRIVENER: 'administrative_scrivener',
  OTHER: 'other',
} as const

export type QualificationType = (typeof QUALIFICATION_TYPE)[keyof typeof QUALIFICATION_TYPE]

// 就業形態
export const EMPLOYMENT_TYPE = {
  EMPLOYEE: 'employee',
  SOLE_PROPRIETOR: 'sole_proprietor',
  REPRESENTATIVE: 'representative',
} as const

export type EmploymentType = (typeof EMPLOYMENT_TYPE)[keyof typeof EMPLOYMENT_TYPE]

// 報酬支払先
export const PAYMENT_RECIPIENT = {
  SELF: 'self',
  OFFICE: 'office',
} as const

export type PaymentRecipient = (typeof PAYMENT_RECIPIENT)[keyof typeof PAYMENT_RECIPIENT]

// 紹介経路
export const REFERRAL_CHANNEL = {
  NW: 'nw',
  DIRECT: 'direct',
} as const

export type ReferralChannel = (typeof REFERRAL_CHANNEL)[keyof typeof REFERRAL_CHANNEL]

// 入札不成立時の選択肢
export const FAILED_BID_ACTION = {
  NORMAL_LISTING: 'normal_listing',
  RELIST: 'relist',
} as const

export type FailedBidAction = (typeof FAILED_BID_ACTION)[keyof typeof FAILED_BID_ACTION]

// 最高額以外を選んだ場合の理由
export const NON_HIGHEST_BID_REASON = {
  CREDIT_CONCERN: 'credit_concern',
  CONDITION_MISMATCH: 'condition_mismatch',
  OTHER: 'other',
} as const

export type NonHighestBidReason = (typeof NON_HIGHEST_BID_REASON)[keyof typeof NON_HIGHEST_BID_REASON]

// 書類種別
export const DOCUMENT_TYPE = {
  REGISTRY_CERTIFICATE: 'registry_certificate',
  INHERITANCE_AGREEMENT: 'inheritance_agreement',
  REGISTRATION_PROOF: 'registration_proof',
  TAX_NOTICE: 'tax_notice',
  IDENTITY_DOCUMENT: 'identity_document',
  PROPERTY_PHOTO: 'property_photo',
  IMPORTANT_MATTER_EXPLANATION: 'important_matter_explanation',
  SALES_CONTRACT: 'sales_contract',
  SETTLEMENT_PROOF: 'settlement_proof',
} as const

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE]

// APIレスポンス共通型
export type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: {
    code: string
    message: string
  }
}

// ページネーション
export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 再エクスポート（利便性のため）
export type {
  PropertyStatus,
  PropertyType,
  Urgency,
  BidStatus,
  CaseStatus,
  VerificationStatus,
  PaymentStatus,
  NotificationEvent,
  NotificationChannel,
}
