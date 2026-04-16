'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  SlidersHorizontal,
  X,
  Search,
  ArrowUpDown,
  Flame,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/property/PropertyCard'
import {
  mockProperties,
  PROPERTY_TYPE_LABEL,
  URGENCY_LABEL,
  type PropertyType,
  type Urgency,
} from '@/data/mock'

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'bids' | 'area_desc'

const SORT_LABELS: Record<SortKey, string> = {
  newest: '新着順',
  price_asc: '価格が安い順',
  price_desc: '価格が高い順',
  bids: '入札が多い順',
  area_desc: '面積が広い順',
}

const PREFECTURE_OPTIONS = ['東京都', '神奈川県'] as const

// 買い手に見せる物件（公開 or 入札受付中のみ）
const visibleProperties = mockProperties.filter(
  (p) => p.status === 'published' || p.status === 'bidding'
)

export default function PropertiesPage() {
  // フィルター状態
  const [keyword, setKeyword] = useState('')
  const [prefecture, setPrefecture] = useState('')
  const [types, setTypes] = useState<PropertyType[]>([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [urgencies, setUrgencies] = useState<Urgency[]>([])
  const [biddingOnly, setBiddingOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('newest')

  // モバイルフィルターパネル
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleType = (t: PropertyType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))

  const toggleUrgency = (u: Urgency) =>
    setUrgencies((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]))

  // アクティブフィルター数
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (keyword) count++
    if (prefecture) count++
    if (types.length) count++
    if (priceMin || priceMax) count++
    if (urgencies.length) count++
    if (biddingOnly) count++
    return count
  }, [keyword, prefecture, types, priceMin, priceMax, urgencies, biddingOnly])

  const resetFilters = useCallback(() => {
    setKeyword('')
    setPrefecture('')
    setTypes([])
    setPriceMin('')
    setPriceMax('')
    setUrgencies([])
    setBiddingOnly(false)
  }, [])

  // フィルタリング + ソート
  const results = useMemo(() => {
    let filtered = visibleProperties.filter((p) => {
      if (keyword) {
        const q = keyword.toLowerCase()
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.address.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        ) return false
      }
      if (prefecture && p.prefecture !== prefecture) return false
      if (types.length && !types.includes(p.type)) return false
      if (priceMin && p.price < Number(priceMin)) return false
      if (priceMax && p.price > Number(priceMax)) return false
      if (urgencies.length && !urgencies.includes(p.urgency)) return false
      if (biddingOnly && p.status !== 'bidding') return false
      return true
    })

    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        break
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'bids':
        filtered.sort((a, b) => b.bidCount - a.bidCount)
        break
      case 'area_desc':
        filtered.sort((a, b) => b.area - a.area)
        break
    }
    return filtered
  }, [keyword, prefecture, types, priceMin, priceMax, urgencies, biddingOnly, sort])

  // アクティブフィルターのタグ一覧
  const activeFilterTags = useMemo(() => {
    const tags: { label: string; onRemove: () => void }[] = []
    if (keyword) tags.push({ label: `「${keyword}」`, onRemove: () => setKeyword('') })
    if (prefecture) tags.push({ label: prefecture, onRemove: () => setPrefecture('') })
    types.forEach((t) =>
      tags.push({ label: PROPERTY_TYPE_LABEL[t], onRemove: () => toggleType(t) })
    )
    if (priceMin || priceMax) {
      const label = priceMin && priceMax
        ? `${priceMin}〜${priceMax}万円`
        : priceMin ? `${priceMin}万円〜` : `〜${priceMax}万円`
      tags.push({ label, onRemove: () => { setPriceMin(''); setPriceMax('') } })
    }
    urgencies.forEach((u) =>
      tags.push({ label: URGENCY_LABEL[u], onRemove: () => toggleUrgency(u) })
    )
    if (biddingOnly) tags.push({ label: '入札受付中のみ', onRemove: () => setBiddingOnly(false) })
    return tags
  }, [keyword, prefecture, types, priceMin, priceMax, urgencies, biddingOnly])

  // フィルターUI（デスクトップサイドバー / モバイルボトムシート共通）
  const filterContent = (
    <div className="space-y-6">
      {/* キーワード */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1.5">キーワード</label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="エリア・沿線・特徴"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
          />
        </div>
      </div>

      {/* エリア */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1.5">エリア</label>
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
        >
          <option value="">すべてのエリア</option>
          {PREFECTURE_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* 物件種別 */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-2">物件種別</label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(PROPERTY_TYPE_LABEL) as [PropertyType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleType(key)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                types.includes(key)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 価格帯 */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1.5">価格帯（万円）</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="下限"
            className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
          />
          <span className="text-neutral-300 shrink-0">〜</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="上限"
            className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
          />
        </div>
      </div>

      {/* 緊急度 */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-2">売却の緊急度</label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(URGENCY_LABEL) as [Urgency, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleUrgency(key)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                urgencies.includes(key)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 入札中のみ */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={biddingOnly}
          onChange={(e) => setBiddingOnly(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
        />
        <span className="text-sm text-neutral-600">入札受付中のみ表示</span>
        {visibleProperties.filter((p) => p.status === 'bidding').length > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-cta-600">
            <Flame className="w-3 h-3" />
            {visibleProperties.filter((p) => p.status === 'bidding').length}件
          </span>
        )}
      </label>

      {/* リセット */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          条件をリセット
        </button>
      )}
    </div>
  )

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
            <button
              onClick={() => setFilterOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm border rounded-xl transition-colors ${
                activeFilterCount > 0
                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                  : 'bg-white text-neutral-600 border-neutral-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              絞り込み
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative flex-1">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full appearance-none pl-8 pr-4 py-2 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
              >
                {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* アクティブフィルタータグ（モバイル + デスクトップ） */}
          {activeFilterTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeFilterTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={tag.onRemove}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  {tag.label}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                onClick={resetFilters}
                className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                すべて解除
              </button>
            </div>
          )}

          <div className="flex gap-8">
            {/* デスクトップ: サイドバーフィルター */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl shadow-card p-5 sticky top-20">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
                    <h2 className="text-sm font-semibold">絞り込み</h2>
                  </div>
                  {activeFilterCount > 0 && (
                    <span className="text-xs text-primary-500">{activeFilterCount}件の条件</span>
                  )}
                </div>
                {filterContent}
              </div>
            </aside>

            {/* 物件リスト */}
            <div className="flex-1 min-w-0">
              {/* デスクトップ: 件数 + ソート */}
              <div className="hidden lg:flex items-center justify-between mb-5">
                <p className="text-sm text-neutral-500">
                  <span className="font-semibold text-foreground">{results.length}</span>件の物件
                </p>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none pl-8 pr-8 py-2 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors cursor-pointer"
                  >
                    {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
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
                /* ゼロ件状態 */
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
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-sm font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                    >
                      条件をリセット
                    </button>
                    {biddingOnly && (
                      <button
                        onClick={() => setBiddingOnly(false)}
                        className="px-4 py-2 text-sm text-neutral-500 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                      >
                        公開中の物件も表示
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* モバイル: ボトムシートフィルター */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* オーバーレイ */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          {/* パネル */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
              <h2 className="text-base font-semibold">絞り込み条件</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* フィルター内容 */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {filterContent}
            </div>
            {/* フッター */}
            <div className="px-5 py-4 border-t border-neutral-100 flex gap-3 shrink-0">
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  リセット
                </button>
              )}
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all"
              >
                {results.length}件を表示
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
