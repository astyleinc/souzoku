'use client'

import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trophy,
  Building2,
  Users,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BidStatusBadge } from '@/components/shared/BidStatusBadge'
import { adminNav } from '@/config/navigation'
import { mockBids } from '@/data/mock-dashboard'

const propertyBids = mockBids
  .filter((b) => b.propertyId === '1')
  .sort((a, b) => b.amount - a.amount)

const highestAmount = propertyBids.length > 0 ? propertyBids[0].amount : 0

export default function AdminBidDetailPage() {
  const selectedBid = propertyBids[1]

  return (
    <DashboardShell
      title="入札審査"
      roleLabel="管理画面"
      userName="田中 太郎"
      navItems={adminNav}
    >
      <Link href="/admin/bids" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        入札管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 物件情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold">練馬区 駅近マンション 3LDK</h2>
                <p className="text-xs text-neutral-400 mt-0.5">東京都練馬区豊玉北5丁目</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">希望価格</p>
                <p className="price font-medium">3,500<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">入札件数</p>
                <p className="font-medium">{propertyBids.length}件</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">最高入札額</p>
                <p className="price font-medium text-cta-500">{highestAmount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></p>
              </div>
            </div>
          </div>

          {/* 売主の選択 */}
          <div className="bg-warning-50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-warning-700">売主が最高額以外の入札者を選択しました</h3>
                <p className="text-sm text-warning-600 mt-1">
                  売主「中村 一郎」は最高額（{highestAmount.toLocaleString()}万円）ではなく、
                  <span className="font-medium">{selectedBid.bidderName}（{selectedBid.amount.toLocaleString()}万円）</span>を選択しました。
                </p>
                <div className="mt-3 p-3 bg-white rounded-xl">
                  <p className="text-xs text-neutral-400 mb-1">選択理由</p>
                  <p className="text-sm text-neutral-700">与信/資金調達に不安がある（最高額入札者について）</p>
                </div>
              </div>
            </div>
          </div>

          {/* 全入札一覧 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">入札一覧</h3>
            <div className="space-y-3">
              {propertyBids.map((bid) => {
                const isHighest = bid.amount === highestAmount
                const isSelected = bid.id === selectedBid.id
                return (
                  <div
                    key={bid.id}
                    className={`p-4 rounded-xl border-2 ${isSelected ? 'border-cta-300 bg-cta-50/30' : 'border-neutral-100'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {isHighest && <Trophy className="w-4 h-4 text-cta-500" />}
                        {isSelected && <CheckCircle className="w-4 h-4 text-success-500" />}
                        <div>
                          <p className="text-sm font-medium">{bid.bidderName}</p>
                          <p className="text-xs text-neutral-400">{bid.bidderType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="price font-semibold">{bid.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isSelected && <span className="text-xs text-success-500 font-medium">売主選択</span>}
                          {isHighest && !isSelected && <span className="text-xs text-cta-500 font-medium">最高額</span>}
                          <BidStatusBadge status={bid.status} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-neutral-400">
                      <span>入札日: {bid.createdAt}</span>
                      <span>更新日: {bid.updatedAt}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* サイドバー: 承認/差戻し */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-400" />
              関係者
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-neutral-400">売主</p>
                <p className="font-medium">中村 一郎</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">紹介士業</p>
                <p className="font-medium">山田 太郎（税理士）</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">承認判断</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-success-500 rounded-xl hover:bg-success-600 transition-colors">
                <CheckCircle className="w-4 h-4" />
                承認する
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-error-500 bg-error-50 rounded-xl hover:bg-error-100 transition-colors">
                <XCircle className="w-4 h-4" />
                差戻しする
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1.5">差戻し理由（差戻し時のみ）</label>
              <textarea
                rows={3}
                placeholder="差戻しの理由を記入してください"
                className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl text-xs text-neutral-500 leading-relaxed">
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-700">審査のポイント</p>
                <ul className="mt-1 space-y-1 list-disc pl-4">
                  <li>最高額以外の選択理由が妥当か</li>
                  <li>選択された入札者の信頼性</li>
                  <li>不正入札の兆候がないか</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
