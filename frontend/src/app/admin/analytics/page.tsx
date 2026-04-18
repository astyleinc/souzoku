'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Building2,
  TrendingUp,
  BarChart3,
  Clock,
  MapPin,
  Download,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type ProfessionalKPI = {
  professionalId: string
  name: string
  qualificationType: string
  referralCount: number
  closedCount: number
  closeRate: number
  totalReward: number
}

type NwKPI = {
  nwCompanyId: string
  name: string
  referralCount: number
  closedCount: number
  closeRate: number
  totalRoyalty: number
}

type BrokerKPI = {
  brokerId: string
  companyName: string
  totalDeals: number
  settledCount: number
  totalBrokerFee: number
}

type AreaKPI = {
  prefecture: string
  city: string
  listingCount: number
  bidCount: number
  closedCount: number
}

type FunnelKPI = {
  avgDaysRegistrationToPublish: number
  avgDaysPublishToClose: number
  avgBidsPerProperty: number
  totalRegistered: number
  totalPublished: number
  totalClosed: number
  publishRate: number
  closeRate: number
}

const QUALIFICATION_LABEL: Record<string, string> = {
  tax_accountant: '税理士',
  judicial_scrivener: '司法書士',
  lawyer: '弁護士',
  administrative_scrivener: '行政書士',
  other: 'その他',
}

const toCsv = (rows: (string | number)[][]) =>
  rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')

