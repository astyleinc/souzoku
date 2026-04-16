'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Banknote,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type RevenueItem = {
  id: string
  propertyTitle: string
  salePrice: number
  professionalAmount: number
  isNwReferral: boolean
  paymentStatus: 'paid' | 'invoiced' | 'unpaid'
  closedAt: string
}

const paymentStatusConfig = {
  paid: { label: '入金済み', icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-50 text-success-700' },
  invoiced: { label: '請求済み', icon: Clock, color: 'text-warning-500', bg: 'bg-warning-50 text-warning-700' },
  unpaid: { label: '未請求', icon: AlertCircle, color: 'text-neutral-400', bg: 'bg-neutral-100 text-neutral-500' },
}

export default function ProfessionalEarningsPage() {
  const [items, setItems] = useState<RevenueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/revenue/professional/me')
      if (res.success) {
        setItems(toItems<RevenueItem>(res.data))
      } else {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="紹介料実績" roleLabel="士業パートナー" navItems={professionalNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  // 金額は円でAPIから返る想定 → 万円に変換
  const toMan = (yen: number) => Math.round(yen / 10000 * 10) / 10
  const totalEarnings = items.reduce((sum, r) => sum + r.professionalAmount, 0)
  const paidAmount = items.filter((r) => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.professionalAmount, 0)
  const pendingAmount = totalEarnings - paidAmount

  return (
    <DashboardShell
      title="紹介料実績"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      {/* サマリ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: '累計紹介料', value: toMan(totalEarnings), color: 'text-foreground' },
          { label: '入金済み', value: toMan(paidAmount), color: 'text-success-500' },
          { label: '未入金', value: toMan(pendingAmount), color: 'text-warning-500' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl shadow-card p-5">
            <p className="text-xs text-neutral-400 mb-1">{item.label}</p>
            <p className={`price text-2xl ${item.color}`}>{item.value.toFixed(1)}<span className="text-sm font-normal text-neutral-400 ml-1">万円</span></p>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <Banknote className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">紹介料の実績はまだありません</p>
        </div>
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">紹介料明細</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">成約価格</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">紹介料（15%）</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">NW</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">支払状況</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">成約日</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => {
                    const status = paymentStatusConfig[r.paymentStatus]
                    return (
                      <tr key={r.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                        <td className="py-3.5 px-5 font-medium">{r.propertyTitle}</td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="price">{toMan(r.salePrice).toLocaleString()}</span>
                          <span className="text-xs text-neutral-400 ml-1">万円</span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="price">{toMan(r.professionalAmount).toFixed(1)}</span>
                          <span className="text-xs text-neutral-400 ml-1">万円</span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-neutral-400">
                          {r.isNwReferral ? 'NW経由' : '直接紹介'}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${status.bg}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-neutral-400">{r.closedAt?.slice(0, 10)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            <h2 className="text-base font-semibold mb-3">紹介料明細</h2>
            {items.map((r) => {
              const status = paymentStatusConfig[r.paymentStatus]
              return (
                <div key={r.id} className="bg-white rounded-2xl shadow-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{r.propertyTitle}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium shrink-0 ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div>
                      <span className="text-neutral-400">成約価格</span>
                      <p className="price text-sm mt-0.5">{toMan(r.salePrice).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
                    </div>
                    <div>
                      <span className="text-neutral-400">紹介料</span>
                      <p className="price text-sm mt-0.5">{toMan(r.professionalAmount).toFixed(1)}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
                    </div>
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
