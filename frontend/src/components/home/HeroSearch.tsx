'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

const POPULAR_TAGS = [
  { label: '駅徒歩10分以内', query: 'walkMinutes=10' },
  { label: '築20年以内', query: 'builtAfter=2006' },
  { label: '相続登記済み', query: 'registrationComplete=true' },
  { label: '入札受付中', query: 'status=bidding' },
] as const

const PROPERTY_TYPES = [
  { value: '', label: 'すべて' },
  { value: 'apartment', label: 'マンション' },
  { value: 'house', label: '戸建て' },
  { value: 'land', label: '土地' },
] as const

const PRICE_RANGES = [
  { value: '', label: '指定なし' },
  { value: '1000', label: '1,000万円〜' },
  { value: '1500', label: '1,500万円〜' },
  { value: '2000', label: '2,000万円〜' },
  { value: '3000', label: '3,000万円〜' },
] as const

export const HeroSearch = () => {
  const router = useRouter()
  const [area, setArea] = useState('')
  const [type, setType] = useState('')
  const [minPrice, setMinPrice] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (area) params.set('q', area)
    if (type) params.set('type', type)
    if (minPrice) params.set('minPrice', minPrice)
    router.push(`/properties${params.size > 0 ? `?${params.toString()}` : ''}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-panel rounded-[14px] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-end gap-2.5">
        <div className="flex-[1.5] min-w-[140px]">
          <label className="block text-[10px] font-bold text-bark-4 tracking-[0.06em] uppercase mb-1.5">
            エリア・駅名
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="例: 世田谷区、横浜市"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-warm-2 rounded-[6px] bg-warm text-[13px] text-bark transition-[border-color,box-shadow] focus:outline-none focus:border-sage focus:shadow-[0_0_0_3px_rgba(107,143,113,0.12)]"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-bold text-bark-4 tracking-[0.06em] uppercase mb-1.5">
            物件種別
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3.5 py-2.5 pr-8 border-[1.5px] border-warm-2 rounded-[6px] bg-warm text-[13px] text-bark cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%227%22%3E%3Cpath%20d=%22M1%201l5%205%205-5%22%20fill=%22none%22%20stroke=%22%23999%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22/%3E%3C/svg%3E')] bg-[position:right_12px_center] bg-no-repeat focus:outline-none focus:border-sage focus:shadow-[0_0_0_3px_rgba(107,143,113,0.12)]"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-bold text-bark-4 tracking-[0.06em] uppercase mb-1.5">
            価格帯
          </label>
          <select
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3.5 py-2.5 pr-8 border-[1.5px] border-warm-2 rounded-[6px] bg-warm text-[13px] text-bark cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%227%22%3E%3Cpath%20d=%22M1%201l5%205%205-5%22%20fill=%22none%22%20stroke=%22%23999%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22/%3E%3C/svg%3E')] bg-[position:right_12px_center] bg-no-repeat focus:outline-none focus:border-sage focus:shadow-[0_0_0_3px_rgba(107,143,113,0.12)]"
          >
            {PRICE_RANGES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-7 py-2.5 bg-sage-deep text-white rounded-[8px] text-[13px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
        >
          検索する
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-bark-4">人気:</span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => router.push(`/properties?${tag.query}`)}
            className="text-[11px] text-bark-3 bg-warm px-2.5 py-0.5 rounded-[10px] transition-colors hover:bg-sage-light hover:text-sage-deep"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </form>
  )
}
