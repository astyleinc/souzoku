// レート制限設定
// 本番で値を調整する機会が多いため、アプリケーションのミドルウェア配線から分離する

// 全APIの上限（1分あたり）
export const RATE_LIMIT_API_PER_MINUTE = 300

// 認証系エンドポイントの上限
// BetterAuthのOAuth往復やセッション検証などの高頻度アクセスに対応
export const RATE_LIMIT_AUTH_PER_MINUTE = 120

// 入札エンドポイントの上限
// 連打防止を優先してやや低めに設定
export const RATE_LIMIT_BID_PER_MINUTE = 30

// サポート問い合わせの上限
// スパム対策で厳しめに設定
export const RATE_LIMIT_SUPPORT_PER_MINUTE = 10
