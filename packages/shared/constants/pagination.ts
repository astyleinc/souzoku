// ページネーション共通定数
// フロントエンド/バックエンド両方で参照し、一覧APIの既定値を一元管理する

// クエリのデフォルトページ番号（1始まり）
export const PAGINATION_DEFAULT_PAGE = 1

// 一覧APIで明示指定が無い場合の標準limit
export const PAGINATION_DEFAULT_LIMIT = 20

// limitの上限（これを超える要求は拒否）
export const PAGINATION_MAX_LIMIT = 100

// 用途別プリセット
// （管理画面の長尺リスト・ダッシュボードのサマリ表示など、頻出する値をまとめて定義）
export const PAGINATION_PRESET = {
  // ダッシュボード等のサマリ表示
  SUMMARY: 4,
  // 通常のカード一覧
  CARD_LIST: 10,
  // 管理画面のテーブル表示
  ADMIN_TABLE: 50,
  // コンテンツ一覧など全量に近い取得
  BULK: 100,
} as const
