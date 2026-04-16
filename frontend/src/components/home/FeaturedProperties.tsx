'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PropertyCard } from '@/components/property/PropertyCard'
import { api, toItems } from '@/lib/api'
import { toProperty } from '@/lib/mappers'
import type { ApiProperty } from '@/lib/mappers'

export const FeaturedProperties = () => {
  const [properties, setProperties] = useState<ReturnType<typeof toProperty>[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/properties?biddingOnly=true&limit=4')
      if (res.success) {
        setProperties(toItems<ApiProperty>(res.data).map(toProperty))
      }
    }
    load()
  }, [])

  if (properties.length === 0) return null

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-cta-600 mb-1">現在入札受付中</p>
            <h2 className="text-2xl font-bold text-foreground">
              {properties.length}件の物件に入札できます
            </h2>
          </div>
          <Link
            href="/properties?status=bidding"
            className="hidden sm:inline-flex items-center text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            すべての物件を見る
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/properties?status=bidding"
            className="inline-flex items-center text-sm text-primary-500 font-medium"
          >
            すべての物件を見る
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
