import { notFound } from './errors'

// service 層で頻出する「1件取得 → 見つからなければ notFound」パターンを集約する。
// Drizzle のクエリビルダは `Promise<T[]>` として実行できるため、
// 呼び出し側はクエリ式をそのまま渡すだけでよい。
export const findOneOrThrow = async <T>(
  query: Promise<T[]>,
  resource: string,
): Promise<T> => {
  const rows = await query
  if (rows.length === 0) {
    throw notFound(resource)
  }
  return rows[0]
}

// 見つからなくても例外を投げず null を返す。存在チェックで分岐したい場合に使う。
export const findOneOrNull = async <T>(
  query: Promise<T[]>,
): Promise<T | null> => {
  const rows = await query
  return rows.length === 0 ? null : rows[0]
}

// オフセット計算の共通化。ページ番号は1起点。
export const calcOffset = (page: number, limit: number): number =>
  Math.max(0, (Math.max(1, page) - 1) * limit)

// ページネーション結果の標準形。
export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const buildPaginated = <T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.max(1, Math.ceil(total / limit)),
})
