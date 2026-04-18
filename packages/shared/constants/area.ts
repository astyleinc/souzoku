// Phase 1 対応エリア（業務戦略書 4.2 に基づく）
// Phase 2 以降で順次拡大予定
export const ALLOWED_PREFECTURES = ['東京都', '神奈川県'] as const
export type AllowedPrefecture = (typeof ALLOWED_PREFECTURES)[number]

export const isAllowedPrefecture = (value: string): value is AllowedPrefecture =>
  (ALLOWED_PREFECTURES as readonly string[]).includes(value)
