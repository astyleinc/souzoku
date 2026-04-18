'use client'

import { useState, useEffect } from 'react'
import {
  Download,
  Shield,
  UserCheck,
  FileText,
  Settings,
  AlertTriangle,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type AuditLog = {
  id: string
  timestamp: string
  actor: string
  type: string
  target: string
  detail: string
  ip: string
}

const typeConfig: Record<string, { label: string; icon: typeof Shield; className: string }> = {
  auth: { label: '認証', icon: UserCheck, className: 'bg-info-50 text-info-700' },
  property: { label: '物件', icon: FileText, className: 'bg-primary-50 text-primary-700' },
  admin: { label: '管理', icon: Settings, className: 'bg-neutral-100 text-neutral-700' },
  security: { label: 'セキュリティ', icon: Shield, className: 'bg-warning-50 text-warning-700' },
  alert: { label: '警告', icon: AlertTriangle, className: 'bg-error-50 text-error-700' },
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (typeFilter) params.set('type', typeFilter)
    if (dateFilter) params.set('date', dateFilter)
    const qs = params.toString()
    const res = await api.get<unknown>(`/admin/audit-log${qs ? `?${qs}` : ''}`)
    if (res.success) setLogs(toItems<AuditLog>(res.data))
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleExport = async () => {
    const params = new URLSearchParams()
    if (typeFilter) params.set('type', typeFilter)
    if (dateFilter) params.set('date', dateFilter)
    const qs = params.toString()
    window.open(`/api/admin/audit-log/export${qs ? `?${qs}` : ''}`, '_blank')
  }

  return (
    <DashboardShell
      title="監査ログ"
      roleLabel="管理者"
      navItems={adminNav}
    >
      {/* フィルタ */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
        >
          <option value="">すべての種別</option>
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
        />
        <button
          onClick={fetchLogs}
          className="px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
        >
          検索
        </button>
        <div className="ml-auto">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV出力
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">日時</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作者</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">対象</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">詳細</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const tc = typeConfig[log.type] ?? typeConfig.admin
                    return (
                      <tr key={log.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                        <td className="py-3 px-5 text-neutral-400 whitespace-nowrap text-xs">{log.timestamp}</td>
                        <td className="py-3 px-5 font-medium whitespace-nowrap">{log.actor}</td>
                        <td className="py-3 px-5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tc.className}`}>
                            <tc.icon className="w-3 h-3" />
                            {tc.label}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-neutral-500">{log.target}</td>
                        <td className="py-3 px-5 text-neutral-600">{log.detail}</td>
                        <td className="py-3 px-5 text-neutral-400 text-xs font-mono">{log.ip}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            {logs.map((log) => {
              const tc = typeConfig[log.type] ?? typeConfig.admin
              return (
                <div key={log.id} className="bg-white rounded-2xl shadow-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{log.detail}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${tc.className}`}>
                      <tc.icon className="w-3 h-3" />
                      {tc.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-neutral-400">
                    <span>{log.actor}</span>
                    <span>{log.target}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
