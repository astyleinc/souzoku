// 表示用フォーマッタを集約する。業務上頻出する「日付の先頭10文字切り取り」や
// 「万円表記への丸め」を各ページで独自に書かないための玄関口。

// ISO 文字列や Date から「YYYY-MM-DD」を返す。null/undefined/空文字は空文字で返す。
// Date オブジェクトを toISOString 経由で処理するので、タイムゾーンを気にする必要がある場面では注意。
export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return ''
  if (typeof value === 'string') {
    return value.slice(0, 10)
  }
  // Date の場合は UTC の YYYY-MM-DD（既存 slice(0,10) 実装と同等）
  return value.toISOString().slice(0, 10)
}

// 「YYYY-MM-DD HH:mm」形式。分単位まで表示したい一覧画面などで使う。
export const formatDateTime = (value: string | Date | null | undefined): string => {
  if (!value) return ''
  const iso = typeof value === 'string' ? value : value.toISOString()
  // '2026-04-18T10:30:00.000Z' → '2026-04-18 10:30'
  return iso.slice(0, 10) + ' ' + iso.slice(11, 16)
}

// 円を「1,234,567 円」表記にする。
export const formatYen = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return `${value.toLocaleString()} 円`
}

// 円を「1,234 万円」表記にする。桁は10,000で割り、小数点以下は切り捨て。
// 既存の PriceDisplay コンポーネントと同じ表示ルール。
export const formatMan = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  const man = Math.floor(value / 10_000)
  return `${man.toLocaleString()} 万円`
}
