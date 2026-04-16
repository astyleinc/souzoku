'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  AlertTriangle,
  Info,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { api } from '@/lib/api'
import { toProperty } from '@/lib/mappers'
import type { ApiProperty } from '@/lib/mappers'

export default function PropertyBidPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [property, setProperty] = useState<ReturnType<typeof toProperty> | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<ApiProperty>(`/properties/${id}`)
      if (res.success) {
        setProperty(toProperty(res.data))
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!property) return

    const amount = Number(bidAmount)
    if (!amount || amount < property.price) {
      setError(`入札額は${property.price.toLocaleString()}万円以上で入力してください`)
      return
    }

    setSubmitting(true)
    // 万円 → 円に変換して送信
    const res = await api.post('/bids', {
      propertyId: id,
      amount: amount * 10000,
      comment: comment.trim() || undefined,
    })

    if (res.success) {
      router.push(`/properties/${id}?bid=success`)
    } else {
      setError(res.error.message || '入札に失敗しました')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
        </main>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">物件が見つかりません</p>
            <Link href="/properties" className="text-sm text-primary-500 hover:underline">物件一覧に戻る</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full">
        <Link
          href={`/properties/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          物件詳細に戻る
        </Link>

        {/* 物件概要 */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
            <div>
              <h1 className="text-base font-semibold">{property.title}</h1>
              <p className="text-xs text-neutral-400 mt-0.5">{property.address}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-500">
                <span>希望価格: <span className="price font-medium text-neutral-700">{property.price.toLocaleString()}</span>万円</span>
              </div>
            </div>
          </div>
        </div>

        {/* 入札フォーム */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-semibold mb-4">入札する</h2>

          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">入札金額（万円）</label>
              <div className="relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`${property.price.toLocaleString()} 以上`}
                  min={property.price}
                  className="w-full px-4 py-3 text-lg font-medium border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors price"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">
                最低入札金額: <span className="price font-medium">{property.price.toLocaleString()}</span> 万円（希望価格）
              </p>
            </div>

            {/* 即決価格注意 */}
            <div className="flex items-start gap-2 p-3 bg-cta-50 rounded-xl">
              <Info className="w-4 h-4 text-cta-500 shrink-0 mt-0.5" />
              <p className="text-xs text-cta-700 leading-relaxed">
                即決価格以上で入札すると、売主が承認した場合に即決で成約となります。
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">入札条件コメント（任意）</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="引渡時期の希望など、取引条件があればご記入ください"
                className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
              />
            </div>

            {/* 注意事項 */}
            <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-500 space-y-1">
                <p>他の入札者の金額は公開されません（封印入札方式）。</p>
                <p>入札後も期間中であれば金額の更新が可能です。</p>
                <p>入札のキャンセルは入札期間中のみ可能です。</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              入札を確定する
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
