import type { Context } from 'hono'

// route ハンドラ内で多発する `c.get('validatedBody') as XxxInput` の定型を
// ジェネリクスで型付けしつつ一箇所にまとめるヘルパ。
// 呼び出し側は `const input = getValidatedBody<CreateBidInput>(c)` と書けるようになる。
// 実行時の検証は上流の validateBody ミドルウェアが担保しているため、
// ここではキャストのみ行う（Zodスキーマ型との整合は呼び出し側が保証する）。
export const getValidatedBody = <T>(c: Context): T =>
  c.get('validatedBody') as T

export const getValidatedQuery = <T>(c: Context): T =>
  c.get('validatedQuery') as T

// 認証ミドルウェア通過後のユーザー情報を取り出す。
// auth ミドルウェアがセットするので、ハンドラ側で再度 null チェックをしないで済む。
export const getCurrentUser = (c: Context) => c.get('user')
