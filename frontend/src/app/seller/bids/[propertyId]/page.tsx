'use client'

import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Building2,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { mockBids } from '@/data/mock-dashboard'

const propertyBids = mockBids
  .filter((b) => b.propertyId === '1')
  .sort((a, b) => b.amount - a.amount)

const highestAmount = propertyBids.length > 0 ? propertyBids[0].amount : 0

export default function SellerBidsByPropertyPage() {
  return (
    <DashboardShell
      title="入札一覧"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <Link href="/seller/bids" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        入札一覧に戻る
      </Link>

      {/* 物件情報 */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-semibold">練馬区 駅近マンション 3LDK</h2>
            <p className="text-xs text-neutral-400 mt-0.5">東京都練馬区豊玉北5丁目</p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-500">
              <span>希望価格: <span className="price font-medium text-neutral-700">3,500</span>万円</span>
              <span>入札件数: <span className="font-medium text-neutral-700">{propertyBids.length}</span>件</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                入札終了
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 入札者リスト */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">入札者を選択してください</h3>
        <p className="text-xs text-neutral-400 mb-4">
          最高額の入札者を選択するのが原則です。他の入札者を選択する場合は理由の記入が必要です。
        </p>

        {propertyBids.map((bid, i) => {
          const isHighest = bid.amount === highestAmount
          return (
            <div
              key={bid.id}
              className={`bg-white rounded-2xl shadow-card p-5 border-2 transition-colors cursor-pointer hover:border-primary-300 ${isHighest ? 'border-cta-200' : 'border-transparent'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isHighest && (
                      <Trophy className="w-4 h-4 text-cta-500" />
                    )}
                    <p className="text-sm font-semibold">{bid.bidderName}</p>
                    <span className="text-xs text-neutral-400">({bid.bidderType})</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-neutral-400 mt-1">
                    <span>入札日: {bid.createdAt}</span>
                    <span>更新日: {bid.updatedAt}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="price text-lg font-semibold">{bid.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></p>
                  {isHighest && (
                    <span className="text-xs text-cta-500 font-medium">最高額</span>
                  )}
                  {!isHighest && (
                    <span className="text-xs text-neutral-400">
                      差額 -{(highestAmount - bid.amount).toLocaleString()}万円
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-3">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors">
                  この入札者を選択
                </button>
                {!isHighest && (
                  <span className="flex items-center gap-1 text-xs text-warning-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    理由の記入が必要です
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 全辞退 */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <button className="px-5 py-2.5 text-sm font-medium text-error-500 bg-error-50 rounded-xl hover:bg-error-100 transition-colors">
          すべての入札を辞退する
        </button>
        <p className="text-xs text-neutral-400 mt-2">
          辞退すると物件ステータスは「不成立」となり、再出品または通常掲載への切り替えが選べます。
        </p>
      </div>
    </DashboardShell>
  )
}
