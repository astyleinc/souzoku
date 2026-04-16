import type { PropertyStatus, CaseStatus } from '@shared/constants'
import { AppError, ERROR_CODE } from './errors'

// 物件ステータスの有効な遷移
const PROPERTY_TRANSITIONS: Record<string, string[]> = {
  reviewing: ['published', 'published_registering', 'returned'],
  published: ['bidding', 'returned'],
  published_registering: ['published', 'returned'],
  bidding: ['bid_ended', 'failed'],
  bid_ended: ['pending_approval'],
  pending_approval: ['closed', 'returned'],
  closed: [],
  returned: ['reviewing'],
  failed: ['normal_listing', 'bidding'],
  normal_listing: [],
}

// 案件ステータスの有効な遷移
const CASE_TRANSITIONS: Record<string, string[]> = {
  broker_assigned: ['seller_contacted', 'cancelled'],
  seller_contacted: ['buyer_contacted', 'cancelled'],
  buyer_contacted: ['explanation_done', 'cancelled'],
  explanation_done: ['contract_signed', 'cancelled'],
  contract_signed: ['settlement_done', 'cancelled'],
  settlement_done: [],
  cancelled: [],
}

export const validatePropertyTransition = (from: string, to: string) => {
  const allowed = PROPERTY_TRANSITIONS[from]
  if (!allowed || !allowed.includes(to)) {
    throw new AppError(
      ERROR_CODE.INVALID_STATUS_TRANSITION,
      `物件ステータス「${from}」から「${to}」への遷移は許可されていません`,
    )
  }
}

export const validateCaseTransition = (from: string, to: string) => {
  const allowed = CASE_TRANSITIONS[from]
  if (!allowed || !allowed.includes(to)) {
    throw new AppError(
      ERROR_CODE.INVALID_STATUS_TRANSITION,
      `案件ステータス「${from}」から「${to}」への遷移は許可されていません`,
    )
  }
}
