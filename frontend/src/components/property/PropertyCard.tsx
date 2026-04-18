'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Ruler, Camera } from 'lucide-react'
import { type Property, PROPERTY_TYPE_LABEL } from '@/data/mock'
import { api } from '@/lib/api'

const badgeFor = (p: Property) => {
  const days = (Date.now() - new Date(p.createdAt).getTime()) / 86_400_000
  if (days < 7) return { label: 'NEW', cls: 'bg-sage text-white' }
  if (p.bidCount >= 3)
    return { label: `入札${p.bidCount}件`, cls: 'bg-badge-pop text-white' }
  if (p.status === 'bidding')
    return { label: '入札受付中', cls: 'bg-badge-deal text-white' }
  return null
}

export const PropertyCard = ({ property }: { property: Property }) => {
  const [saved, setSaved] = useState(false)
  const mainImage = property.images?.[0] ?? property.imageUrl
  const imageCount = property.images?.length ?? (property.imageUrl ? 1 : 0)
  const yearsOld = property.yearBuilt
    ? new Date().getFullYear() - property.yearBuilt
    : null
  const badge = badgeFor(property)

  return (
    <article className="group relative surface-card rounded-[12px] overflow-hidden transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:surface-card-hover">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative h-[200px] overflow-hidden noimage-tex">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 420px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-bark-4 text-[10px] tracking-[0.2em] font-semibold">
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
          {imageCount > 1 && (
            <div className="absolute bottom-2.5 left-2.5 bg-black/45 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-[4px] flex items-center gap-1">
              <Camera className="w-3 h-3" />
              {imageCount}
            </div>
          )}
          {property.area > 0 && (
            <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-[6px] px-2 py-0.5 rounded-[4px] text-[10px] font-medium text-bark-2 flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {property.area.toFixed(1)}m²
            </div>
          )}
        </div>
        <div className="px-4 pt-3.5 pb-4">
          <div className="flex items-center gap-1 text-[10px] text-bark-4 font-medium tracking-[0.03em] mb-1">
            <MapPin className="w-3 h-3" />
            {property.address}
          </div>
          <h3 className="font-bold text-[15px] leading-[1.4] tracking-[-0.01em] mb-2 text-bark line-clamp-2">
            {property.title}
          </h3>
          <div className="flex flex-wrap gap-1 mb-2.5">
            <span className="text-[10px] text-bark-3 bg-warm px-2 py-0.5 rounded-[5px]">
              {PROPERTY_TYPE_LABEL[property.type]}
            </span>
            {yearsOld !== null && (
              <span className="text-[10px] text-bark-3 bg-warm px-2 py-0.5 rounded-[5px]">
                築{yearsOld}年
              </span>
            )}
            {property.bidCount > 0 && (
              <span className="text-[10px] text-bark-3 bg-warm px-2 py-0.5 rounded-[5px]">
                入札{property.bidCount}件
              </span>
            )}
          </div>
          <div className="flex items-end justify-between pt-2.5 border-t border-warm-2">
            <div className="price text-[19px] text-sage-deep leading-none">
              {property.price.toLocaleString()}
              <small className="text-[11px] font-normal text-bark-4 ml-0.5">
                万円
              </small>
            </div>
            <div className="text-[10px] text-bark-4 text-right leading-[1.5]">
              {property.prefecture}
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const next = !saved
          setSaved(next)
          if (next) api.post(`/users/me/favorites/${property.id}`)
          else api.delete(`/users/me/favorites/${property.id}`)
        }}
        aria-label={saved ? 'お気に入りから削除' : 'お気に入りに追加'}
        className={`absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full flex items-center justify-center backdrop-blur-[6px] transition-transform hover:scale-110 ${
          saved ? 'bg-[#ffe0e0]' : 'bg-white/85'
        }`}
      >
        <Heart
          className={`w-[14px] h-[14px] ${saved ? 'fill-[#d94b4b] text-[#d94b4b]' : 'text-bark-3'}`}
        />
      </button>
    </article>
  )
}
