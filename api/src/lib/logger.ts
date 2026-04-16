type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info'

const shouldLog = (level: LogLevel): boolean =>
  LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]

const formatMessage = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString()
  const base = { timestamp, level, message }
  return meta ? { ...base, ...meta } : base
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('debug')) {
      process.stdout.write(JSON.stringify(formatMessage('debug', message, meta)) + '\n')
    }
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('info')) {
      process.stdout.write(JSON.stringify(formatMessage('info', message, meta)) + '\n')
    }
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('warn')) {
      process.stderr.write(JSON.stringify(formatMessage('warn', message, meta)) + '\n')
    }
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('error')) {
      process.stderr.write(JSON.stringify(formatMessage('error', message, meta)) + '\n')
    }
  },
}
