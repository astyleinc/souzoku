// ローカル単体起動用エントリ（Vercel本番ではこのファイルは使われない）
// Vercel経由では frontend/src/app/api/[[...route]]/route.ts から createApp() を利用する
import 'dotenv/config'
import { validateEnv } from './lib/env'
validateEnv()

import { serve } from '@hono/node-server'
import { createApp } from './app'
import { logger } from './lib/logger'

const app = createApp()
const port = Number(process.env.PORT ?? 8787)

serve({ fetch: app.fetch, port }, () => {
  logger.info('APIサーバー起動 (ローカル単体)', { port })
})
