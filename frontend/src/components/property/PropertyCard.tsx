'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, Home, MapPin, Landmark, Flame, Heart, Gavel, Camera } from 'lucide-react'
import { type Property, PROPERTY_TYPE_LABEL } from '@/data/mock'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { api } from '@/lib/api'

const typeIcons: Record<string, React.ReactNode> = {
  house: <Home className="w-8 h-8 text-neutral-300" />,
  apartment: <Building2 className="w-8 h-8 text-neutral-300" />,
  land: <MapPin className="w-8 h-8 text-neutral-300" />,
  other: <Landmark className="w-8 h-8 text-neutral-300" />,
}

const placeholderColors: Record<string, string> = {
  house: 'bg-secondary-50',
  apartment: 'bg-primary-50',
  land: 'bg-cta-50',
  other: 'bg-neutral-100',
}

export const PropertyCard = ({ property }: { property: Property }) => {
  const [saved, setSaved] = useState(false)

  const specs = [
    PROPERTY_TYPE_LABEL[property.type],
    `${property.area}㎡`,
    property.yearBuilt ? `築${new Date().getFullYear() - property.yearBuilt}年` : null,
  ]
    .filter(Boolean)
    .join(' / ')

  const isBidding = property.status === 'bidding'
  const isHot = property.bidCount >= 5
  const mainImage = property.images?.[0] ?? property.imageUrl
  const imageCount = property.images?.length ?? (property.imageUrl ? 1 : 0)

  return (
    <div className="relative group">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden transition-all hover:shadow-dropdown">
          {/* 画像 */}
          <div className={`relative aspect-[4/3] ${!mainImage ? placeholderColors[property.type] : 'bg-neutral-100'} flex items-center justify-center`}>
            {mainImage ? (
              <Image
                src={mainImage}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            ) : (
              typeIcons[property.type]
            )}
            <div className="absolute top-3 left-3">
              <StatusBadge status={property.status} />
            </div>
            {isHot && (
              <div className="absolute top-3 right-12 flex items-center gap-1 bg-error-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" />
                人気
              </div>
            )}
            {/* 写真枚数バッジ */}
            {imageCount > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                <Camera className="w-3 h-3" />
                {imageCount}
              </div>
            )}
          </div>

          {/* 情報 */}
          <div className="p-4">
            {/* 価格（最重要） */}
            <div className="flex items-baseline justify-between">
              <p className="price text-xl text-foreground">
                {property.price.toLocaleString()}
                <span className="text-xs font-normal text-neutral-400 ml-1">万円</span>
              </p>
              {isBidding && property.bidCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-cta-600">
                  <Gavel className="w-3 h-3" />
                  {property.bidCount}件入札
                </span>
              )}
            </div>

            {/* 住所（場所が次に重要） */}
            <p className="mt-1.5 text-sm text-neutral-600 leading-snug line-clamp-1">
              {property.address}
            </p>

            {/* スペック */}
            <p className="mt-1 text-xs text-neutral-400">{specs}</p>
          </div>
        </div>
      </Link>

      {/* お気に入りボタン（カードの外に置いてリンクと干渉しない） */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const next = !saved
          setSaved(next)
          if (next) {
            api.post(`/users/me/favorites/${property.id}`)
          } else {
            api.delete(`/users/me/favorites/${property.id}`)
          }
        }}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          saved
            ? 'bg-white text-error-500'
            : 'bg-black/20 text-white hover:bg-black/40'
        }`}
        aria-label={saved ? 'お気に入りから削除' : 'お気に入りに追加'}
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      </button>
    </div>
  )
}
