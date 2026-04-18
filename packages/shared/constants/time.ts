// 時間関連の共通定数
// ミリ秒への換算を一箇所にまとめ、各所での計算ミスを防ぐ

// 基本単位
export const ONE_SECOND_MS = 1000
export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS
export const ONE_DAY_MS = 24 * ONE_HOUR_MS

// 署名付きURLの有効期限
// ドキュメントの一時公開など、短期アクセス向け
export const SIGNED_URL_DEFAULT_SECONDS = 60 * 60
// 業者が物件に添付する資料など、ある程度の期間参照される書類向け
export const SIGNED_URL_LONG_SECONDS = SIGNED_URL_DEFAULT_SECONDS * 24 * 30

// BetterAuthのセッション期限
export const SESSION_EXPIRY_DAYS = 7
export const SESSION_UPDATE_AGE_DAYS = 1

// APIリクエストのタイムアウト（ms）
export const API_TIMEOUT_DEFAULT_MS = 10_000
// ファイルアップロード等の長時間処理向け
export const API_TIMEOUT_UPLOAD_MS = 30_000
// 画面遷移のプリフェッチなど、失敗しても致命的でない短時間フェッチ向け
export const API_TIMEOUT_QUICK_MS = 3_000

// CORSプリフライトキャッシュ秒数
export const CORS_MAX_AGE_SECONDS = 86_400

// レート制限エントリのGCインターバル
export const RATE_LIMIT_CLEANUP_INTERVAL_MS = ONE_MINUTE_MS
