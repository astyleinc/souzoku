'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Users,
  Zap,
  RefreshCw,
  Building2,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type SystemHealth = {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  services: {
    api: { status: 'operational' | 'degraded' | 'down' }
    database: { status: 'operational' | 'degraded' | 'down'; responseTimeMs: number }
  }
  metrics: {
    totalUsers: number
    totalProperties: number
    activeSessions: number
  }
}

const serviceStatusConfig = {
  operational: { label: '正常', icon: CheckCircle, className: 'text-success-500' },
  degraded: { label: '低速', icon: AlertTriangle, className: 'text-warning-500' },
  down: { label: '停止', icon: XCircle, className: 'text-error-500' },
}

export default function AdminSystemHealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchHealth = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    const res = await api.get<SystemHealth>('/admin/system-health')
    if (res.success) {
      setHealth(res.data)
    } else {
      setError('システム情報の取得に失敗しました')
    }

    if (isRefresh) setRefreshing(false)
    else setLoading(false)
  }, [])

  useEffect(() => {
    fetchHealth()
  }, [fetchHealth])

  if (loading) {
    return (
      <DashboardShell title="システム状態" roleLabel="管理者" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  if (error || !health) {
    return (
      <DashboardShell title="システム状態" roleLabel="管理者" navItems={adminNav}>
        <div className="flex items-center gap-2 p-4 bg-error-50 border border-error-200 rounded-xl mb-6">
          <XCircle className="w-5 h-5 text-error-500" />
          <span className="text-sm font-medium text-error-700">{error ?? 'データを取得できませんでした'}</span>
          <button onClick={() => fetchHealth()} className="ml-auto text-sm text-error-600 hover:underline">再試行</button>
        </div>
      </DashboardShell>
    )
  }

  const overallOk = health.status === 'healthy'
  const dbStatus = health.services?.database ?? { status: 'down' as const, responseTimeMs: 0 }
  const apiStatus = health.services?.api ?? { status: 'down' as const }
  const dbMs = dbStatus.responseTimeMs ?? 0

  const serviceList = [
    { name: 'APIサーバー', status: apiStatus.status, latency: '-' },
    { name: 'データベース', status: dbStatus.status, latency: `${dbMs}ms` },
  ]

  return (
    <DashboardShell
      title="システム状態"
      roleLabel="管理者"
      navItems={adminNav}
    >
      {/* 全体ステータス */}
      <div className={`flex items-center gap-2 p-4 rounded-xl mb-6 ${overallOk ? 'bg-success-50 border border-success-200' : 'bg-warning-50 border border-warning-200'}`}>
        {overallOk ? (
          <CheckCircle className="w-5 h-5 text-success-500" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-warning-500" />
        )}
        <span className={`text-sm font-medium ${overallOk ? 'text-success-700' : 'text-warning-700'}`}>
          {overallOk ? 'すべてのシステムは正常に稼働しています' : 'システムに異常が検出されています'}
        </span>
        <span className={`ml-auto text-xs ${overallOk ? 'text-success-600' : 'text-warning-600'}`}>
          最終確認: {(health.timestamp ?? '').replace('T', ' ').slice(0, 19) || '—'}
        </span>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Activity, color: 'text-success-500', bg: 'bg-success-50', label: 'DB応答時間', value: `${dbMs}ms` },
          { icon: Zap, color: 'text-info-500', bg: 'bg-info-50', label: 'ステータス', value: overallOk ? '正常' : '要確認' },
          { icon: Users, color: 'text-primary-500', bg: 'bg-primary-50', label: '登録ユーザー', value: String(health.metrics?.totalUsers ?? 0) },
          { icon: Building2, color: 'text-cta-500', bg: 'bg-cta-50', label: '登録物件', value: String(health.metrics?.totalProperties ?? 0) },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-[18px] h-[18px] ${card.color}`} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* サービス別ステータス */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">サービス別ステータス</h2>
          <button
            onClick={() => fetchHealth(true)}
            disabled={refreshing}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="space-y-2">
          {serviceList.map((svc) => {
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

      {/* アクティブセッション */}
      <div className="mt-6 bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-base font-semibold mb-2">アクティブセッション</h2>
        <p className="text-3xl font-bold">{health.metrics?.activeSessions ?? 0}</p>
        <p className="text-xs text-neutral-400 mt-1">現在有効なセッション数</p>
      </div>
    </DashboardShell>
  )
}
