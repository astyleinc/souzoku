import { logger } from './logger'

// 定期ジョブを「失敗時もログに残して結果オブジェクトに error を載せる」形で実行する。
// 1ジョブの失敗で他ジョブを巻き添えにしないよう、各 job を独立して catch する。
// 呼び出し側は以下のように書ける:
//   const registryReminder = await safeRunJob('registryReminder', () => runX(db))
export const safeRunJob = async <T>(
  name: string,
  job: () => Promise<T>,
): Promise<T | { error: string }> => {
  try {
    return await job()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    logger.error(`${name}失敗`, { error: message })
    return { error: message }
  }
}
