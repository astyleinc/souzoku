'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  Clock,
  RefreshCw,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BidStatusBadge } from '@/components/shared/BidStatusBadge'
import { buyerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type BidDetail = {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

export default function BuyerBidDetailPage() {
  const params = useParams()
  const [bid, setBid] = useState<BidDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const load = async () => {
      // 入札一覧から取得して該当IDをフィルタ
      const res = await api.get<unknown>('/bids/me')
      if (res.success) {
        const found = toItems<BidDetail>(res.data).find((b) => b.id === params.id)
        if (found) setBid(found)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <DashboardShell title="入札詳細" roleLabel="買い手" navItems={buyerNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  if (!bid) {
    return (
      <DashboardShell title="入札詳細" roleLabel="買い手" navItems={buyerNav}>
        <p className="text-sm text-neutral-400 text-center py-20">入札が見つかりませんでした</p>
      </DashboardShell>
    )
  }

  const toMan = (yen: number) => Math.round(yen / 10000)

  return (
    <DashboardShell
      title="入札詳細"
      roleLabel="買い手"
      navItems={buyerNav}
    >
      <Link href="/buyer/bids" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        入札履歴に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 物件情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-start gap-3 mb-4">
              <Building2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold">{bid.propertyTitle}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">{bid.propertyAddress}</p>
              </div>
            </div>
            <Link
              href={`/properties/${bid.propertyId}`}
              className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:underline font-medium"
            >
              物件詳細を見る
            </Link>
          </div>

          {/* 現在の入札 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">現在の入札</h3>
            <div className="flex items-center justify-between gap-4 p-4 bg-primary-50 rounded-xl">
              <div>
                <p className="text-xs text-neutral-400 mb-1">入札金額</p>
                <p className="price text-2xl font-bold text-primary-500">{toMan(bid.amount).toLocaleString()}<span className="text-sm font-normal text-neutral-400 ml-1">万円</span></p>
              </div>
              <BidStatusBadge status={bid.status} />
            </div>
            <div className="flex gap-3 mt-2 text-xs text-neutral-400">
              <span>入札日: {bid.createdAt?.slice(0, 10)}</span>
              <span>最終更新: {bid.updatedAt?.slice(0, 10)}</span>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 操作 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">操作</h3>
            <div className="space-y-2">
              <Link
                href={`/properties/${bid.propertyId}/bid`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                入札金額を更新
              </Link>
              <button
                onClick={async () => {
                  if (!bid || !confirm('入札をキャンセルしますか？')) return
                  setCancelling(true)
                  const res = await api.patch(`/bids/${bid.id}/cancel`, {})
                  if (res.success) {
                    setBid((prev) => prev ? { ...prev, status: 'superseded' } : prev)
                  }
                  setCancelling(false)
                }}
                disabled={cancelling}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-error-500 bg-error-50 rounded-xl hover:bg-error-100 transition-colors disabled:opacity-50"
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                入札をキャンセル
              </button>
            </div>
            <p className="text-xs text-neutral-400 mt-3">
              入札期間中であれば金額の更新やキャンセルが可能です。
            </p>
          </div>

          {/* 注意事項 */}
          <div className="p-4 bg-neutral-50 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-500 space-y-1">
                <p>他の入札者の金額は公開されません。</p>
                <p>キャンセルした入札は復元できません。</p>
                <p>売主が入札者を選択すると通知でお知らせします。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
