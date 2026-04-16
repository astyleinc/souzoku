import { createClient } from '@supabase/supabase-js'

const BUCKET = 'documents'
const SIGNED_URL_EXPIRY = 3600 // 1時間

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
      .createSignedUrl(path, SIGNED_URL_EXPIRY)

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
}
