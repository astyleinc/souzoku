import { createClient } from '@supabase/supabase-js'
import { SIGNED_URL_DEFAULT_SECONDS, SIGNED_URL_LONG_SECONDS } from '@shared/constants'

// 書類アップロード先の既定バケット
const BUCKET = 'documents'

let client: ReturnType<typeof createClient> | null = null

const getStorageClient = () => {
  if (!client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が設定されていません')
    }
    client = createClient(url, key)
  }
  return client
}

export const storage = {
  async createSignedUploadUrl(path: string): Promise<string> {
    const supabase = getStorageClient()
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path)

    if (error || !data) {
      throw new Error(`アップロードURL生成に失敗: ${error?.message}`)
    }
    return data.signedUrl
  },

  async createSignedDownloadUrl(path: string): Promise<string> {
    const supabase = getStorageClient()
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_DEFAULT_SECONDS)

    if (error || !data) {
      throw new Error(`ダウンロードURL生成に失敗: ${error?.message}`)
    }
    return data.signedUrl
  },

  async deleteFile(path: string): Promise<void> {
    const supabase = getStorageClient()
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path])

    if (error) {
      throw new Error(`ファイル削除に失敗: ${error.message}`)
    }
  },

  // バイナリを指定バケットにアップロードし、署名付きダウンロードURLを返す
  async uploadBinary(bucket: string, path: string, data: Uint8Array, contentType: string): Promise<string> {
    const supabase = getStorageClient()
    const upload = await supabase.storage.from(bucket).upload(path, data, {
      contentType,
      upsert: true,
    })
    if (upload.error) {
      throw new Error(`アップロードに失敗: ${upload.error.message}`)
    }

    const signed = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, SIGNED_URL_LONG_SECONDS)
    if (signed.error || !signed.data) {
      throw new Error(`署名付きURL生成に失敗: ${signed.error?.message}`)
    }
    return signed.data.signedUrl
  },
}
