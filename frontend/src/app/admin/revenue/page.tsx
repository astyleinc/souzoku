'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type RevenueItem = {
  id: string
  propertyTitle: string
  salePrice: number
  brokerageFee: number
  brokerAmount: number
  ouverAmount: number
  professionalAmount: number
  nwAmount: number
  isNwReferral: boolean
  paymentStatus: 'paid' | 'invoiced' | 'not_invoiced'
}

type RevenueSummary = {
  total: {
    brokerageFee: number
    ouverAmount: number
    brokerAmount: number
    professionalAmount: number
    dealCount: number
  }
  pendingPayments: number
}

const paymentStatusConfig: Record<string, { label: string; bg: string }> = {
  paid: { label: '入金確認済み', bg: 'bg-success-50 text-success-700' },
  invoiced: { label: '請求済み', bg: 'bg-warning-50 text-warning-700' },
  not_invoiced: { label: '未請求', bg: 'bg-neutral-50 text-neutral-500' },
}

export default function AdminRevenuePage() {
  const [summary, setSummary] = useState<RevenueSummary | null>(null)
  const [items, setItems] = useState<RevenueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [summaryRes, itemsRes] = await Promise.all([
        api.get<unknown>('/admin/revenue/summary'),
        api.get<unknown>('/revenue'),
      ])
      if (summaryRes.success) setSummary(summaryRes.data as RevenueSummary)
      if (itemsRes.success) setItems(toItems<RevenueItem>(itemsRes.data))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="収益管理" roleLabel="管理画面" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  const toMan = (yen: number) => Math.round(yen / 10000 * 10) / 10

  return (
    <DashboardShell
      title="収益管理"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      {/* サマリ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-neutral-400 mb-1">累計仲介手数料</p>
          <p className="price text-2xl text-foreground">{toMan(summary?.total.brokerageFee ?? 0).toFixed(1)}<span className="text-sm font-normal text-neutral-400 ml-1">万円</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-neutral-400 mb-1">Ouver収益</p>
          <p className="price text-2xl text-primary-500">{toMan(summary?.total.ouverAmount ?? 0).toFixed(1)}<span className="text-sm font-normal text-neutral-400 ml-1">万円</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-neutral-400 mb-1">未入金件数</p>
          <p className="price text-2xl text-warning-500">{summary?.pendingPayments ?? 0}<span className="text-sm font-normal text-neutral-400 ml-1">件</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-neutral-400 mb-1">成約件数</p>
          <p className="price text-2xl text-foreground">{summary?.total.dealCount ?? 0}<span className="text-sm font-normal text-neutral-400 ml-1">件</span></p>
        </div>
      </div>

      {/* 収益明細 */}
      <div className="bg-white rounded-2xl shadow-card">
        <div className="px-5 py-4">
          <h2 className="text-base font-semibold">収益明細</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">成約価格</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">手数料</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">業者</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">Ouver</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">士業</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">NW</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">NW経由</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">支払状況</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => {
                const status = paymentStatusConfig[r.paymentStatus] ?? paymentStatusConfig['not_invoiced']
                return (
                  <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50">
                    <td className="py-3.5 px-5 font-medium">{r.propertyTitle}</td>
                    <td className="py-3.5 px-5 text-right price">{toMan(r.salePrice).toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-right price">{toMan(r.brokerageFee).toFixed(0)}</td>
                    <td className="py-3.5 px-5 text-right price">{toMan(r.brokerAmount).toFixed(1)}</td>
                    <td className="py-3.5 px-5 text-right price text-primary-500">{toMan(r.ouverAmount).toFixed(1)}</td>
                    <td className="py-3.5 px-5 text-right price">{toMan(r.professionalAmount).toFixed(1)}</td>
                    <td className="py-3.5 px-5 text-right price">{toMan(r.nwAmount).toFixed(1)}</td>
                    <td className="py-3.5 px-5 text-xs text-neutral-400">{r.isNwReferral ? 'NW経由' : '直接'}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <Link href={`/admin/revenue/${r.id}`} className="text-xs text-primary-500 hover:underline font-medium">
                        詳細
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-neutral-100 text-xs text-neutral-400">
          ※ 金額はすべて万円（税別）
        </div>
      </div>
    </DashboardShell>
  )
}
