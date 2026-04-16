'use client'

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Clock,
  Users,
  Zap,
  RefreshCw,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'

const healthCards = [
  { label: 'API稼働率', value: '99.98%', sub: '過去30日', icon: Activity, color: 'text-success-500', bg: 'bg-success-50' },
  { label: 'レスポンス時間', value: '142ms', sub: 'p95', icon: Zap, color: 'text-info-500', bg: 'bg-info-50' },
  { label: 'エラー率', value: '0.02%', sub: '過去24時間', icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-50' },
  { label: 'アクティブユーザー', value: '284', sub: '現在オンライン', icon: Users, color: 'text-primary-500', bg: 'bg-primary-50' },
]

const services = [
  { name: 'Web アプリケーション', status: 'operational' as const, latency: '89ms' },
  { name: 'API サーバー', status: 'operational' as const, latency: '142ms' },
  { name: 'データベース', status: 'operational' as const, latency: '12ms' },
  { name: 'ストレージ', status: 'operational' as const, latency: '45ms' },
  { name: '認証サービス', status: 'operational' as const, latency: '67ms' },
  { name: 'メール配信', status: 'degraded' as const, latency: '320ms' },
  { name: 'PDF生成', status: 'operational' as const, latency: '1.2s' },
]

const serviceStatusConfig = {
  operational: { label: '正常', icon: CheckCircle, className: 'text-success-500' },
  degraded: { label: '低速', icon: AlertTriangle, className: 'text-warning-500' },
  down: { label: '停止', icon: XCircle, className: 'text-error-500' },
}

const incidents = [
  { date: '2026-04-15 09:30', title: 'メール配信の遅延', status: 'monitoring', detail: '一部のメール配信に最大5分の遅延が発生。原因調査中。' },
  { date: '2026-04-10 14:00', title: 'API レスポンス低下（解決済み）', status: 'resolved', detail: 'データベース接続プールの枯渇により、APIレスポンスが一時的に低下。接続プール設定を調整し解決。' },
  { date: '2026-04-02 03:00', title: '定期メンテナンス（完了）', status: 'resolved', detail: 'データベースのバージョンアップグレードを実施。約30分のダウンタイム。' },
]

export default function AdminSystemHealthPage() {
  return (
    <DashboardShell
      title="システム状態"
      roleLabel="管理者"
      userName="管理者"
      navItems={adminNav}
    >
      {/* 全体ステータス */}
      <div className="flex items-center gap-2 p-4 bg-success-50 border border-success-200 rounded-xl mb-6">
        <CheckCircle className="w-5 h-5 text-success-500" />
        <span className="text-sm font-medium text-success-700">すべてのシステムは正常に稼働しています</span>
        <span className="ml-auto text-xs text-success-600">最終確認: 2026-04-16 14:30</span>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {healthCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-[18px] h-[18px] ${card.color}`} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{card.label}（{card.sub}）</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* サービス別ステータス */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">サービス別ステータス</h2>
            <button className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {services.map((svc) => {
              const sc = serviceStatusConfig[svc.status]
              return (
                <div key={svc.name} className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <sc.icon className={`w-4 h-4 ${sc.className}`} />
                    <span className="text-sm">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400 font-mono">{svc.latency}</span>
                    <span className={`text-xs font-medium ${sc.className}`}>{sc.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* インシデントタイムライン */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4">インシデント履歴</h2>
          <div className="space-y-4">
            {incidents.map((inc) => (
              <div key={inc.date} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${inc.status === 'resolved' ? 'bg-success-500' : 'bg-warning-500'}`} />
                  <div className="w-px flex-1 bg-neutral-200 my-1" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium">{inc.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{inc.date}</p>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{inc.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
