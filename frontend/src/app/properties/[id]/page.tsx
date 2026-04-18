'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Home,
  Clock,
  Gavel,
  AlertCircle,
  ExternalLink,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyImageGallery } from '@/components/property/PropertyImageGallery'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { UrgencyBadge } from '@/components/shared/UrgencyBadge'
import { PROPERTY_TYPE_LABEL } from '@/data/mock'
import { toProperty } from '@/lib/mappers'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [saved, setSaved] = useState(false)
  const [bidPrice, setBidPrice] = useState('')
  const [showBidTable, setShowBidTable] = useState(false)
  const [property, setProperty] = useState<ReturnType<typeof toProperty> | null>(null)
  const [relatedProperties, setRelatedProperties] = useState<ReturnType<typeof toProperty>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await api.get<Record<string, unknown>>(`/properties/${id}`)
      if (res.success) {
        const p = toProperty(res.data as Parameters<typeof toProperty>[0])
        setProperty(p)

        // 同じエリアの関連物件を取得
        const relRes = await api.get<unknown>(
          `/properties?prefecture=${encodeURIComponent(p.prefecture)}&limit=4`
        )
        if (relRes.success) {
          setRelatedProperties(
            toItems<Parameters<typeof toProperty>[0]>(relRes.data)
              .map(toProperty)
              .filter((rp) => rp.id !== p.id && (rp.status === 'bidding' || rp.status === 'published'))
              .slice(0, 3)
          )
        }
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-neutral-50 min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" variant="inline" />
        </main>
      </>
    )
  }

  if (!property) {
    return (
      <>
        <Header />
        <main className="bg-neutral-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">物件が見つかりません</p>
            <Link href="/properties" className="text-sm text-primary-500 hover:underline">物件一覧に戻る</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isBidding = property.status === 'bidding'

  return (
    <>
      <Header />

      <main className="bg-neutral-50 min-h-screen pb-20 lg:pb-0">
        {/* パンくず */}
        <div className="bg-white border-b border-neutral-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              物件一覧に戻る
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* メインカード */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {/* 画像 */}
            <div className="relative">
              {property.images.length > 0 ? (
                <PropertyImageGallery images={property.images} title={property.title} />
              ) : (
                <div className="aspect-[16/9] sm:aspect-[2/1] bg-neutral-100 flex items-center justify-center">
                  <div className="text-center">
                    <Home className="w-16 h-16 text-neutral-300 mx-auto" />
                    <p className="text-sm text-neutral-400 mt-2">物件写真</p>
                  </div>
                </div>
              )}
              {/* アクションボタン */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={() => {
                    const next = !saved
                    setSaved(next)
                    if (next) {
                      api.post(`/users/me/favorites/${id}`)
                    } else {
                      api.delete(`/users/me/favorites/${id}`)
                    }
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    saved ? 'bg-white text-error-500' : 'bg-black/20 text-white hover:bg-black/40'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={async () => {
                    const url = window.location.href
                    if (navigator.share) {
                      await navigator.share({ title: property.title, url })
                    } else {
                      await navigator.clipboard.writeText(url)
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-black/20 text-white hover:bg-black/40 flex items-center justify-center transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              {/* ステータス */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <StatusBadge status={property.status} />
                <UrgencyBadge urgency={property.urgency} />
              </div>
            </div>

            <div className="p-5 sm:p-6 lg:p-8">
              {/* 価格 + タイトル */}
              <div className="mb-6">
                <p className="price text-3xl text-foreground">
                  {property.price.toLocaleString()}
                  <span className="text-sm font-normal text-neutral-400 ml-1">万円</span>
                </p>
                <h1 className="text-lg font-bold text-foreground mt-1">{property.title}</h1>
                <p className="flex items-center gap-1 text-sm text-neutral-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {property.address}
                </p>
              </div>

              {/* スペック */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 rounded-xl mb-6">
                <div>
                  <p className="text-xs text-neutral-400">種別</p>
                  <p className="text-sm font-medium mt-0.5">{PROPERTY_TYPE_LABEL[property.type]}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">土地面積</p>
                  <p className="text-sm font-medium mt-0.5">{property.area}㎡</p>
                </div>
                {property.yearBuilt && (
                  <div>
                    <p className="text-xs text-neutral-400">築年数</p>
                    <p className="text-sm font-medium mt-0.5">
                      {new Date().getFullYear() - property.yearBuilt}年（{property.yearBuilt}年築）
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-neutral-400">登記状況</p>
                  <p className="text-sm font-medium mt-0.5">{property.registrationStatus}</p>
                </div>
              </div>

              {/* 説明 */}
              {property.description && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold mb-2">物件説明</h2>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}

              {/* 地図 */}
              <div>
                <h2 className="text-sm font-semibold mb-2">所在地</h2>
                <div className="aspect-[2/1] rounded-xl overflow-hidden relative bg-neutral-100 flex items-center justify-center">
                  <p className="text-sm text-neutral-400">{property.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-600 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                  >
                    Google Mapで見る
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 入札セクション */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* デスクトップ: 入札フォーム */}
            <div className="hidden lg:block lg:col-span-2 lg:order-2">
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <Gavel className="w-5 h-5 text-cta-500" />
                  <h2 className="text-base font-semibold">入札する</h2>
                </div>

                {isBidding ? (
                  <>
                    <div className="mb-4 p-3 bg-cta-50 rounded-xl">
                      <p className="text-xs text-cta-700">
                        最低入札価格: <span className="font-semibold">{property.price.toLocaleString()}万円</span>
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs text-neutral-500 mb-1.5">入札価格</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={bidPrice}
                          onChange={(e) => setBidPrice(e.target.value)}
                          placeholder={property.price.toString()}
                          min={property.price}
                          className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
                        />
                        <span className="text-sm text-neutral-400 shrink-0">万円</span>
                      </div>
                    </div>

                    <Link
                      href={`/properties/${property.id}/bid`}
                      className="block w-full py-3 bg-cta-500 text-white font-medium rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all text-center"
                    >
                      入札する
                    </Link>

                    <div className="mt-4 flex items-start gap-2 text-xs text-neutral-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>入札は購入意思の表明です。成約後のキャンセルには違約金が発生する場合があります。</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-neutral-400">この物件はまだ入札を受け付けていません。</p>
                )}

                <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">入札数</span>
                    <span className="font-medium">{property.bidCount}件</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 入札一覧（折りたたみ） */}
            <div className="lg:col-span-3 lg:order-1">
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <button
                  onClick={() => setShowBidTable(!showBidTable)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">入札一覧</h2>
                  </div>
                  {showBidTable ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {showBidTable && (
                  <div className="px-5 pb-5">
                    <p className="text-xs text-neutral-400 p-2 bg-info-50 rounded-lg">
                      入札内容は売主・紹介士業・提携業者・運営のみ閲覧可能です（sealed bid）
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 関連物件 */}
          {relatedProperties.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-semibold text-foreground mb-4">同じエリアの物件</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* モバイル: スティッキー入札CTA */}
      {isBidding && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="price text-lg text-foreground">
                {property.price.toLocaleString()}
                <span className="text-xs font-normal text-neutral-400 ml-1">万円〜</span>
              </p>
              <p className="text-xs text-neutral-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {property.bidCount}件入札中
              </p>
            </div>
            <Link
              href={`/properties/${property.id}/bid`}
              className="shrink-0 px-6 py-3 bg-cta-500 text-white text-sm font-medium rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all"
            >
              入札する
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
