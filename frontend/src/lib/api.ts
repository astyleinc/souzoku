import { API_TIMEOUT_DEFAULT_MS, API_TIMEOUT_UPLOAD_MS } from '@shared/constants'

type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: { code: string; message: string }
}

type RequestOptions = {
  headers?: Record<string, string>
}

const BASE = '/api'

const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<ApiResponse<T>> => {
  const url = `${BASE}${path}`
  const headers: Record<string, string> = {
    ...options?.headers,
  }
  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      signal: AbortSignal.timeout(API_TIMEOUT_DEFAULT_MS),
    })

    if (!res.ok) {
      // 未認証（401）のみログインへリダイレクト
      // 403は「認証済みだが権限不足」なのでリダイレクトしない
      if (res.status === 401 && typeof window !== 'undefined') {
        const current = window.location.pathname
        if (current !== '/login') {
          window.location.href = `/login?redirect=${encodeURIComponent(current)}`
        }
      }

      const json = await res.json().catch(() => null)
      return {
        success: false,
        error: json?.error ?? { code: 'UNKNOWN', message: `HTTP ${res.status}` },
      }
    }

    const json = await res.json()
    return { success: true, data: json.data ?? json }
  } catch {
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: 'サーバーに接続できませんでした' },
    }
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
  upload: async <T = unknown>(path: string, formData: FormData): Promise<ApiResponse<T>> => {
    const url = `${BASE}${path}`
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        signal: AbortSignal.timeout(API_TIMEOUT_UPLOAD_MS),
      })
      if (!res.ok) {
        if (res.status === 401 && typeof window !== 'undefined') {
          const current = window.location.pathname
          if (current !== '/login') {
            window.location.href = `/login?redirect=${encodeURIComponent(current)}`
          }
        }
        const json = await res.json().catch(() => null)
        return {
          success: false,
          error: json?.error ?? { code: 'UNKNOWN', message: `HTTP ${res.status}` },
        }
      }
      const json = await res.json()
      return { success: true, data: json.data ?? json }
    } catch {
      return {
        success: false,
        error: { code: 'NETWORK_ERROR', message: 'サーバーに接続できませんでした' },
      }
    }
  },
}

// APIレスポンスから配列を安全に取り出すヘルパー
// サービスが配列を直接返す場合も { items: [...] } で返す場合も対応
export const toItems = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items: unknown }).items)) {
    return (data as { items: T[] }).items
  }
  return []
}
