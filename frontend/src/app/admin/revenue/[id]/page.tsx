'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Building2,
  Users,
  Globe,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type RevenueDetail = {
  id: string
  propertyTitle: string
  salePrice: number
  brokerageFee: number
  brokerAmount: number
  ouverAmount: number
  professionalAmount: number
  nwAmount: number
  isNwReferral: boolean
  paymentStatus: 'paid' | 'invoiced' | 'unpaid'
  closedAt: string
  brokerName: string | null
  sellerName: string | null
  buyerName: string | null
  caseId: string | null
}

type PaymentItem = {
  id: string
  recipientType: string
  recipientName: string
  amount: number
  status: string
}

const toMan = (yen: number) => Math.round(yen / 10000)

const paymentStatusConfig = {
  paid: { label: '入金確認済み', icon: CheckCircle, textColor: 'text-success-700', bgColor: 'bg-success-50' },
  invoiced: { label: '請求済み', icon: Clock, textColor: 'text-warning-700', bgColor: 'bg-warning-50' },
  unpaid: { label: '未請求', icon: AlertCircle, textColor: 'text-neutral-500', bgColor: 'bg-neutral-50' },
}

export default function AdminRevenueDetailPage() {
  const params = useParams()
  const [revenue, setRevenue] = useState<RevenueDetail | null>(null)
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [revRes, payRes] = await Promise.all([
        api.get<unknown>(`/revenue/${params.id}`),
        api.get<unknown>(`/revenue/${params.id}/payments`),
      ])
      if (revRes.success) setRevenue(revRes.data as RevenueDetail)
      if (payRes.success) setPayments(toItems<PaymentItem>(payRes.data))
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <DashboardShell title="収益詳細" roleLabel="管理画面" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  if (!revenue) {
    return (
      <DashboardShell title="収益詳細" roleLabel="管理画面" navItems={adminNav}>
        <p className="text-sm text-neutral-400 text-center py-20">収益データが見つかりませんでした</p>
      </DashboardShell>
    )
  }

  const status = paymentStatusConfig[revenue.paymentStatus] ?? paymentStatusConfig.unpaid
  const feeMan = toMan(revenue.brokerageFee)
  const distributions = [
    { label: '提携業者', amount: toMan(revenue.brokerAmount), ratio: feeMan > 0 ? (toMan(revenue.brokerAmount) / feeMan) * 100 : 0, color: 'bg-primary-400' },
    { label: '株式会社Ouver', amount: toMan(revenue.ouverAmount), ratio: feeMan > 0 ? (toMan(revenue.ouverAmount) / feeMan) * 100 : 0, color: 'bg-cta-400' },
    { label: '士業パートナー', amount: toMan(revenue.professionalAmount), ratio: feeMan > 0 ? (toMan(revenue.professionalAmount) / feeMan) * 100 : 0, color: 'bg-secondary-400' },
    ...(revenue.isNwReferral ? [{ label: 'NW', amount: toMan(revenue.nwAmount), ratio: feeMan > 0 ? (toMan(revenue.nwAmount) / feeMan) * 100 : 0, color: 'bg-info-400' }] : []),
  ]

  return (
    <DashboardShell
      title="収益詳細"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      <Link href="/admin/revenue" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        収益管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 物件・取引情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">{revenue.propertyTitle}</h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                <status.icon className="w-3.5 h-3.5" />
                {status.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-1">成約価格</p>
                <p className="price text-lg">{toMan(revenue.salePrice).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">仲介手数料（税別）</p>
                <p className="price text-lg">{feeMan.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">決済完了日</p>
                <p>{revenue.closedAt?.slice(0, 10)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">紹介経路</p>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-info-500" />
                  <span>{revenue.isNwReferral ? 'NW経由' : '直接紹介'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 配分内訳 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">配分内訳</h3>
            <div className="space-y-3">
              {distributions.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-neutral-600">{item.label}</span>
                    <span className="price font-medium">{item.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span><span className="text-xs text-neutral-400 ml-2">({item.ratio.toFixed(0)}%)</span></span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.ratio}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-sm">
              <span className="font-medium">合計</span>
              <span className="price font-semibold">{feeMan.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
            </div>
          </div>

          {/* 請求・入金管理 */}
          {payments.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-4">請求・入金管理</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-2 text-xs text-neutral-400 font-medium">対象</th>
                    <th className="text-right py-2 text-xs text-neutral-400 font-medium">金額</th>
                    <th className="text-left py-2 text-xs text-neutral-400 font-medium">状況</th>
                    <th className="text-left py-2 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const pStatus = paymentStatusConfig[p.status as keyof typeof paymentStatusConfig] ?? paymentStatusConfig.unpaid
                    return (
                      <tr key={p.id} className="border-t border-neutral-100">
                        <td className="py-3">{p.recipientName}</td>
                        <td className="py-3 text-right price">{toMan(p.amount).toLocaleString()}万円</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pStatus.bgColor} ${pStatus.textColor}`}>
                            {pStatus.label}
                          </span>
                        </td>
                        <td className="py-3">
                          {p.status === 'unpaid' && (
                            <button
                              onClick={() => api.patch(`/revenue/${params.id}/payments/${p.id}`, { status: 'invoiced' }).then((r) => { if (r.success) window.location.reload() })}
                              className="text-xs text-cta-500 hover:underline font-medium"
                            >
                              請求書発行
                            </button>
                          )}
                          {p.status === 'invoiced' && (
                            <button
                              onClick={() => api.patch(`/revenue/${params.id}/payments/${p.id}`, { status: 'paid' }).then((r) => { if (r.success) window.location.reload() })}
                              className="text-xs text-success-500 hover:underline font-medium"
                            >
                              入金確認
                            </button>
                          )}
                          {p.status === 'paid' && (
                            <button
                              onClick={() => window.open(`/api/revenue/invoices/${p.id}/pdf`, '_blank')}
                              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600"
                            >
                              <Download className="w-3.5 h-3.5" />
                              領収書
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">関係者</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-primary-400" />
                  <p className="text-xs text-neutral-400">担当業者</p>
                </div>
                <p className="font-medium">{revenue.brokerName ?? '—'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-secondary-400" />
                  <p className="text-xs text-neutral-400">売主</p>
                </div>
                <p className="font-medium">{revenue.sellerName ?? '—'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-info-400" />
                  <p className="text-xs text-neutral-400">買い手</p>
                </div>
                <p className="font-medium">{revenue.buyerName ?? '—'}</p>
              </div>
            </div>
          </div>

          {revenue.caseId && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-3">関連案件</h3>
              <Link
                href={`/admin/cases/${revenue.caseId}`}
                className="block p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors text-sm font-medium text-primary-500"
              >
                案件詳細を見る
              </Link>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">管理者メモ</h3>
            <textarea
              rows={4}
              placeholder="社内メモを入力..."
              className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
            />
            <button className="mt-2 px-4 py-2 text-xs font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              保存
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
