'use client'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { BidStatusBadge } from '@/components/shared/BidStatusBadge'
import { sellerNav } from '@/config/navigation'
import { mockBids, type BidStatus } from '@/data/mock-dashboard'

export default function SellerBidsPage() {
  const grouped = mockBids.reduce<Record<string, typeof mockBids>>((acc, bid) => {
    if (!acc[bid.propertyId]) acc[bid.propertyId] = []
    acc[bid.propertyId].push(bid)
    return acc
  }, {})

  return (
    <DashboardShell
      title="入札一覧"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <div className="space-y-6">
        {Object.entries(grouped).map(([propertyId, bids]) => (
          <div key={propertyId} className="bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">{bids[0].propertyTitle}</h2>
              <p className="text-xs text-neutral-400 mt-1">
                入札数: {bids.length}件 / 最高額: {Math.max(...bids.map((b) => b.amount)).toLocaleString()}万円
              </p>
            </div>

            {/* PC: テーブル */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">入札者</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">入札額</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">更新日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {bids
                    .sort((a, b) => b.amount - a.amount)
                    .map((bid, i) => (
                      <tr key={bid.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                        <td className="py-3.5 px-5 font-medium">{bid.bidderName}</td>
                        <td className="py-3.5 px-5 text-neutral-500">{bid.bidderType}</td>
                        <td className="py-3.5 px-5 text-right">
                          <span className={`price ${i === 0 ? 'text-cta-600' : ''}`}>
                            {bid.amount.toLocaleString()}
                          </span>
                          <span className="text-xs text-neutral-400 ml-1">万円</span>
                          {i === 0 && <span className="text-xs text-cta-500 ml-2">最高額</span>}
                        </td>
                        <td className="py-3.5 px-5">
                          <BidStatusBadge status={bid.status as BidStatus} />
                        </td>
                        <td className="py-3.5 px-5 text-neutral-400">{bid.updatedAt}</td>
                        <td className="py-3.5 px-5">
                          {bid.status === 'active' && (
                            <button className="text-sm text-cta-500 hover:text-cta-600 font-medium">
                              選択する
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* モバイル: カード */}
            <div className="sm:hidden divide-y divide-neutral-100">
              {bids
                .sort((a, b) => b.amount - a.amount)
                .map((bid, i) => (
                  <div key={bid.id} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{bid.bidderName}</p>
                        <p className="text-xs text-neutral-400">{bid.bidderType}</p>
                      </div>
                      <BidStatusBadge status={bid.status as BidStatus} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="price text-sm">
                        <span className={i === 0 ? 'text-cta-600' : ''}>{bid.amount.toLocaleString()}</span>
                        <span className="text-xs font-normal text-neutral-400 ml-1">万円</span>
                        {i === 0 && <span className="text-xs text-cta-500 ml-1">最高額</span>}
                      </span>
                      {bid.status === 'active' && (
                        <button className="text-sm text-cta-500 font-medium">選択する</button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
