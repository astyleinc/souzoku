// ファイルアップロード制約
// 物件書類・契約書など全アップロードUIで共通の制約値

// アップロードの上限サイズ（バイト）
// 住民票・登記簿謄本・契約書PDFなどを想定
export const FILE_UPLOAD_MAX_SIZE_BYTES = 10 * 1024 * 1024

// UI表示用の上限サイズ（MB単位）
export const FILE_UPLOAD_MAX_SIZE_MB = 10

// 受理するMIMEタイプ
// PDFは書類全般、画像は物件写真や身分証を想定
export const FILE_UPLOAD_ACCEPTED_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const

export type AcceptedMimeType = (typeof FILE_UPLOAD_ACCEPTED_MIME)[number]

// 受理する拡張子（input accept属性にそのまま使える形式）
export const FILE_UPLOAD_ACCEPT_ATTR = '.pdf,.jpg,.jpeg,.png'
