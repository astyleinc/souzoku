'use client'

import {
  CheckCircle,
  Monitor,
  Smartphone,
  Globe,
  LogOut,
  Lock,
} from 'lucide-react'

type LoginEntry = {
  id: string
  datetime: string
  device: string
  browser: string
  ip: string
  location: string
  isCurrent: boolean
}

const mockEntries: LoginEntry[] = [
  { id: 'sl1', datetime: '2026-04-16 14:30', device: 'デスクトップ', browser: 'Chrome 126', ip: '203.0.113.10', location: '東京都', isCurrent: true },
  { id: 'sl2', datetime: '2026-04-15 09:15', device: 'モバイル', browser: 'Safari 19', ip: '198.51.100.25', location: '東京都', isCurrent: false },
  { id: 'sl3', datetime: '2026-04-12 18:42', device: 'デスクトップ', browser: 'Chrome 126', ip: '203.0.113.10', location: '東京都', isCurrent: false },
  { id: 'sl4', datetime: '2026-04-10 11:05', device: 'モバイル', browser: 'Chrome Mobile', ip: '192.0.2.50', location: '神奈川県', isCurrent: false },
  { id: 'sl5', datetime: '2026-04-08 20:30', device: 'デスクトップ', browser: 'Firefox 128', ip: '203.0.113.10', location: '東京都', isCurrent: false },
]

export const SecurityLog = () => {
  return (
    <div className="max-w-3xl space-y-6">
      {/* 現在のセッション */}
      <div className="bg-white rounded-2xl shadow-card p-5 border-2 border-success-200">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-success-500" />
          <h3 className="text-sm font-semibold">現在のセッション</h3>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-neutral-400" />
            {mockEntries[0].device} — {mockEntries[0].browser}
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            {mockEntries[0].location}
          </span>
          <span className="text-xs text-neutral-400">{mockEntries[0].ip}</span>
        </div>
      </div>

      {/* ログイン履歴 */}
      <div className="bg-white rounded-2xl shadow-card">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-base font-semibold">ログイン履歴</h3>
        </div>

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
              {mockEntries.map((entry) => (
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
          {mockEntries.map((entry) => (
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
      </div>

      {/* アクション */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-error-500 bg-error-50 rounded-xl hover:bg-error-100 transition-colors">
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
