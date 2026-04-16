'use client'

import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BidStatusBadge } from '@/components/shared/BidStatusBadge'
import { buyerNav } from '@/config/navigation'
import { mockBids, type BidStatus } from '@/data/mock-dashboard'

export default function BuyerBidsPage() {
  return (
    <DashboardShell
      title="入札履歴"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
    >
      {/* フィルタ */}
      <div className="flex items-center gap-3 mb-6">
        <select className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
          <option value="">すべてのステータス</option>
          <option value="active">有効</option>
          <option value="selected">選択済み</option>
          <option value="rejected">不採用</option>
        </select>
      </div>

      {/* PC: テーブル */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">入札額</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">入札日</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">更新日</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockBids.map((bid) => (
                <tr key={bid.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                  <td className="py-3.5 px-5">
                    <Link href={`/properties/${bid.propertyId}`} className="hover:text-primary-500">
                      <p className="font-medium">{bid.propertyTitle}</p>
                    </Link>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="price">{bid.amount.toLocaleString()}</span>
                    <span className="text-xs text-neutral-400 ml-1">万円</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <BidStatusBadge status={bid.status as BidStatus} />
                  </td>
                  <td className="py-3.5 px-5 text-neutral-400">{bid.createdAt}</td>
                  <td className="py-3.5 px-5 text-neutral-400">{bid.updatedAt}</td>
                  <td className="py-3.5 px-5">
                    {bid.status === 'active' && (
                      <button className="text-sm text-primary-500 hover:text-primary-600">
                        入札を更新
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モバイル: カード */}
      <div className="sm:hidden space-y-3">
        {mockBids.map((bid) => (
          <Link
            key={bid.id}
            href={`/properties/${bid.propertyId}`}
            className="block bg-white rounded-2xl shadow-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{bid.propertyTitle}</p>
              <BidStatusBadge status={bid.status as BidStatus} />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
              <span>入札日: {bid.createdAt}</span>
              <span className="price text-sm text-foreground">{bid.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
            </div>
          </Link>
        ))}
      </div>
    </DashboardShell>
  )
}
