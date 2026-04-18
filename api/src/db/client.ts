import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const createClient = () => {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL が設定されていません')
  }

  const queryClient = postgres(databaseUrl, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  })

  return drizzle(queryClient, { schema })
}

export type Database = ReturnType<typeof createClient>

// 遅延初期化（テストやCLI用にファクトリとして公開）
let db: Database | null = null

export const getDb = (): Database => {
  if (!db) {
    db = createClient()
  }
  return db
}
