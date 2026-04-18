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
import type { Urgency } from '@/data/mock'
import { API_TIMEOUT_QUICK_MS } from '@shared/constants'

export const metadata: Metadata = {
  title: '物件一覧｜Ouver',
  description: '相続不動産の物件一覧。入札方式で適正価格での売却・購入が可能です。エリア・価格帯・物件種別で絞り込めます。',
  openGraph: {
    title: '物件一覧｜Ouver',
    description: '相続不動産の物件一覧。入札方式で適正価格での売却・購入が可能です。',
  },
}

const API_BASE = process.env.API_URL ?? (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8787')

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
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(API_TIMEOUT_QUICK_MS) })
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

  const allProperties = apiResult?.items?.map(toProperty) ?? []
  const totalCount = apiResult?.total ?? allProperties.length
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  let results = allProperties.filter(
    (p) => p.status === 'published' || p.status === 'bidding'
  )

  if (params.urgency) {
    const urgencies = params.urgency.split(',') as Urgency[]
    results = results.filter((p) => urgencies.includes(p.urgency))
  }

  const activeFilterCount = countActiveFilters(params)
  const biddingCount = allProperties.filter((p) => p.status === 'bidding').length

  return (
    <div className="bg-warm min-h-screen">
      <Header />

      <main>
        {/* ページヘッダー（halftoneアクセント付き） */}
        <section className="relative overflow-hidden border-b border-warm-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 halftone-br opacity-80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 section-grain opacity-50"
          />
          <div className="relative max-w-[1260px] mx-auto px-5 md:px-9 py-9">
            <p className="text-[10px] font-bold text-sage-deep tracking-[0.12em] uppercase mb-1.5">
              Properties
            </p>
            <h1 className="text-[24px] md:text-[28px] font-bold text-bark tracking-[-0.02em] leading-[1.3]">
              物件を探す
            </h1>
            <p className="text-[13px] text-bark-3 mt-1.5">
              東京都・神奈川県の相続不動産
              <span className="text-bark-4 ml-2">
                — 入札方式で市場価格をつける
              </span>
            </p>
          </div>
        </section>

        <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-8">
          {/* モバイル: フィルター + ソートバー */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <Suspense>
              <MobileFilterButton activeCount={activeFilterCount} />
            </Suspense>
            <div className="relative flex-1">
              <Suspense>
                <SortSelect />
              </Suspense>
              <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-bark-4 pointer-events-none" />
            </div>
          </div>

          <Suspense>
            <PropertyFilterTags />
          </Suspense>

          <div className="flex gap-8">
            {/* デスクトップサイドバー */}
            <aside className="hidden lg:block w-64 shrink-0">
              <Suspense>
                <PropertyFilterPanel variant="sidebar" biddingCount={biddingCount} />
              </Suspense>
            </aside>

            <div className="flex-1 min-w-0">
              {/* デスクトップ: 件数 + ソート */}
              <div className="hidden lg:flex items-center justify-between mb-5">
                <p className="text-[13px] text-bark-3 flex items-center gap-2">
                  <span className="font-mono text-[13px] text-bark-2 bg-card px-2.5 py-0.5 rounded-lg border border-warm-2">
                    {results.length}
                  </span>
                  件の物件
                </p>
                <div className="relative">
                  <Suspense>
                    <SortSelect />
                  </Suspense>
                  <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-bark-4 pointer-events-none" />
                </div>
              </div>

              <p className="lg:hidden text-xs text-bark-4 mb-3">
                {results.length}件の物件が見つかりました
              </p>

              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[18px]">
                    {results.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <nav className="flex items-center justify-center gap-1.5 mt-10">
                      {currentPage > 1 && (
                        <Link
                          href={buildPageUrl(params, currentPage - 1)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-[13px] text-bark-3 hover:bg-sage-xlight hover:text-sage-deep rounded-xl transition-colors"
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
                              {showEllipsis && <span className="px-1 text-bark-4">...</span>}
                              <Link
                                href={buildPageUrl(params, p)}
                                className={`min-w-[36px] h-9 flex items-center justify-center text-[13px] rounded-xl transition-colors ${
                                  p === currentPage
                                    ? 'bg-sage-deep text-white font-medium'
                                    : 'text-bark-3 hover:bg-sage-xlight hover:text-sage-deep'
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
                          className="inline-flex items-center gap-1 px-3 py-2 text-[13px] text-bark-3 hover:bg-sage-xlight hover:text-sage-deep rounded-xl transition-colors"
                        >
                          次へ
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </nav>
                  )}
                </>
              ) : (
                <div className="bg-card rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-10 text-center">
                  <div className="w-16 h-16 bg-sage-xlight rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-sage" />
                  </div>
                  <p className="text-[15px] font-bold text-bark mb-2">
                    条件に合う物件が見つかりませんでした
                  </p>
                  <p className="text-[13px] text-bark-3 mb-6 max-w-sm mx-auto leading-[1.7]">
                    検索条件を変更するか、絞り込みを少なくしてお試しください。
                  </p>
                  <Link
                    href="/properties"
                    className="inline-flex px-4 py-2 text-[13px] font-medium text-sage-deep bg-sage-xlight rounded-xl hover:bg-sage-light transition-colors"
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
    </div>
  )
}
