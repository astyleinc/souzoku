// 通知イベント種別
export const NOTIFICATION_EVENT = {
  PROPERTY_REGISTERED: 'property_registered',
  PROPERTY_RETURNED: 'property_returned',
  PROPERTY_PUBLISHED: 'property_published',
  REGISTRATION_REMINDER: 'registration_reminder',
  REGISTRATION_AUTO_RETURN: 'registration_auto_return',
  NEW_BID: 'new_bid',
  INSTANT_PRICE_REACHED: 'instant_price_reached',
  INSTANT_APPROVAL_EXPIRED: 'instant_approval_expired',
  BID_PERIOD_ENDED: 'bid_period_ended',
  SELLER_SELECTED_BID: 'seller_selected_bid',
  DEAL_CLOSED: 'deal_closed',
  DEAL_RETURNED: 'deal_returned',
  INQUIRY_RECEIVED: 'inquiry_received',
  INQUIRY_REPLIED: 'inquiry_replied',
  CASE_STATUS_CHANGED: 'case_status_changed',
  SETTLEMENT_DONE: 'settlement_done',
  INVOICE_ISSUED: 'invoice_issued',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  EVALUATION_REQUEST: 'evaluation_request',
  NEW_PROFESSIONAL_REGISTERED: 'new_professional_registered',
} as const

export type NotificationEvent = (typeof NOTIFICATION_EVENT)[keyof typeof NOTIFICATION_EVENT]

// 通知チャネル
export const NOTIFICATION_CHANNEL = {
  EMAIL: 'email',
  SYSTEM: 'system',
  SLACK: 'slack',
} as const

export type NotificationChannel = (typeof NOTIFICATION_CHANNEL)[keyof typeof NOTIFICATION_CHANNEL]
