'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  Monitor,
  Smartphone,
  Globe,
  LogOut,
  Lock,
  Loader2,
} from 'lucide-react'
import { api, toItems } from '@/lib/api'

type LoginEntry = {
  id: string
  datetime: string
  device: string
  browser: string
  ip: string
  location: string
  isCurrent: boolean
}

export const SecurityLog = () => {
  const [entries, setEntries] = useState<LoginEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/users/me/security-log')
      if (res.success) {
        setEntries(toItems<LoginEntry>(res.data))
      } else {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  const currentEntry = entries.find((e) => e.isCurrent)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      {/* 現在のセッション */}
      {currentEntry && (
        <div className="bg-white rounded-2xl shadow-card p-5 border-2 border-success-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-success-500" />
            <h3 className="text-sm font-semibold">現在のセッション</h3>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600">
            <span className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-neutral-400" />
              {currentEntry.device} — {currentEntry.browser}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              {currentEntry.location}
            </span>
            <span className="text-xs text-neutral-400">{currentEntry.ip}</span>
          </div>
        </div>
      )}

      {/* ログイン履歴 */}
      <div className="bg-white rounded-2xl shadow-card">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-base font-semibold">ログイン履歴</h3>
        </div>

        {entries.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-neutral-400">ログイン履歴はありません</p>
          </div>
        ) : (
          <>
            {/* PC: テーブル */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">日時</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">デバイス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ブラウザ</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">IP</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">場所</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-t border-neutral-100">
                      <td className="py-3 px-5 text-neutral-400 whitespace-nowrap">{entry.datetime}</td>
                      <td className="py-3 px-5">
                        <span className="flex items-center gap-1.5">
                          {entry.device === 'デスクトップ' ? (
                            <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                          ) : (
                            <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                          )}
                          {entry.device}
                          {entry.isCurrent && (
                            <span className="px-1.5 py-0.5 text-xs font-medium bg-success-50 text-success-700 rounded">現在</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-neutral-500">{entry.browser}</td>
                      <td className="py-3 px-5 text-neutral-400 font-mono text-xs">{entry.ip}</td>
                      <td className="py-3 px-5 text-neutral-500">{entry.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* モバイル: カード */}
            <div className="lg:hidden divide-y divide-neutral-100">
              {entries.map((entry) => (
                <div key={entry.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {entry.device === 'デスクトップ' ? (
                      <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                    <span className="text-sm font-medium">{entry.device}</span>
                    {entry.isCurrent && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-success-50 text-success-700 rounded">現在</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-neutral-400">
                    <span>{entry.browser}</span>
                    <span>{entry.location}</span>
                    <span>{entry.datetime}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* アクション */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-error-500 bg-error-50 rounded-xl hover:bg-error-100 transition-colors"
          onClick={async () => {
            const res = await api.post<unknown>('/users/me/sessions/revoke-all')
            if (res.success) {
              window.location.href = '/login'
            }
          }}
        >
          <LogOut className="w-4 h-4" />
          すべてのセッションからログアウト
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold">二要素認証（2FA）</h3>
        </div>
        <p className="text-xs text-neutral-400 mb-3">
          アカウントのセキュリティを強化するために、二要素認証を設定できます。
        </p>
        <span className="inline-block px-3 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-500 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  )
}
