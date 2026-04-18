// 物件ステータス
export const PROPERTY_STATUS = {
  REVIEWING: 'reviewing',
  PUBLISHED: 'published',
  PUBLISHED_REGISTERING: 'published_registering',
  BIDDING: 'bidding',
  BID_ENDED: 'bid_ended',
  PENDING_APPROVAL: 'pending_approval',
  CLOSED: 'closed',
  RETURNED: 'returned',
  FAILED: 'failed',
  NORMAL_LISTING: 'normal_listing',
} as const

export type PropertyStatus = (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS]

export const PROPERTY_STATUS_LABEL: Record<PropertyStatus, string> = {
  reviewing: '審査待ち',
  published: '公開',
  published_registering: '公開（登記中）',
  bidding: '入札受付中',
  bid_ended: '入札終了',
  pending_approval: '承認待ち',
  closed: '成約',
  returned: '差戻し',
  failed: '不成立',
  normal_listing: '通常掲載',
}

// 入札ステータス
export const BID_STATUS = {
  ACTIVE: 'active',
  SUPERSEDED: 'superseded',
  SELECTED: 'selected',
  REJECTED: 'rejected',
} as const

export type BidStatus = (typeof BID_STATUS)[keyof typeof BID_STATUS]

// 案件ステータス
export const CASE_STATUS = {
  BROKER_ASSIGNED: 'broker_assigned',
  SELLER_CONTACTED: 'seller_contacted',
  BUYER_CONTACTED: 'buyer_contacted',
  EXPLANATION_DONE: 'explanation_done',
  CONTRACT_SIGNED: 'contract_signed',
  SETTLEMENT_DONE: 'settlement_done',
  CANCELLED: 'cancelled',
} as const

export type CaseStatus = (typeof CASE_STATUS)[keyof typeof CASE_STATUS]

// 案件ステータスの日本語ラベル
export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  broker_assigned: '業者割当済み',
  seller_contacted: '売主連絡済み',
  buyer_contacted: '買い手連絡済み',
  explanation_done: '重説完了',
  contract_signed: '契約締結',
  settlement_done: '決済完了',
  cancelled: '案件中止',
}

// 士業認証ステータス
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  AUTO_VERIFIED: 'auto_verified',
  MANUALLY_VERIFIED: 'manually_verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
} as const

export type VerificationStatus = (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS]

// 支払いステータス
export const PAYMENT_STATUS = {
  NOT_INVOICED: 'not_invoiced',
  INVOICED: 'invoiced',
  CONFIRMED: 'confirmed',
} as const

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

// 支払いステータスの日本語ラベル
export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  not_invoiced: '未請求',
  invoiced: '請求済み',
  confirmed: '入金確認済み',
}

// 物件種別
export const PROPERTY_TYPE = {
  HOUSE: 'house',
  LAND: 'land',
  APARTMENT: 'apartment',
  OTHER: 'other',
} as const

export type PropertyType = (typeof PROPERTY_TYPE)[keyof typeof PROPERTY_TYPE]

// 売却緊急度
export const URGENCY = {
  URGENT: 'urgent',
  THREE_MONTHS: 'three_months',
  ONE_YEAR: 'one_year',
  UNDECIDED: 'undecided',
} as const

export type Urgency = (typeof URGENCY)[keyof typeof URGENCY]
