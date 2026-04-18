// 報酬配分率
// NW経由の紹介
export const COMMISSION_RATE_NW = {
  BROKER: 0.50,
  OUVER: 0.32,
  PROFESSIONAL: 0.15,
  NW: 0.03,
} as const

// 直接紹介（NW無し）
export const COMMISSION_RATE_DIRECT = {
  BROKER: 0.50,
  OUVER: 0.35,
  PROFESSIONAL: 0.15,
  NW: 0,
} as const

// 段階的手数料率（業者との交渉用）
export const TIERED_BROKER_RATE = {
  INITIAL: { maxDeals: 5, brokerRate: 0.60, ouverRate: 0.22 },
  GROWING: { maxDeals: 20, brokerRate: 0.55, ouverRate: 0.27 },
  STANDARD: { maxDeals: Infinity, brokerRate: 0.50, ouverRate: 0.32 },
} as const

// 片手仲介の補正
export const ONE_SIDED_BROKER_RATE = 0.60

// 仲介手数料計算の定数
export const BROKERAGE_FEE = {
  // 400万円超の場合: 売買価格 × 3% + 6万円（税別）
  RATE: 0.03,
  BASE_ADDITION: 60000,
  // 両手仲介は片手の2倍
  BOTH_SIDES_MULTIPLIER: 2,
  // 消費税率
  TAX_RATE: 0.10,
} as const

// 最低出品価格（円）
export const MIN_LISTING_PRICE = 10000000

// 低廉な空家等の売買特例
// 800万円以下の物件は、売主側の仲介手数料を 33万円（税別30万円）まで請求可能
export const LOW_VALUE_THRESHOLD = 8_000_000
export const LOW_VALUE_FEE_CAP = 300_000

// 即決価格承認期限（時間）
export const INSTANT_APPROVAL_DEADLINE_HOURS = 48

// 登記催促通知間隔（日）
export const REGISTRATION_REMINDER_INTERVAL_DAYS = 14

// 登記未了自動差戻し期限（日）
export const REGISTRATION_AUTO_RETURN_DAYS = 60

// 入札期間変更の最大回数
export const MAX_BID_PERIOD_CHANGES = 1
