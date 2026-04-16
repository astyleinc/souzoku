// 起動時に必須環境変数を検証する
const required = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
] as const

const warnings = [
  { key: 'FRONTEND_URL', fallback: 'http://localhost:3000' },
  { key: 'BETTER_AUTH_URL', fallback: 'http://localhost:8787' },
] as const

export const validateEnv = () => {
  const missing: string[] = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    throw new Error(`必須環境変数が未設定です: ${missing.join(', ')}`)
  }

  // 本番環境での追加チェック
  if (process.env.NODE_ENV === 'production') {
    const secret = process.env.BETTER_AUTH_SECRET ?? ''
    if (secret.length < 32 || secret.includes('dev-secret')) {
      throw new Error('BETTER_AUTH_SECRET が本番用に設定されていません（32文字以上の安全な値を設定してください）')
    }

    if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes('localhost')) {
      throw new Error('本番環境では FRONTEND_URL に本番URLを設定してください')
    }

    if (!process.env.SUPABASE_URL) {
      throw new Error('SUPABASE_URL is required in production')
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required in production')
    }
  }

  // 開発環境でのフォールバック警告
  // ロガー初期化前なのでprocess.stderrに直接書き出す
  for (const { key, fallback } of warnings) {
    if (!process.env[key]) {
      process.stderr.write(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'warn',
        message: `${key} 未設定、フォールバック使用: ${fallback}`,
      }) + '\n')
    }
  }
}
