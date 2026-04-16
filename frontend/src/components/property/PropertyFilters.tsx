'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  SlidersHorizontal,
  X,
  Search,
  Flame,
} from 'lucide-react'
import {
  PROPERTY_TYPE_LABEL,
  URGENCY_LABEL,
  type PropertyType,
  type Urgency,
} from '@/data/mock'

const PREFECTURE_OPTIONS = ['東京都', '神奈川県'] as const

type FilterTag = { label: string; paramKey: string; paramValue?: string }

/**
 * 現在のsearchParamsからアクティブなフィルタータグを生成
 */
const buildFilterTags = (params: URLSearchParams): FilterTag[] => {
  const tags: FilterTag[] = []
  const q = params.get('q')
  if (q) tags.push({ label: `「${q}」`, paramKey: 'q' })

  const pref = params.get('prefecture')
  if (pref) tags.push({ label: pref, paramKey: 'prefecture' })

  const types = params.get('type')
  if (types) {
    types.split(',').forEach((t) => {
      const label = PROPERTY_TYPE_LABEL[t as PropertyType]
      if (label) tags.push({ label, paramKey: 'type', paramValue: t })
    })
  }

  const priceMin = params.get('price_min')
  const priceMax = params.get('price_max')
  if (priceMin || priceMax) {
    const label = priceMin && priceMax
      ? `${priceMin}〜${priceMax}万円`
      : priceMin ? `${priceMin}万円〜` : `〜${priceMax}万円`
    tags.push({ label, paramKey: 'price' })
  }

  const urgencies = params.get('urgency')
  if (urgencies) {
    urgencies.split(',').forEach((u) => {
      const label = URGENCY_LABEL[u as Urgency]
      if (label) tags.push({ label, paramKey: 'urgency', paramValue: u })
    })
  }

  const bidding = params.get('bidding_only')
  if (bidding === '1') tags.push({ label: '入札受付中のみ', paramKey: 'bidding_only' })

  return tags
}

export const PropertyFilterTags = ({ biddingCount }: { biddingCount: number }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tags = buildFilterTags(searchParams)

  if (tags.length === 0) return null

  const removeTag = (tag: FilterTag) => {
    const params = new URLSearchParams(searchParams.toString())

    if (tag.paramKey === 'price') {
      params.delete('price_min')
      params.delete('price_max')
    } else if (tag.paramValue && (tag.paramKey === 'type' || tag.paramKey === 'urgency')) {
      const current = params.get(tag.paramKey)?.split(',') ?? []
      const updated = current.filter((v) => v !== tag.paramValue)
      if (updated.length) {
        params.set(tag.paramKey, updated.join(','))
      } else {
        params.delete(tag.paramKey)
      }
    } else {
      params.delete(tag.paramKey)
    }

    router.push(`/properties?${params.toString()}`)
  }

  const clearAll = () => {
    const params = new URLSearchParams()
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {tags.map((tag) => (
        <button
          key={`${tag.paramKey}-${tag.paramValue ?? tag.label}`}
          onClick={() => removeTag(tag)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
        >
          {tag.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        すべて解除
      </button>
    </div>
  )
}

export const PropertyFilterPanel = ({
  variant,
  biddingCount,
  onClose,
}: {
  variant: 'sidebar' | 'bottomsheet'
  biddingCount: number
  onClose?: () => void
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ローカル状態（検索ボタンを押すまでURLに反映しない）
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [prefecture, setPrefecture] = useState(searchParams.get('prefecture') ?? '')
  const [types, setTypes] = useState<PropertyType[]>(
    (searchParams.get('type')?.split(',').filter(Boolean) as PropertyType[]) ?? []
  )
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') ?? '')
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') ?? '')
  const [urgencies, setUrgencies] = useState<Urgency[]>(
    (searchParams.get('urgency')?.split(',').filter(Boolean) as Urgency[]) ?? []
  )
  const [biddingOnly, setBiddingOnly] = useState(searchParams.get('bidding_only') === '1')

  const toggleType = (t: PropertyType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))

  const toggleUrgency = (u: Urgency) =>
    setUrgencies((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]))

  const localFilterCount = [
    keyword,
    prefecture,
    types.length > 0,
    priceMin || priceMax,
    urgencies.length > 0,
    biddingOnly,
  ].filter(Boolean).length

  const applyFilters = () => {
    const params = new URLSearchParams()

    // ソートは維持
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)

    if (keyword) params.set('q', keyword)
    if (prefecture) params.set('prefecture', prefecture)
    if (types.length) params.set('type', types.join(','))
    if (priceMin) params.set('price_min', priceMin)
    if (priceMax) params.set('price_max', priceMax)
    if (urgencies.length) params.set('urgency', urgencies.join(','))
    if (biddingOnly) params.set('bidding_only', '1')

    router.push(`/properties?${params.toString()}`)
    onClose?.()
  }

  const resetLocal = () => {
    setKeyword('')
    setPrefecture('')
    setTypes([])
    setPriceMin('')
    setPriceMax('')
    setUrgencies([])
    setBiddingOnly(false)
  }

  const resetAndApply = () => {
    const params = new URLSearchParams()
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)
    router.push(`/properties?${params.toString()}`)
    onClose?.()
  }

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
              type="button"
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
              type="button"
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
        {biddingCount > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-cta-600">
            <Flame className="w-3 h-3" />
            {biddingCount}件
          </span>
        )}
      </label>
    </div>
  )

  // デスクトップサイドバー
  if (variant === 'sidebar') {
    return (
      <div className="bg-white rounded-2xl shadow-card p-5 sticky top-20">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-semibold">絞り込み</h2>
          </div>
          {localFilterCount > 0 && (
            <span className="text-xs text-primary-500">{localFilterCount}件の条件</span>
          )}
        </div>
        {filterContent}
        <div className="mt-6 space-y-2">
          <button
            onClick={applyFilters}
            className="w-full py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all"
          >
            この条件で検索
          </button>
          {localFilterCount > 0 && (
            <button
              onClick={resetAndApply}
              className="w-full text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              条件をリセット
            </button>
          )}
        </div>
      </div>
    )
  }

  // モバイルボトムシート
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
          <h2 className="text-base font-semibold">絞り込み条件</h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {filterContent}
        </div>
        <div className="px-5 py-4 border-t border-neutral-100 flex gap-3 shrink-0">
          {localFilterCount > 0 && (
            <button
              onClick={resetLocal}
              className="flex-1 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              リセット
            </button>
          )}
          <button
            onClick={applyFilters}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all"
          >
            この条件で検索
          </button>
        </div>
      </div>
    </div>
  )
}

export const MobileFilterButton = ({
  activeCount,
}: {
  activeCount: number
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm border rounded-xl transition-colors ${
          activeCount > 0
            ? 'bg-primary-50 text-primary-700 border-primary-200'
            : 'bg-white text-neutral-600 border-neutral-200'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        絞り込み
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>
      {open && (
        <PropertyFilterPanel
          variant="bottomsheet"
          biddingCount={0}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export const SortSelect = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') ?? 'newest'

  const SORT_LABELS = {
    newest: '新着順',
    price_asc: '価格が安い順',
    price_desc: '価格が高い順',
    bids: '入札が多い順',
    area_desc: '面積が広い順',
  }

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <select
      value={sort}
      onChange={(e) => handleSort(e.target.value)}
      className="appearance-none pl-8 pr-8 py-2 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors cursor-pointer"
    >
      {Object.entries(SORT_LABELS).map(([key, label]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
  )
}
