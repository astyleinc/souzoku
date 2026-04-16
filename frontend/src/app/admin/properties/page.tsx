'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Eye,
  Loader2,
  Home,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { adminNav } from '@/config/navigation'
import { PROPERTY_TYPE_LABEL } from '@/data/mock'
import { api, toItems } from '@/lib/api'
import { toProperty } from '@/lib/mappers'
import type { ApiProperty } from '@/lib/mappers'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<ReturnType<typeof toProperty>[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const fetchProperties = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('includeAll', 'true')
    params.set('limit', '50')
    if (keyword) params.set('keyword', keyword)
    if (statusFilter) params.set('status', statusFilter)
    if (typeFilter) params.set('propertyType', typeFilter)

    const res = await api.get<unknown>(`/properties?${params.toString()}`)
    if (res.success) {
      setProperties(toItems<ApiProperty>(res.data).map(toProperty))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleSearch = () => {
    fetchProperties()
  }

  return (
    <DashboardShell
      title="物件管理"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      {/* フィルタ・検索 */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="物件名・住所で検索..."
              className="pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl w-full sm:w-72 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
          >
            <option value="">すべてのステータス</option>
            <option value="reviewing">審査待ち</option>
            <option value="published">公開</option>
            <option value="bidding">入札受付中</option>
            <option value="closed">成約</option>
            <option value="returned">差戻し</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
          >
            <option value="">すべての種別</option>
            <option value="apartment">マンション</option>
            <option value="house">一戸建て</option>
            <option value="land">土地</option>
            <option value="other">その他</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors"
          >
            検索
          </button>
        </div>
        <p className="text-sm text-neutral-400">{properties.length}件</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <Home className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">物件が見つかりませんでした</p>
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
                    <th className="text-center py-3 px-5 text-xs text-neutral-400 font-medium">入札</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">登記</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">登録日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <p className="font-medium truncate max-w-[200px]">{p.title}</p>
                        <p className="text-xs text-neutral-400">{p.address}</p>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">{PROPERTY_TYPE_LABEL[p.type]}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="price">{p.price.toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 ml-1">万円</span>
                      </td>
                      <td className="py-3.5 px-5 text-center price">{p.bidCount}</td>
                      <td className="py-3.5 px-5"><StatusBadge status={p.status} /></td>
                      <td className="py-3.5 px-5 text-xs text-neutral-400">{p.registrationStatus}</td>
                      <td className="py-3.5 px-5 text-neutral-400">{p.createdAt?.slice(0, 10)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/properties/${p.id}`} className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {p.status === 'reviewing' && (
                            <Link href={`/admin/properties/${p.id}`} className="text-xs text-cta-500 hover:underline font-medium">
                              審査する
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

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            {properties.map((p) => (
              <Link key={p.id} href={`/admin/properties/${p.id}`} className="block bg-white rounded-2xl shadow-card p-4 hover:shadow-dropdown transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{p.address}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
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