const downloadCsv = (filename: string, content: string) => {
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function AdminAnalyticsPage() {
  const [professionals, setProfessionals] = useState<ProfessionalKPI[]>([])
  const [nw, setNw] = useState<NwKPI[]>([])
  const [brokers, setBrokers] = useState<BrokerKPI[]>([])
  const [areas, setAreas] = useState<AreaKPI[]>([])
  const [funnel, setFunnel] = useState<FunnelKPI | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [p, n, b, a, f] = await Promise.all([
        api.get<ProfessionalKPI[]>('/admin-ext/kpi/professionals'),
        api.get<NwKPI[]>('/admin-ext/kpi/nw'),
        api.get<BrokerKPI[]>('/admin-ext/kpi/brokers'),
        api.get<AreaKPI[]>('/admin-ext/kpi/areas'),
        api.get<FunnelKPI>('/admin-ext/kpi/funnel'),
      ])
      if (p.success) setProfessionals(p.data)
      if (n.success) setNw(n.data)
      if (b.success) setBrokers(b.data)
      if (a.success) setAreas(a.data)
      if (f.success) setFunnel(f.data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="分析" roleLabel="管理画面" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  const maxListing = Math.max(...areas.map((a) => a.listingCount), 1)

  const exportProfessionals = () => {
    downloadCsv(
      'kpi-professionals.csv',
      toCsv([
        ['氏名', '資格', '紹介件数', '成約件数', '成約率(%)', '総報酬(円)'],
        ...professionals.map((p) => [p.name, QUALIFICATION_LABEL[p.qualificationType] ?? p.qualificationType, p.referralCount, p.closedCount, p.closeRate, p.totalReward]),
      ]),
    )
  }

  const exportNw = () => {
    downloadCsv(
      'kpi-nw.csv',
      toCsv([
        ['NW会社', '紹介件数', '成約件数', '成約率(%)', '総ロイヤリティ(円)'],
        ...nw.map((r) => [r.name, r.referralCount, r.closedCount, r.closeRate, r.totalRoyalty]),
      ]),
    )
  }

  const exportBrokers = () => {
    downloadCsv(
      'kpi-brokers.csv',
      toCsv([
        ['業者名', '累計成約', '決済完了', '総手数料(円)'],
        ...brokers.map((r) => [r.companyName, r.totalDeals, r.settledCount, r.totalBrokerFee]),
      ]),
    )
  }

  const exportAreas = () => {
    downloadCsv(
      'kpi-areas.csv',
      toCsv([
        ['都道府県', '市区町村', '登録件数', '入札数', '成約件数'],
        ...areas.map((r) => [r.prefecture, r.city, r.listingCount, r.bidCount, r.closedCount]),
      ]),
    )
  }

  return (
    <DashboardShell
      title="分析"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      {/* ファネル サマリ */}
      {funnel && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-primary-500" />
              <p className="text-xs text-neutral-400">登録件数</p>
            </div>
            <p className="price text-2xl">{funnel.totalRegistered}<span className="text-sm text-neutral-400 ml-1">件</span></p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success-500" />
              <p className="text-xs text-neutral-400">公開率</p>
            </div>
            <p className="price text-2xl text-success-500">{funnel.publishRate}<span className="text-sm text-neutral-400 ml-1">%</span></p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-cta-500" />
              <p className="text-xs text-neutral-400">成約率</p>
            </div>
            <p className="price text-2xl text-cta-500">{funnel.closeRate}<span className="text-sm text-neutral-400 ml-1">%</span></p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-info-500" />
              <p className="text-xs text-neutral-400">平均入札/物件</p>
            </div>
            <p className="price text-2xl">{funnel.avgBidsPerProperty}<span className="text-sm text-neutral-400 ml-1">件</span></p>
          </div>
        </div>
      )}

      {/* 所要日数ファネル */}
      {funnel && (
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-info-500" />
            平均所要日数
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch gap-0">
            {[
              { label: '登録→公開', days: funnel.avgDaysRegistrationToPublish, color: 'bg-primary-400' },
              { label: '公開→成約', days: funnel.avgDaysPublishToClose, color: 'bg-cta-400' },
            ].map((step, i) => (
              <div key={step.label} className="flex-1 text-center">
                <div className={`h-8 ${step.color} ${i === 0 ? 'rounded-l-lg' : ''} ${i === 1 ? 'rounded-r-lg' : ''} flex items-center justify-center`}>
                  <span className="text-xs text-white font-medium">{step.days.toFixed(1)}日</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1.5">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 士業別KPI */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary-500" />
              士業別KPI
            </h2>
            <button onClick={exportProfessionals} className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700">
              <Download className="w-3 h-3" /> CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-2 text-xs text-neutral-400 font-medium">氏名</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">紹介</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">成約</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">成約率</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">総報酬</th>
                </tr>
              </thead>
              <tbody>
                {professionals.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-xs text-neutral-400">データなし</td></tr>
                )}
                {professionals.map((p) => (
                  <tr key={p.professionalId} className="border-t border-neutral-100">
                    <td className="py-2.5">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-neutral-400">{QUALIFICATION_LABEL[p.qualificationType] ?? p.qualificationType}</p>
                    </td>
                    <td className="py-2.5 text-right price">{p.referralCount}</td>
                    <td className="py-2.5 text-right price">{p.closedCount}</td>
                    <td className="py-2.5 text-right text-xs font-medium">{p.closeRate}%</td>
                    <td className="py-2.5 text-right price">{p.totalReward.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NW別KPI */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-info-500" />
              NW別KPI
            </h2>
            <button onClick={exportNw} className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700">
              <Download className="w-3 h-3" /> CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-2 text-xs text-neutral-400 font-medium">NW会社</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">紹介</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">成約</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">成約率</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">ロイヤリティ</th>
                </tr>
              </thead>
              <tbody>
                {nw.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-xs text-neutral-400">データなし</td></tr>
                )}
                {nw.map((r) => (
                  <tr key={r.nwCompanyId} className="border-t border-neutral-100">
                    <td className="py-2.5 font-medium">{r.name}</td>
                    <td className="py-2.5 text-right price">{r.referralCount}</td>
                    <td className="py-2.5 text-right price">{r.closedCount}</td>
                    <td className="py-2.5 text-right text-xs font-medium">{r.closeRate}%</td>
                    <td className="py-2.5 text-right price">{r.totalRoyalty.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 業者別KPI */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-500" />
              業者別KPI
            </h2>
            <button onClick={exportBrokers} className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700">
              <Download className="w-3 h-3" /> CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-2 text-xs text-neutral-400 font-medium">業者名</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">累計</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">決済済</th>
                  <th className="text-right py-2 text-xs text-neutral-400 font-medium">総手数料</th>
                </tr>
              </thead>
              <tbody>
                {brokers.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-xs text-neutral-400">データなし</td></tr>
                )}
                {brokers.map((b) => (
                  <tr key={b.brokerId} className="border-t border-neutral-100">
                    <td className="py-2.5 font-medium text-xs">{b.companyName}</td>
                    <td className="py-2.5 text-right price">{b.totalDeals}</td>
                    <td className="py-2.5 text-right price">{b.settledCount}</td>
                    <td className="py-2.5 text-right price">{b.totalBrokerFee.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* エリア別KPI */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cta-500" />
              エリア別KPI
            </h2>
            <button onClick={exportAreas} className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700">
              <Download className="w-3 h-3" /> CSV
            </button>
          </div>
          <div className="space-y-2">
            {areas.length === 0 && (
              <p className="py-4 text-center text-xs text-neutral-400">データなし</p>
            )}
            {areas.map((area) => (
              <div key={`${area.prefecture}/${area.city}`} className="flex items-center gap-3">
                <span className="text-xs font-medium w-24 shrink-0">
                  <span className="text-neutral-400">{area.prefecture}</span> {area.city}
                </span>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-5 bg-neutral-100 rounded overflow-hidden flex">
                    <div
                      className="h-full bg-primary-300 flex items-center justify-center"
                      style={{ width: `${(area.listingCount / maxListing) * 100}%` }}
                    >
                      {area.listingCount > 0 && <span className="text-[10px] text-white font-medium">{area.listingCount}</span>}
                    </div>
                    {area.closedCount > 0 && (
                      <div
                        className="h-full bg-success-400 flex items-center justify-center"
                        style={{ width: `${(area.closedCount / maxListing) * 100}%` }}
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
                <span>登録数</span>
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
