// ダッシュボード共通型定義（APIレスポンス互換）

// APIから返る通知データ
export type ApiNotification = {
  id: string
  event: string
  channel: string
  title: string
  body: string
  isRead: boolean
  sentAt: string
  createdAt: string
  relatedEntityType?: string
  relatedEntityId?: string
}

export type Notification = {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}

// API通知をフロントエンド用に変換
export const toNotification = (n: ApiNotification): Notification => {
  const eventTypeMap: Record<string, Notification['type']> = {
    bid_received: 'info',
    bid_selected: 'success',
    property_approved: 'success',
    property_returned: 'warning',
    payment_confirmed: 'success',
    case_status_changed: 'info',
  }
  return {
    id: n.id,
    message: n.title || n.body,
    type: eventTypeMap[n.event] ?? 'info',
    isRead: n.isRead,
    createdAt: n.sentAt ?? n.createdAt,
  }
}

export type BidStatus = 'active' | 'superseded' | 'selected' | 'rejected' | 'cancelled'

export type Bid = {
  id: string
  propertyId: string
  propertyTitle?: string
  bidderId: string
  bidderName?: string
  bidderType?: string
  amount: number
  status: BidStatus
  createdAt: string
  updatedAt: string
}

export type CaseStatus =
  | 'broker_assigned'
  | 'seller_contacted'
  | 'buyer_contacted'
  | 'explanation_done'
  | 'contract_signed'
  | 'settlement_done'
  | 'cancelled'

export type Case = {
  id: string
  propertyTitle?: string
  propertyAddress?: string
  sellerName?: string
  buyerName?: string
  brokerName?: string
  status: CaseStatus
  amount: number
  createdAt: string
  updatedAt: string
}
