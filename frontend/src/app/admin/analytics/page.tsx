'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Building2,
  TrendingUp,
  BarChart3,
  Clock,
  MapPin,
  Loader2,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'

type AnalyticsData = {
  professionals: {
    name: string
    qualification: string
    referralCount: number
    closedCount: number
  }[]
  brokers: {
    companyName: string
    totalDeals: number
    averageRating: number
  }[]
  nwStats: {
    name: string
    referralCount: number
    closedCount: number
    revenue: number
  }[]
  areaStats: {
    area: string
    propertyCount: number
    closedCount: number
  }[]
  funnel: {
    avgDaysToPublish: number
    avgDaysToBidEnd: number
    avgDaysToClose: number
    avgDaysToSettle: number
    totalAvgDays: number
  }
  summary: {
    totalProperties: number
    closingRate: number
    activeProfessionals: number
  }
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<AnalyticsData>('/admin-ext/analytics')
      if (res.success) setData(res.data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="分析" roleLabel="管理画面" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  if (!data) {
    return (
      <DashboardShell title="分析" roleLabel="管理画面" navItems={adminNav}>
        <p className="text-sm text-neutral-400 text-center py-20">分析データを取得できませんでした</p>
      </DashboardShell>
    )
  }

  const professionalStats = data.professionals
    .map((p) => ({
      ...p,
      conversionRate: p.referralCount > 0 ? ((p.closedCount / p.referralCount) * 100).toFixed(0) : '—',
    }))
    .sort((a, b) => b.closedCount - a.closedCount)

  const brokerStats = data.brokers.sort((a, b) => b.totalDeals - a.totalDeals)
  const maxPropertyCount = Math.max(...data.areaStats.map((a) => a.propertyCount), 1)

  return (
    <DashboardShell
      title="分析"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      {/* KPIサマリ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-primary-500" />
            <p className="text-xs text-neutral-400">累計物件数</p>
          </div>
          <p className="price text-2xl text-foreground">{data.summary.totalProperties}<span className="text-sm font-normal text-neutral-400 ml-1">件</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success-500" />
            <p className="text-xs text-neutral-400">成約率</p>
          </div>
          <p className="price text-2xl text-success-500">{data.summary.closingRate}<span className="text-sm font-normal text-neutral-400 ml-1">%</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-info-500" />
            <p className="text-xs text-neutral-400">登録→決済 平均</p>
          </div>
          <p className="price text-2xl text-foreground">{data.funnel.totalAvgDays}<span className="text-sm font-normal text-neutral-400 ml-1">日</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-secondary-500" />
            <p className="text-xs text-neutral-400">アクティブ士業数</p>
          </div>
          <p className="price text-2xl text-foreground">{data.summary.activeProfessionals}<span className="text-sm font-normal text-neutral-400 ml-1">名</span></p>
        </div>
      </div>

      {/* ファネル分析 */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-info-500" />
          平均所要日数（ファネル）
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch gap-0">
          {[
            { label: '登録→公開', days: data.funnel.avgDaysToPublish, color: 'bg-primary-400' },
            { label: '公開→入札終了', days: data.funnel.avgDaysToBidEnd, color: 'bg-cta-400' },
            { label: '入札終了→成約', days: data.funnel.avgDaysToClose, color: 'bg-warning-400' },
            { label: '成約→決済', days: data.funnel.avgDaysToSettle, color: 'bg-success-400' },
          ].map((step, i) => (
            <div key={step.label} className="flex-1 text-center">
              <div className={`h-8 ${step.color} ${i === 0 ? 'rounded-l-lg' : ''} ${i === 3 ? 'rounded-r-lg' : ''} flex items-center justify-center`}>
                <span className="text-xs text-white font-medium">{step.days}日</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1.5">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 士業別実績 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-secondary-500" />
            士業別 紹介・成約実績
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-2 text-xs text-neutral-400 font-medium">士業名</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">紹介</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">成約</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">成約率</th>
              </tr>
            </thead>
            <tbody>
              {professionalStats.map((p) => (
                <tr key={p.name} className="border-t border-neutral-100">
                  <td className="py-2.5">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.qualification}</p>
                  </td>
                  <td className="py-2.5 text-right price">{p.referralCount}</td>
                  <td className="py-2.5 text-right price">{p.closedCount}</td>
                  <td className="py-2.5 text-right text-xs font-medium">{p.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NW別実績 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-info-500" />
            NW別 紹介・成約実績
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-2 text-xs text-neutral-400 font-medium">NW名</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">紹介</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">成約</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">収益（万円）</th>
              </tr>
            </thead>
            <tbody>
              {data.nwStats.map((nw) => (
                <tr key={nw.name} className="border-t border-neutral-100">
                  <td className="py-2.5 font-medium">{nw.name}</td>
                  <td className="py-2.5 text-right price">{nw.referralCount}</td>
                  <td className="py-2.5 text-right price">{nw.closedCount}</td>
                  <td className="py-2.5 text-right price">{nw.revenue.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 業者別実績 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary-500" />
            業者別 成約件数・評価
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-2 text-xs text-neutral-400 font-medium">業者名</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">成約数</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">平均評価</th>
              </tr>
            </thead>
            <tbody>
              {brokerStats.map((b) => (
                <tr key={b.companyName} className="border-t border-neutral-100">
                  <td className="py-2.5 font-medium text-xs">{b.companyName}</td>
                  <td className="py-2.5 text-right price">{b.totalDeals}</td>
                  <td className="py-2.5 text-right">
                    <span className="text-sm font-medium">{b.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-neutral-400 ml-0.5">/ 5</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* エリア別 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cta-500" />
            エリア別 物件数・成約数
          </h2>
          <div className="space-y-2">
            {data.areaStats.map((area) => (
              <div key={area.area} className="flex items-center gap-3">
                <span className="text-sm font-medium w-16 shrink-0">{area.area}</span>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-5 bg-neutral-100 rounded overflow-hidden flex">
                    <div
                      className="h-full bg-primary-300 flex items-center justify-center"
                      style={{ width: `${(area.propertyCount / maxPropertyCount) * 100}%` }}
                    >
                      {area.propertyCount > 1 && <span className="text-[10px] text-white font-medium">{area.propertyCount}</span>}
                    </div>
                    {area.closedCount > 0 && (
                      <div
                        className="h-full bg-success-400 flex items-center justify-center"
                        style={{ width: `${(area.closedCount / maxPropertyCount) * 100}%` }}
                      >
                        <span className="text-[10px] text-white font-medium">{area.closedCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary-300 rounded" />
                <span>物件数</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-success-400 rounded" />
                <span>成約数</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
