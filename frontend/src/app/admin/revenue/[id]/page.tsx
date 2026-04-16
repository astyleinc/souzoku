'use client'

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Building2,
  Users,
  Globe,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { mockRevenue, mockCases } from '@/data/mock-dashboard'

export default function AdminRevenueDetailPage() {
  const revenue = mockRevenue[0]
  const relatedCase = mockCases.find((c) => c.propertyTitle.includes('大田区'))

  const paymentStatusConfig = {
    paid: { label: '入金確認済み', icon: CheckCircle, textColor: 'text-success-700', bgColor: 'bg-success-50' },
    invoiced: { label: '請求済み', icon: Clock, textColor: 'text-warning-700', bgColor: 'bg-warning-50' },
    unpaid: { label: '未請求', icon: AlertCircle, textColor: 'text-neutral-500', bgColor: 'bg-neutral-50' },
  }

  const status = paymentStatusConfig[revenue.paymentStatus]

  return (
    <DashboardShell
      title="収益詳細"
      roleLabel="管理画面"
      userName="田中 太郎"
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
                <p className="price text-lg">{revenue.salePrice.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">仲介手数料（税別）</p>
                <p className="price text-lg">{revenue.brokerageFee.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">決済完了日</p>
                <p>{revenue.closedAt}</p>
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
              {[
                { label: '提携業者', amount: revenue.brokerAmount, ratio: revenue.brokerAmount / revenue.brokerageFee * 100, color: 'bg-primary-400' },
                { label: '株式会社Ouver', amount: revenue.ouverAmount, ratio: revenue.ouverAmount / revenue.brokerageFee * 100, color: 'bg-cta-400' },
                { label: '士業パートナー', amount: revenue.professionalAmount, ratio: revenue.professionalAmount / revenue.brokerageFee * 100, color: 'bg-secondary-400' },
                ...(revenue.isNwReferral ? [{ label: 'NW', amount: revenue.nwAmount, ratio: revenue.nwAmount / revenue.brokerageFee * 100, color: 'bg-info-400' }] : []),
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-neutral-600">{item.label}</span>
                    <span className="price font-medium">{item.amount.toFixed(1)}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span><span className="text-xs text-neutral-400 ml-2">({item.ratio.toFixed(0)}%)</span></span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.ratio}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-sm">
              <span className="font-medium">合計</span>
              <span className="price font-semibold">{revenue.brokerageFee.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
            </div>
          </div>

          {/* 請求・入金管理 */}
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
                <tr className="border-t border-neutral-100">
                  <td className="py-3">Ouver収益</td>
                  <td className="py-3 text-right price">{revenue.ouverAmount.toFixed(1)}万円</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3">
                    {revenue.paymentStatus === 'unpaid' && (
                      <button className="text-xs text-cta-500 hover:underline font-medium">請求書発行</button>
                    )}
                    {revenue.paymentStatus === 'invoiced' && (
                      <button className="text-xs text-success-500 hover:underline font-medium">入金確認</button>
                    )}
                    {revenue.paymentStatus === 'paid' && (
                      <button className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600">
                        <Download className="w-3.5 h-3.5" />
                        領収書
                      </button>
                    )}
                  </td>
                </tr>
                <tr className="border-t border-neutral-100">
                  <td className="py-3">士業報酬</td>
                  <td className="py-3 text-right price">{revenue.professionalAmount.toFixed(1)}万円</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">振込済み</span>
                  </td>
                  <td className="py-3">
                    <button className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600">
                      <Download className="w-3.5 h-3.5" />
                      明細
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 関係者 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">関係者</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-primary-400" />
                  <p className="text-xs text-neutral-400">担当業者</p>
                </div>
                <p className="font-medium">{relatedCase?.brokerName ?? '—'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-secondary-400" />
                  <p className="text-xs text-neutral-400">売主</p>
                </div>
                <p className="font-medium">{relatedCase?.sellerName ?? '—'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-info-400" />
                  <p className="text-xs text-neutral-400">買い手</p>
                </div>
                <p className="font-medium">{relatedCase?.buyerName ?? '—'}</p>
              </div>
            </div>
          </div>

          {/* 関連案件 */}
          {relatedCase && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-3">関連案件</h3>
              <Link
                href={`/broker/cases/${relatedCase.id}`}
                className="block p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <p className="text-sm font-medium">{relatedCase.propertyTitle}</p>
                <p className="text-xs text-neutral-400 mt-1">{relatedCase.propertyAddress}</p>
              </Link>
            </div>
          )}

          {/* メモ */}
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
