'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Ruler } from 'lucide-react'
import { api, toItems } from '@/lib/api'
import { toProperty, type ApiProperty } from '@/lib/mappers'
import { PROPERTY_TYPE_LABEL, type Property } from '@/data/mock'

type SortKey = 'recommended' | 'new' | 'priceAsc' | 'bidCount'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recommended', label: 'おすすめ' },
  { key: 'new', label: '新着順' },
  { key: 'priceAsc', label: '価格が低い' },
  { key: 'bidCount', label: '入札数が多い' },
]

const sortProps = (list: Property[], key: SortKey): Property[] => {
  const arr = [...list]
  switch (key) {
    case 'new':
      return arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    case 'priceAsc':
      return arr.sort((a, b) => a.price - b.price)
    case 'bidCount':
      return arr.sort((a, b) => b.bidCount - a.bidCount)
    default:
      return arr
  }
}

const badgeFor = (p: Property) => {
  const daysSince =
    (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSince < 7) return { label: 'NEW', cls: 'bg-sage text-white' }
  if (p.bidCount >= 3)
    return { label: `入札${p.bidCount}件`, cls: 'bg-badge-pop text-white' }
  if (p.status === 'bidding')
    return { label: '入札受付中', cls: 'bg-badge-deal text-white' }
  return null
}

export const HomeResults = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [sort, setSort] = useState<SortKey>('recommended')
  const [favs, setFavs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/properties?biddingOnly=true&limit=6')
      if (res.success) {
        setProperties(toItems<ApiProperty>(res.data).map(toProperty))
      }
      setLoading(false)
    }
    load()
  }, [])

  const sorted = useMemo(() => sortProps(properties, sort), [properties, sort])

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        api.delete(`/users/me/favorites/${id}`)
      } else {
        next.add(id)
        api.post(`/users/me/favorites/${id}`)
      }
      return next
    })
  }

  if (!loading && sorted.length === 0) return null

  return (
    <section className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-[20px] font-bold flex items-center gap-2.5 text-bark tracking-[-0.02em]">
          入札中の物件
          <span className="font-mono text-[11px] font-normal text-bark-3 bg-warm-2/70 px-2 py-0.5 rounded-md">
            {sorted.length}
          </span>
        </h2>
        <div className="flex items-center gap-5">
          {SORT_OPTIONS.map((opt) => {
            const active = sort === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSort(opt.key)}
                className={`text-[12px] font-medium transition-colors underline-offset-[6px] ${
                  active
                    ? 'text-bark underline decoration-sage-deep decoration-[2px]'
                    : 'text-bark-4 hover:text-bark-2'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((p, i) => {
          const badge = badgeFor(p)
          const img = p.images?.[0] ?? p.imageUrl
          const liked = favs.has(p.id)
          const yearsOld = p.yearBuilt
            ? new Date().getFullYear() - p.yearBuilt
            : null
          return (
            <article
              key={p.id}
              className="anim-fade-up group surface-card rounded-[12px] overflow-hidden transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:surface-card-hover"
              style={{ animationDelay: `${0.08 + i * 0.06}s` }}
            >
              <Link href={`/properties/${p.id}`} className="block">
                <div className="relative h-[200px] overflow-hidden noimage-tex">
                  {img ? (
                    <Image
                      src={img}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 420px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-bark-4 text-[10px] tracking-[0.25em] font-medium">
                      NO IMAGE
                    </div>
                  )}
                  <div className="absolute inset-0 pcard-img-shade pointer-events-none" />
                  {badge && (
                    <span
                      className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-[4px] tracking-[0.04em] ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFav(p.id)
                    }}
                    aria-label={liked ? 'お気に入りから削除' : 'お気に入りに追加'}
                    className={`absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full flex items-center justify-center backdrop-blur-[6px] transition-transform hover:scale-110 ${
                      liked ? 'bg-[#ffe0e0]' : 'bg-white/85'
                    }`}
                  >
                    <Heart
                      className={`w-[14px] h-[14px] ${liked ? 'fill-[#d94b4b] text-[#d94b4b]' : 'text-bark-3'}`}
                    />
                  </button>
                  {p.area > 0 && (
                    <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-[6px] px-2 py-0.5 rounded-[4px] text-[10px] font-medium text-bark-2 flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      {p.area.toFixed(1)}m²
                    </div>
                  )}
                </div>
                <div className="px-4 pt-3.5 pb-4">
                  <div className="flex items-center gap-1 text-[10px] text-bark-4 font-medium tracking-[0.03em] mb-1">
                    <MapPin className="w-3 h-3" />
                    {p.address}
                  </div>
                  <h3 className="font-bold text-[15px] leading-[1.4] tracking-[-0.01em] mb-2 text-bark line-clamp-2">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    <span className="text-[10px] text-bark-3 bg-warm px-2 py-0.5 rounded-[5px]">
                      {PROPERTY_TYPE_LABEL[p.type]}
                    </span>
                    {yearsOld !== null && (
                      <span className="text-[10px] text-bark-3 bg-warm px-2 py-0.5 rounded-[5px]">
                        築{yearsOld}年
                      </span>
                    )}
                    <span className="text-[10px] text-bark-3 bg-warm px-2 py-0.5 rounded-[5px]">
                      {p.registrationStatus}
                    </span>
                    {p.bidCount > 0 && (
                      <span className="text-[10px] text-bark-3 bg-warm px-2 py-0.5 rounded-[5px]">
                        入札{p.bidCount}件
                      </span>
                    )}
                  </div>
                  <div className="flex items-end justify-between pt-2.5 border-t border-warm-2">
                    <div className="price text-[19px] text-sage-deep leading-none">
                      {p.price.toLocaleString()}
                      <small className="text-[11px] font-normal text-bark-4 ml-0.5">
                        万円
                      </small>
                    </div>
                    <div className="text-[10px] text-bark-4 text-right leading-[1.5]">
                      {p.prefecture}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-[13px] text-bark-2 font-medium underline-offset-[6px] hover:underline decoration-sage-deep/40 transition-colors"
        >
          すべての物件を見る →
        </Link>
      </div>
    </section>
  )
}
