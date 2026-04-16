'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Home,
  Ruler,
  Calendar,
  Clock,
  Gavel,
  AlertCircle,
  FileText,
  ExternalLink,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/property/PropertyCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { UrgencyBadge } from '@/components/shared/UrgencyBadge'
import { mockProperties, PROPERTY_TYPE_LABEL } from '@/data/mock'

const mockBids = [
  { id: 1, amount: 3800, date: '2026-04-15 14:30', status: '有効' },
  { id: 2, amount: 3650, date: '2026-04-14 09:15', status: '有効' },
  { id: 3, amount: 3600, date: '2026-04-12 18:42', status: '有効' },
  { id: 4, amount: 3550, date: '2026-04-11 11:20', status: '更新済み' },
  { id: 5, amount: 3500, date: '2026-04-10 16:05', status: '有効' },
]

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [saved, setSaved] = useState(false)
  const [bidPrice, setBidPrice] = useState('')
  const [showBidTable, setShowBidTable] = useState(false)

  // パラメータはクライアントコンポーネントなので同期的に取得できないが、
  // 実際にはuseParamsを使う。モックではデフォルトを使用
  const property = mockProperties[0]
  const relatedProperties = mockProperties
    .filter((p) => p.id !== property.id && p.prefecture === property.prefecture && (p.status === 'bidding' || p.status === 'published'))
    .slice(0, 3)

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
            <div className="aspect-[16/9] sm:aspect-[2/1] bg-neutral-100 flex items-center justify-center relative">
              <div className="text-center">
                <Home className="w-16 h-16 text-neutral-300 mx-auto" />
                <p className="text-sm text-neutral-400 mt-2">物件写真</p>
              </div>
              {/* アクションボタン */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    saved ? 'bg-white text-error-500' : 'bg-black/20 text-white hover:bg-black/40'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
                <button className="w-9 h-9 rounded-full bg-black/20 text-white hover:bg-black/40 flex items-center justify-center transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              {/* ステータス */}
              <div className="absolute top-4 left-4 flex gap-2">
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

              {/* スペック（4つに絞る） */}
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
              <div className="mb-5">
                <h2 className="text-sm font-semibold mb-2">物件説明</h2>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2">売却理由</h2>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {property.sellerReason}
                </p>
              </div>

              {/* 地図 */}
              <div>
                <h2 className="text-sm font-semibold mb-2">所在地</h2>
                <div className="aspect-[2/1] rounded-xl overflow-hidden relative">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.lng - 0.008},${property.lat - 0.005},${property.lng + 0.008},${property.lat + 0.005}&layer=mapnik&marker=${property.lat},${property.lng}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    title="物件所在地"
                  />
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
            {/* デスクトップ: 入札フォーム（右サイド固定） */}
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

                    <button className="w-full py-3 bg-cta-500 text-white font-medium rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all">
                      入札する
                    </button>

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
                    <span className="text-neutral-400">入札期間</span>
                    <span className="font-medium">2026/04/10 〜 04/24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">残り</span>
                    <span className="font-medium text-warning-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      8日
                    </span>
                  </div>
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
                    <span className="text-xs text-neutral-400">{mockBids.length}件</span>
                  </div>
                  {showBidTable ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {showBidTable && (
                  <div className="px-5 pb-5">
                    <p className="text-xs text-neutral-400 mb-3 p-2 bg-info-50 rounded-lg">
                      入札内容は売主・紹介士業・提携業者・運営のみ閲覧可能です（sealed bid）
                    </p>
                    {/* モバイル: カード表示 */}
                    <div className="sm:hidden space-y-2">
                      {mockBids.map((bid, i) => (
                        <div key={bid.id} className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
                          <div>
                            <p className="price text-base">{bid.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
                            <p className="text-xs text-neutral-400 mt-0.5">{bid.date}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            bid.status === '有効'
                              ? 'bg-success-50 text-success-700'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {bid.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* デスクトップ: テーブル */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-100">
                            <th className="text-left py-2 px-3 text-xs text-neutral-400 font-medium">#</th>
                            <th className="text-right py-2 px-3 text-xs text-neutral-400 font-medium">入札価格</th>
                            <th className="text-left py-2 px-3 text-xs text-neutral-400 font-medium">入札日時</th>
                            <th className="text-left py-2 px-3 text-xs text-neutral-400 font-medium">状態</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockBids.map((bid, i) => (
                            <tr key={bid.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50">
                              <td className="py-2.5 px-3 text-neutral-400">{i + 1}</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className="price text-base">{bid.amount.toLocaleString()}</span>
                                <span className="text-xs text-neutral-400 ml-1">万円</span>
                              </td>
                              <td className="py-2.5 px-3 text-neutral-400">{bid.date}</td>
                              <td className="py-2.5 px-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  bid.status === '有効'
                                    ? 'bg-success-50 text-success-700'
                                    : 'bg-neutral-100 text-neutral-500'
                                }`}>
                                  {bid.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                残り8日 / {property.bidCount}件入札中
              </p>
            </div>
            <button className="shrink-0 px-6 py-3 bg-cta-500 text-white text-sm font-medium rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all">
              入札する
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
