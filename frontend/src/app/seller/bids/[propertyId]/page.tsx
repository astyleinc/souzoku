'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  AlertTriangle,
  Trophy,
  Building2,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Bid = {
  id: string
  propertyId: string
  buyerId: string
  bidderName: string
  bidderType: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

type PropertyInfo = {
  id: string
  title: string
  address: string
  askingPrice: number
  status: string
}

export default function SellerBidsByPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const [bids, setBids] = useState<Bid[]>([])
  const [property, setProperty] = useState<PropertyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [selecting, setSelecting] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [reasonDetail, setReasonDetail] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [declining, setDeclining] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [bidRes, propRes] = await Promise.all([
        api.get<unknown>(`/bids/property/${params.propertyId}`),
        api.get<PropertyInfo>(`/properties/${params.propertyId}`),
      ])
      if (bidRes.success) {
        const sorted = toItems<Bid>(bidRes.data)
          .sort((a, b) => b.amount - a.amount)
        setBids(sorted)
      }
      if (propRes.success) setProperty(propRes.data)
      setLoading(false)
    }
    load()
  }, [params.propertyId])

  const highestAmount = bids.length > 0 ? bids[0].amount : 0
  const toMan = (yen: number) => Math.round(yen / 10000)

  const handleSelect = async (bidId: string) => {
    const bid = bids.find((b) => b.id === bidId)
    if (!bid) return

    const isHighest = bid.amount === highestAmount

    if (!isHighest && !reason) {
      setSelecting(bidId)
      return
    }

    setActionError(null)
    setSelecting(bidId)

    const res = await api.post(`/bids/property/${params.propertyId}/select`, {
      bidId,
      selectionReason: isHighest ? undefined : reason,
      selectionReasonDetail: isHighest ? undefined : reasonDetail || undefined,
    })

    if (res.success) {
      router.push('/seller/bids')
    } else {
      setActionError(res.error?.message ?? '選択に失敗しました')
      setSelecting(null)
    }
  }

  const handleDeclineAll = async () => {
    if (!confirm('すべての入札を辞退しますか？この操作は取り消せません。')) return

    setDeclining(true)
    setActionError(null)

    const res = await api.patch(`/properties/${params.propertyId}`, {
      status: 'failed',
    })

    if (res.success) {
      router.push('/seller/bids')
    } else {
      setActionError(res.error?.message ?? '辞退処理に失敗しました')
      setDeclining(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell title="入札一覧" roleLabel="売主" navItems={sellerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="入札一覧"
      roleLabel="売主"
      navItems={sellerNav}
    >
      <Link href="/seller/bids" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        入札一覧に戻る
      </Link>

      {actionError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {actionError}
        </div>
      )}

      {/* 物件情報 */}
      {property && (
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-semibold">{property.title}</h2>
              <p className="text-xs text-neutral-400 mt-0.5">{property.address}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-500">
                <span>希望価格: <span className="price font-medium text-neutral-700">{toMan(property.askingPrice).toLocaleString()}</span>万円</span>
                <span>入札件数: <span className="font-medium text-neutral-700">{bids.length}</span>件</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {property.status === 'bid_ended' ? '入札終了' : '入札受付中'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {bids.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <p className="text-sm text-neutral-400">入札はまだありません</p>
        </div>
      ) : (
        <>
          {/* 入札者リスト */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">入札者を選択してください</h3>
            <p className="text-xs text-neutral-400 mb-4">
              最高額の入札者を選択するのが原則です。他の入札者を選択する場合は理由の記入が必要です。
            </p>

            {bids.map((bid) => {
              const bidMan = toMan(bid.amount)
              const highMan = toMan(highestAmount)
              const isHighest = bid.amount === highestAmount
              const isSelecting = selecting === bid.id
              return (
                <div
                  key={bid.id}
                  className={`bg-white rounded-2xl shadow-card p-5 border-2 transition-colors ${isHighest ? 'border-cta-200' : 'border-transparent'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isHighest && <Trophy className="w-4 h-4 text-cta-500" />}
                        <p className="text-sm font-semibold">{bid.bidderName}</p>
                        {bid.bidderType && <span className="text-xs text-neutral-400">({bid.bidderType})</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-neutral-400 mt-1">
                        <span>入札日: {formatDate(bid.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="price text-lg font-semibold">{bidMan.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></p>
                      {isHighest ? (
                        <span className="text-xs text-cta-500 font-medium">最高額</span>
                      ) : (
                        <span className="text-xs text-neutral-400">
                          差額 -{(highMan - bidMan).toLocaleString()}万円
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 最高額以外を選択する場合の理由入力 */}
                  {!isHighest && isSelecting && (
                    <div className="mt-3 p-3 bg-warning-50 rounded-xl space-y-3">
                      <p className="text-xs text-warning-700 font-medium">最高額以外の選択理由を入力してください</p>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-warning-200 rounded-lg bg-white"
                      >
                        <option value="">理由を選択</option>
                        <option value="credit_concern">信用面の懸念</option>
                        <option value="condition_mismatch">条件の不一致</option>
                        <option value="other">その他</option>
                      </select>
                      {reason === 'other' && (
                        <textarea
                          value={reasonDetail}
                          onChange={(e) => setReasonDetail(e.target.value)}
                          placeholder="詳細を入力してください"
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-warning-200 rounded-lg bg-white resize-none"
                        />
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-3">
                    <button
                      onClick={() => handleSelect(bid.id)}
                      disabled={!isHighest && isSelecting && !reason}
                      className="px-4 py-2 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors disabled:opacity-50"
                    >
                      この入札者を選択
                    </button>
                    {!isHighest && !isSelecting && (
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
            <button
              onClick={handleDeclineAll}
              disabled={declining}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-error-500 bg-error-50 rounded-xl hover:bg-error-100 transition-colors disabled:opacity-50"
            >
              {declining && <Loader2 className="w-4 h-4 animate-spin" />}
              すべての入札を辞退する
            </button>
            <p className="text-xs text-neutral-400 mt-2">
              辞退すると物件ステータスは「不成立」となり、再出品または通常掲載への切り替えが選べます。
            </p>
          </div>
        </>
      )}
    </DashboardShell>
  )
}
