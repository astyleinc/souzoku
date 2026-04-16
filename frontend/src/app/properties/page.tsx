import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/property/PropertyCard'
import {
  PropertyFilterPanel,
  PropertyFilterTags,
  MobileFilterButton,
  SortSelect,
} from '@/components/property/PropertyFilters'
import { toProperty, type ApiProperty } from '@/lib/mappers'
import type { Property, Urgency } from '@/data/mock'

export const metadata: Metadata = {
  title: '物件一覧｜Ouver',
  description: '相続不動産の物件一覧。入札方式で適正価格での売却・購入が可能です。エリア・価格帯・物件種別で絞り込めます。',
  openGraph: {
    title: '物件一覧｜Ouver',
    description: '相続不動産の物件一覧。入札方式で適正価格での売却・購入が可能です。',
  },
}

const API_BASE = process.env.API_URL ?? (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8787')

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'bids' | 'area_desc'

const ITEMS_PER_PAGE = 12

const fetchProperties = async (params: Record<string, string | undefined>) => {
  const query = new URLSearchParams()
  const page = Math.max(1, Number(params.page) || 1)

  if (params.q) query.set('keyword', params.q)
  if (params.prefecture) query.set('prefecture', params.prefecture)
  if (params.type) query.set('propertyType', params.type)
  if (params.price_min) query.set('minPrice', String(Number(params.price_min) * 10000))
  if (params.price_max) query.set('maxPrice', String(Number(params.price_max) * 10000))
  if (params.bidding_only === '1') query.set('biddingOnly', 'true')
  if (params.sort) query.set('sort', params.sort)
  query.set('page', String(page))
  query.set('limit', String(ITEMS_PER_PAGE))

  const url = `${API_BASE}/api/properties?${query.toString()}`

  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(3000) })
    if (!res.ok) return null
    const json = await res.json() as { success: boolean; data?: { items: ApiProperty[]; total: number } }
    if (json.success && json.data) {
      return json.data
    }
    return null
  } catch {
    return null
  }
}

const buildPageUrl = (params: Record<string, string | undefined>, page: number) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== 'page') query.set(key, value)
  }
  if (page > 1) query.set('page', String(page))
  const qs = query.toString()
  return `/properties${qs ? `?${qs}` : ''}`
}

const countActiveFilters = (params: Record<string, string | undefined>) => {
  let count = 0
  if (params.q) count++
  if (params.prefecture) count++
  if (params.type) count++
  if (params.price_min || params.price_max) count++
  if (params.urgency) count++
  if (params.bidding_only === '1') count++
  return count
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const currentPage = Math.max(1, Number(params.page) || 1)
  const apiResult = await fetchProperties(params)

  // APIから取得してフロントエンド型に変換
  const allProperties = apiResult?.items?.map(toProperty) ?? []
  const totalCount = apiResult?.total ?? allProperties.length
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // クライアントサイドフィルタリング（APIが未対応のフィルター）
  let results = allProperties.filter(
    (p) => p.status === 'published' || p.status === 'bidding'
  )

  // 緊急度フィルター（API側で未対応のためクライアントで処理）
  if (params.urgency) {
    const urgencies = params.urgency.split(',') as Urgency[]
    results = results.filter((p) => urgencies.includes(p.urgency))
  }

  const activeFilterCount = countActiveFilters(params)
  const biddingCount = allProperties.filter((p) => p.status === 'bidding').length

  return (
    <>
      <Header />

      <main className="bg-neutral-50 min-h-screen">
        {/* ページヘッダー */}
        <div className="bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <h1 className="text-xl font-bold text-foreground">物件を探す</h1>
            <p className="text-sm text-neutral-400 mt-0.5">
              東京都・神奈川県の相続不動産
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* モバイル: フィルター + ソートバー */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <Suspense>
              <MobileFilterButton activeCount={activeFilterCount} />
            </Suspense>
            <div className="relative flex-1">
              <Suspense>
                <SortSelect />
              </Suspense>
              <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* アクティブフィルタータグ */}
          <Suspense>
            <PropertyFilterTags biddingCount={biddingCount} />
          </Suspense>

          <div className="flex gap-8">
            {/* デスクトップ: サイドバーフィルター */}
            <aside className="hidden lg:block w-64 shrink-0">
              <Suspense>
                <PropertyFilterPanel variant="sidebar" biddingCount={biddingCount} />
              </Suspense>
            </aside>

            {/* 物件リスト */}
            <div className="flex-1 min-w-0">
              {/* デスクトップ: 件数 + ソート */}
              <div className="hidden lg:flex items-center justify-between mb-5">
                <p className="text-sm text-neutral-500">
                  <span className="font-semibold text-foreground">{results.length}</span>件の物件
                </p>
                <div className="relative">
                  <Suspense>
                    <SortSelect />
                  </Suspense>
                  <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* モバイル: 件数 */}
              <p className="lg:hidden text-xs text-neutral-400 mb-3">
                {results.length}件の物件が見つかりました
              </p>

              {/* 結果 */}
              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {results.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* ページネーション */}
                  {totalPages > 1 && (
                    <nav className="flex items-center justify-center gap-2 mt-8">
                      {currentPage > 1 && (
                        <Link
                          href={buildPageUrl(params, currentPage - 1)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          前へ
                        </Link>
                      )}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1]
                          const showEllipsis = prev !== undefined && p - prev > 1
                          return (
                            <span key={p} className="contents">
                              {showEllipsis && <span className="px-1 text-neutral-300">...</span>}
                              <Link
                                href={buildPageUrl(params, p)}
                                className={`min-w-[36px] h-9 flex items-center justify-center text-sm rounded-xl transition-colors ${
                                  p === currentPage
                                    ? 'bg-primary-500 text-white font-medium'
                                    : 'text-neutral-500 hover:bg-neutral-100'
                                }`}
                              >
                                {p}
                              </Link>
                            </span>
                          )
                        })}
                      {currentPage < totalPages && (
                        <Link
                          href={buildPageUrl(params, currentPage + 1)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors"
                        >
                          次へ
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </nav>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-card p-10 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-neutral-300" />
                  </div>
                  <p className="text-base font-semibold text-foreground mb-2">
                    条件に合う物件が見つかりませんでした
                  </p>
                  <p className="text-sm text-neutral-400 mb-6 max-w-sm mx-auto">
                    検索条件を変更するか、絞り込みを少なくしてお試しください。
                  </p>
                  <Link
                    href="/properties"
                    className="inline-flex px-4 py-2 text-sm font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                  >
                    条件をリセット
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
