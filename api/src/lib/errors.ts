import { HTTPException } from 'hono/http-exception'

// アプリケーション固有のエラーコード
export const ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BID_TOO_LOW: 'BID_TOO_LOW',
  BID_PERIOD_CLOSED: 'BID_PERIOD_CLOSED',
  LISTING_PRICE_TOO_LOW: 'LISTING_PRICE_TOO_LOW',
  MAX_PERIOD_CHANGES: 'MAX_PERIOD_CHANGES',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
} as const

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE]

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// よく使うエラーの生成関数
export const notFound = (resource: string) =>
  new AppError(ERROR_CODE.NOT_FOUND, `${resource}が見つかりません`, 404)

export const unauthorized = (message = '認証が必要です') =>
  new AppError(ERROR_CODE.UNAUTHORIZED, message, 401)

export const forbidden = (message = 'この操作を行う権限がありません') =>
  new AppError(ERROR_CODE.FORBIDDEN, message, 403)

export const conflict = (message: string) =>
  new AppError(ERROR_CODE.CONFLICT, message, 409)

export const validationError = (message: string) =>
  new AppError(ERROR_CODE.VALIDATION_ERROR, message, 400)
