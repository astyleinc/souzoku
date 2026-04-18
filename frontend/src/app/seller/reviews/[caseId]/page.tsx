'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Star,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type CaseDetail = {
  id: string
  propertyTitle: string
  salePrice: number
  buyerName: string
  brokerName: string
  brokerId: string
}

export default function SellerReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({
    politeness: 0,
    expertise: 0,
    overall: 0,
  })
  const [comment, setComment] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await api.get<CaseDetail>(`/cases/${params.caseId}`)
      if (res.success) setCaseData(res.data)
      setLoading(false)
    }
    load()
  }, [params.caseId])

  const setRating = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!caseData) return

    if (ratings.politeness === 0 || ratings.expertise === 0 || ratings.overall === 0) {
      setError('すべての評価項目を選択してください')
      return
    }

    setSubmitting(true)
    setError(null)

    const res = await api.post(`/brokers/${caseData.brokerId}/evaluate`, {
      propertyId: caseData.id,
      speedRating: ratings.politeness,
      clarityRating: ratings.expertise,
      politenessRating: ratings.politeness,
      overallRating: ratings.overall,
      comment: comment || undefined,
    })

    if (res.success) {
      router.push('/seller')
    } else {
      setError(res.error?.message ?? '評価の送信に失敗しました')
    }
    setSubmitting(false)
  }

  const toMan = (yen: number) => Math.round(yen / 10000)

  if (loading) {
    return (
      <DashboardShell title="取引評価" roleLabel="売主" navItems={sellerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="取引評価"
      roleLabel="売主"
      navItems={sellerNav}
    >
      <Link href="/seller" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        ダッシュボードに戻る
      </Link>

      <div className="max-w-2xl">
        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* 案件情報 */}
        {caseData && (
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <h2 className="text-base font-semibold mb-3">対象案件</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-1">物件名</p>
                <p>{caseData.propertyTitle}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">成約額</p>
                <p className="price">{toMan(caseData.salePrice).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">買い手</p>
                <p>{caseData.buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">担当業者</p>
                <p>{caseData.brokerName}</p>
              </div>
            </div>
          </div>
        )}

        {/* 業者への評価 */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <h2 className="text-base font-semibold mb-1">仲介業者の評価</h2>
          <p className="text-xs text-neutral-400 mb-5">{caseData?.brokerName ?? '担当業者'}への評価をお願いします</p>

          <div className="space-y-6">
            {[
              { key: 'politeness', label: '対応の丁寧さ', description: '連絡の早さや説明のわかりやすさ' },
              { key: 'expertise', label: '専門知識', description: '相続不動産に関する知識や提案力' },
              { key: 'overall', label: '総合満足度', description: '取引全体を通した満足度' },
            ].map((item) => (
              <div key={item.key}>
                <p className="text-sm font-medium mb-1">{item.label}</p>
                <p className="text-xs text-neutral-400 mb-2">{item.description}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(item.key, star)}
                      className="p-0.5 transition-colors"
                    >
                      <Star className={`w-6 h-6 ${star <= ratings[item.key] ? 'text-warning-400 fill-warning-400' : 'text-neutral-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="text-sm font-medium mb-1.5">コメント</p>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="取引に関するご感想をお聞かせください（任意）"
                className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* 送信 */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/seller"
            className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            あとで評価する
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            評価を送信する
          </button>
        </div>
      </div>
    </DashboardShell>
  )
}
