import { Suspense } from 'react'
import Link from 'next/link'
import { Search, ArrowUpDown } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/property/PropertyCard'
import {
  PropertyFilterPanel,
  PropertyFilterTags,
  MobileFilterButton,
  SortSelect,
} from '@/components/property/PropertyFilters'
import {
  mockProperties,
  type PropertyType,
  type Urgency,
} from '@/data/mock'

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'bids' | 'area_desc'

/**
 * サーバー側でフィルタリング・ソートを行う
 * 将来的にはDB検索に置き換える
 */
const searchProperties = (params: Record<string, string | undefined>) => {
  const { q, prefecture, type, price_min, price_max, urgency, bidding_only, sort } = params

  // 買い手に見せる物件のみ
  let results = mockProperties.filter(
    (p) => p.status === 'published' || p.status === 'bidding'
  )

  // キーワード
  if (q) {
    const keyword = q.toLowerCase()
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.address.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword)
    )
  }

  // エリア
  if (prefecture) {
    results = results.filter((p) => p.prefecture === prefecture)
  }

  // 物件種別
  if (type) {
    const types = type.split(',') as PropertyType[]
    results = results.filter((p) => types.includes(p.type))
  }

  // 価格帯
  if (price_min) {
    results = results.filter((p) => p.price >= Number(price_min))
  }
  if (price_max) {
    results = results.filter((p) => p.price <= Number(price_max))
  }

  // 緊急度
  if (urgency) {
    const urgencies = urgency.split(',') as Urgency[]
    results = results.filter((p) => urgencies.includes(p.urgency))
  }

  // 入札中のみ
  if (bidding_only === '1') {
    results = results.filter((p) => p.status === 'bidding')
  }

  // ソート
  const sortKey = (sort ?? 'newest') as SortKey
  switch (sortKey) {
    case 'newest':
      results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      break
    case 'price_asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'bids':
      results.sort((a, b) => b.bidCount - a.bidCount)
      break
    case 'area_desc':
      results.sort((a, b) => b.area - a.area)
      break
  }

  return results
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
  const results = searchProperties(params)
  const activeFilterCount = countActiveFilters(params)
  const biddingCount = mockProperties.filter((p) => p.status === 'bidding').length

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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
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
