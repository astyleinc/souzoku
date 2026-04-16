'use client'

import { useState } from 'react'
import {
  Download,
  Shield,
  UserCheck,
  FileText,
  Settings,
  AlertTriangle,
  Eye,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'

const typeConfig: Record<string, { label: string; icon: typeof Shield; className: string }> = {
  auth: { label: '認証', icon: UserCheck, className: 'bg-info-50 text-info-700' },
  property: { label: '物件', icon: FileText, className: 'bg-primary-50 text-primary-700' },
  admin: { label: '管理', icon: Settings, className: 'bg-neutral-100 text-neutral-700' },
  security: { label: 'セキュリティ', icon: Shield, className: 'bg-warning-50 text-warning-700' },
  alert: { label: '警告', icon: AlertTriangle, className: 'bg-error-50 text-error-700' },
}

const mockLogs = [
  { id: 'log1', timestamp: '2026-04-16 14:32:10', actor: '管理者A', type: 'admin', target: 'ユーザー #U-042', detail: '物件の審査を承認', ip: '203.0.113.10' },
  { id: 'log2', timestamp: '2026-04-16 14:28:55', actor: '中村 一郎', type: 'property', target: '物件 #P-015', detail: '物件情報を更新', ip: '198.51.100.25' },
  { id: 'log3', timestamp: '2026-04-16 13:15:00', actor: 'システム', type: 'security', target: 'ユーザー #U-088', detail: 'パスワードリセットを実行', ip: '-' },
  { id: 'log4', timestamp: '2026-04-16 12:50:30', actor: '管理者B', type: 'admin', target: '業者 #B-003', detail: '業者ステータスを有効化', ip: '203.0.113.11' },
  { id: 'log5', timestamp: '2026-04-16 11:22:18', actor: 'システム', type: 'alert', target: 'ユーザー #U-055', detail: 'ログイン試行が5回失敗（アカウントロック）', ip: '192.0.2.100' },
  { id: 'log6', timestamp: '2026-04-16 10:05:42', actor: '山田 太郎', type: 'auth', target: '-', detail: 'ログイン成功', ip: '198.51.100.30' },
  { id: 'log7', timestamp: '2026-04-16 09:30:00', actor: '管理者A', type: 'admin', target: '物件 #P-012', detail: '物件を差戻し', ip: '203.0.113.10' },
  { id: 'log8', timestamp: '2026-04-15 18:45:12', actor: '株式会社山本不動産', type: 'property', target: '物件 #P-015', detail: '入札を送信（3,600万円）', ip: '198.51.100.40' },
]

export default function AdminAuditLogPage() {
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = typeFilter ? mockLogs.filter((l) => l.type === typeFilter) : mockLogs

  return (
    <DashboardShell
      title="監査ログ"
      roleLabel="管理者"
      userName="管理者"
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
          className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
        />
        <div className="ml-auto">
          <button className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors">
            <Download className="w-4 h-4" />
            CSV出力
          </button>
        </div>
      </div>

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
              {filtered.map((log) => {
                const tc = typeConfig[log.type]
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
        {filtered.map((log) => {
          const tc = typeConfig[log.type]
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
    </DashboardShell>
  )
}
