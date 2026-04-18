'use client'

import { useState, useEffect } from 'react'
import {
  Download,
  Eye,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { brokerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Invoice = {
  id: string
  propertyTitle: string
  salePrice: number
  brokerageFee: number
  brokerAmount: number
  ouverAmount: number
  status: 'unpaid' | 'invoiced' | 'paid'
  issuedAt: string
  closedAt: string
}

const invoiceStatusIcon: Record<string, React.ReactNode> = {
  unpaid: <AlertCircle className="w-4 h-4 text-warning-500" />,
  invoiced: <Clock className="w-4 h-4 text-info-500" />,
  paid: <CheckCircle className="w-4 h-4 text-success-500" />,
}

const invoiceStatusLabel: Record<string, string> = {
  unpaid: '未払い',
  invoiced: '請求済み',
  paid: '入金済み',
}

const invoiceStatusStyle: Record<string, string> = {
  unpaid: 'text-warning-700',
  invoiced: 'text-info-700',
  paid: 'text-success-700',
}

const toMan = (yen: number) => Math.round(yen / 10000)

export default function BrokerInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/revenue/broker/me/invoices')
      if (res.success) {
        setInvoices(toItems<Invoice>(res.data))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="請求書" roleLabel="提携業者" navItems={brokerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="請求書"
      roleLabel="提携業者"
      navItems={brokerNav}
    >
      <p className="text-sm text-neutral-400 mb-6">
        決済完了後に自動生成された請求書を確認・ダウンロードできます
      </p>

      {invoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="請求書はありません"
          description="決済が完了した案件の請求書がここに表示されます"
        />
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">成約価格</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">仲介手数料</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">業者配分</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">Ouver振込額</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">発行日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5 font-medium">{inv.propertyTitle}</td>
                      <td className="py-3.5 px-5 price">{toMan(inv.salePrice).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                      <td className="py-3.5 px-5 price">{toMan(inv.brokerageFee).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                      <td className="py-3.5 px-5 price">{toMan(inv.brokerAmount).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                      <td className="py-3.5 px-5 price">{toMan(inv.ouverAmount).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1.5">
                          {invoiceStatusIcon[inv.status]}
                          <span className={`text-sm ${invoiceStatusStyle[inv.status]}`}>{invoiceStatusLabel[inv.status]}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-400">{inv.issuedAt?.slice(0, 10)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => window.open(`/api/revenue/invoices/${inv.id}/pdf?preview=true`, '_blank')}
                            className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(`/api/revenue/invoices/${inv.id}/pdf`, '_blank')}
                            className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-white rounded-2xl shadow-card p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium">{inv.propertyTitle}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {invoiceStatusIcon[inv.status]}
                    <span className={`text-xs ${invoiceStatusStyle[inv.status]}`}>{invoiceStatusLabel[inv.status]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 mb-3">
                  <div>成約: <span className="price text-neutral-600">{toMan(inv.salePrice).toLocaleString()}</span>万円</div>
                  <div>手数料: <span className="price text-neutral-600">{toMan(inv.brokerageFee).toLocaleString()}</span>万円</div>
                  <div>配分: <span className="price text-neutral-600">{toMan(inv.brokerAmount).toLocaleString()}</span>万円</div>
                  <div>発行日: {inv.issuedAt?.slice(0, 10)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`/api/revenue/invoices/${inv.id}/pdf?preview=true`, '_blank')}
                    className="flex-1 px-3 py-2 text-xs font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                  >
                    プレビュー
                  </button>
                  <button
                    onClick={() => window.open(`/api/revenue/invoices/${inv.id}/pdf`, '_blank')}
                    className="flex-1 px-3 py-2 text-xs font-medium text-neutral-600 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    ダウンロード
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
