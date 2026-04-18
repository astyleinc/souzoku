'use client'

import { useState, useEffect } from 'react'
import { Gavel } from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BidStatusBadge } from '@/components/shared/BidStatusBadge'
import { sellerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type ApiBid = {
  id: string
  propertyId: string
  propertyTitle: string
  bidderName: string
  bidderType: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

export default function SellerBidsPage() {
  const [bids, setBids] = useState<ApiBid[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/bids?role=seller')
      if (res.success) {
        setBids(toItems<ApiBid>(res.data))
      } else {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="入札一覧" roleLabel="売主" navItems={sellerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  // 物件ごとにグルーピング
  const grouped = bids.reduce<Record<string, ApiBid[]>>((acc, bid) => {
    if (!acc[bid.propertyId]) acc[bid.propertyId] = []
    acc[bid.propertyId].push(bid)
    return acc
  }, {})

  return (
    <DashboardShell
      title="入札一覧"
      roleLabel="売主"
      navItems={sellerNav}
    >
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <Gavel className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">まだ入札はありません</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([propertyId, propertyBids]) => (
            <div key={propertyId} className="bg-white rounded-2xl shadow-card">
              <div className="px-5 py-4">
                <h2 className="text-base font-semibold">{propertyBids[0].propertyTitle}</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  入札数: {propertyBids.length}件 / 最高額: {Math.round(Math.max(...propertyBids.map((b) => b.amount)) / 10000).toLocaleString()}万円
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
                    {propertyBids
                      .sort((a, b) => b.amount - a.amount)
                      .map((bid, i) => (
                        <tr key={bid.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                          <td className="py-3.5 px-5 font-medium">{bid.bidderName}</td>
                          <td className="py-3.5 px-5 text-neutral-500">{bid.bidderType}</td>
                          <td className="py-3.5 px-5 text-right">
                            <span className={`price ${i === 0 ? 'text-cta-600' : ''}`}>
                              {Math.round(bid.amount / 10000).toLocaleString()}
                            </span>
                            <span className="text-xs text-neutral-400 ml-1">万円</span>
                            {i === 0 && <span className="text-xs text-cta-500 ml-2">最高額</span>}
                          </td>
                          <td className="py-3.5 px-5">
                            <BidStatusBadge status={bid.status} />
                          </td>
                          <td className="py-3.5 px-5 text-neutral-400">{formatDate(bid.updatedAt)}</td>
                          <td className="py-3.5 px-5">
                            {bid.status === 'active' && (
                              <Link href={`/seller/bids/${bid.propertyId}`} className="text-sm text-cta-500 hover:text-cta-600 font-medium">
                                選択する
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* モバイル: カード */}
              <div className="sm:hidden divide-y divide-neutral-100">
                {propertyBids
                  .sort((a, b) => b.amount - a.amount)
                  .map((bid, i) => (
                    <div key={bid.id} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{bid.bidderName}</p>
                          <p className="text-xs text-neutral-400">{bid.bidderType}</p>
                        </div>
                        <BidStatusBadge status={bid.status} />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="price text-sm">
                          <span className={i === 0 ? 'text-cta-600' : ''}>{Math.round(bid.amount / 10000).toLocaleString()}</span>
                          <span className="text-xs font-normal text-neutral-400 ml-1">万円</span>
                          {i === 0 && <span className="text-xs text-cta-500 ml-1">最高額</span>}
                        </span>
                        {bid.status === 'active' && (
                          <Link href={`/seller/bids/${bid.propertyId}`} className="text-sm text-cta-500 font-medium">選択する</Link>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
