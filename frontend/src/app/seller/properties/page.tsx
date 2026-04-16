'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Loader2,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { sellerNav } from '@/config/navigation'
import { PROPERTY_TYPE_LABEL } from '@/data/mock'
import { api, toItems } from '@/lib/api'
import { toProperty } from '@/lib/mappers'
import type { ApiProperty } from '@/lib/mappers'

export default function SellerPropertiesPage() {
  const [properties, setProperties] = useState<ReturnType<typeof toProperty>[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [keyword, setKeyword] = useState('')

  const fetchProperties = async (kw?: string) => {
    setLoading(true)
    setFetchError(false)
    const params = new URLSearchParams({ includeAll: 'true', limit: '50' })
    if (kw) params.set('keyword', kw)
    const res = await api.get<unknown>(`/properties?${params}`)
    if (res.success) {
      setProperties(toItems<ApiProperty>(res.data).map(toProperty))
    } else {
      setFetchError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleSearch = () => {
    fetchProperties(keyword)
  }

  return (
    <DashboardShell
      title="出品物件"
      roleLabel="売主"
      navItems={sellerNav}
    >
      {/* ヘッダーアクション */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch() }}
          className="relative w-full sm:w-auto"
        >
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="物件名で検索..."
            className="pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl w-full sm:w-72 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
          />
        </form>
        <Link
          href="/seller/properties/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規出品
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : fetchError ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <p className="text-sm text-error-500 mb-3">データの取得に失敗しました</p>
          <button onClick={() => fetchProperties(keyword)} className="text-sm text-primary-500 hover:underline">再試行</button>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <Building2 className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
          <p className="text-neutral-400 mb-4">まだ物件がありません</p>
          <Link
            href="/seller/properties/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            最初の物件を出品する
          </Link>
        </div>
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">希望価格</th>
                    <th className="text-center py-3 px-5 text-xs text-neutral-400 font-medium">入札数</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">登録日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <p className="font-medium truncate max-w-[220px]">{p.title}</p>
                        <p className="text-xs text-neutral-400">{p.address}</p>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">
                        {PROPERTY_TYPE_LABEL[p.type]}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="price">{p.price.toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 ml-1">万円</span>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className="price">{p.bidCount}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3.5 px-5 text-neutral-400">
                        {new Date(p.createdAt).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <Link href={`/seller/properties/${p.id}`} className="text-sm text-primary-500 hover:text-primary-600">
                            詳細
                          </Link>
                          {(p.status === 'bidding' || p.status === 'bid_ended') && (
                            <Link href={`/seller/bids?property=${p.id}`} className="text-sm text-cta-500 hover:text-cta-600">
                              入札
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カードリスト */}
          <div className="lg:hidden space-y-3">
            {properties.map((p) => (
              <Link
                key={p.id}
                href={`/seller/properties/${p.id}`}
                className="block bg-white rounded-2xl shadow-card p-4 hover:shadow-dropdown transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{p.address}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span>{PROPERTY_TYPE_LABEL[p.type]}</span>
                  <span className="price text-sm text-foreground">{p.price.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
                  <span className="ml-auto">入札 {p.bidCount}件</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
