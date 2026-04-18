'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  MapPin,
  Home,
  Ruler,
  Calendar,
  FileText,
  Gavel,
  Clock,
  Edit3,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { UrgencyBadge } from '@/components/shared/UrgencyBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { BidStatusBadge } from '@/components/shared/BidStatusBadge'
import { InheritanceDeadlineBanner } from '@/components/shared/InheritanceDeadlineBanner'
import { sellerNav } from '@/config/navigation'
import { PROPERTY_TYPE_LABEL } from '@/data/mock'
import { api, toItems } from '@/lib/api'
import type { ApiProperty } from '@/lib/mappers'
import { toProperty } from '@/lib/mappers'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type ApiBid = {
  id: string
  propertyId: string
  amount: number
  status: string
  bidderName: string
  bidderType: string
  createdAt: string
}

type ApiDocument = {
  id: string
  name: string
  status: 'approved' | 'pending' | 'rejected'
}

export default function SellerPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState<ReturnType<typeof toProperty> | null>(null)
  const [inheritanceStartDate, setInheritanceStartDate] = useState<string | null>(null)
  const [bids, setBids] = useState<ApiBid[]>([])
  const [documents, setDocuments] = useState<ApiDocument[]>([])
  const [relisting, setRelisting] = useState<null | 'normal_listing' | 'bidding'>(null)
  const [relistError, setRelistError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const [propRes, bidRes, docRes] = await Promise.all([
        api.get<ApiProperty>(`/properties/${id}`),
        api.get<unknown>(`/bids?propertyId=${id}`),
        api.get<unknown>(`/properties/${id}/documents`),
      ])

      if (propRes.success) {
        setProperty(toProperty(propRes.data))
        setInheritanceStartDate(propRes.data.inheritanceStartDate ?? null)
      }
      if (bidRes.success) {
        setBids(toItems<ApiBid>(bidRes.data).sort((a, b) => b.amount - a.amount))
      }
      if (docRes.success) {
        setDocuments(toItems<ApiDocument>(docRes.data))
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <DashboardShell title="物件詳細" roleLabel="売主" navItems={sellerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  if (!property) {
    return (
      <DashboardShell title="物件詳細" roleLabel="売主" navItems={sellerNav}>
        <div className="text-center py-20">
          <p className="text-sm text-neutral-400">物件が見つかりませんでした</p>
          <Link href="/seller/properties" className="text-sm text-primary-500 hover:underline mt-2 inline-block">
            出品物件一覧に戻る
          </Link>
        </div>
      </DashboardShell>
    )
  }

  const highestBid = bids[0] ?? null
  // 万円表示に変換（APIはbidsの金額も円で返す想定）
  const displayBids = bids.map((b) => ({
    ...b,
    displayAmount: Math.round(b.amount / 10000),
  }))

  const docStatusIcon = {
    approved: <CheckCircle className="w-4 h-4 text-success-500" />,
    pending: <Clock className="w-4 h-4 text-warning-500" />,
    rejected: <XCircle className="w-4 h-4 text-error-500" />,
  }

  const docStatusLabel = {
    approved: '承認済み',
    pending: '確認中',
    rejected: '再提出要',
  }

  // 不成立物件の再出品 / 通常掲載切替
  const handleRelist = async (mode: 'normal_listing' | 'bidding') => {
    setRelistError(null)
    setRelisting(mode)
    const res = await api.patch<ApiProperty>(`/properties/${id}/relist`, { mode })
    if (res.success) {
      setProperty(toProperty(res.data))
    } else {
      setRelistError(res.error?.message ?? '操作に失敗しました')
    }
    setRelisting(null)
  }

  return (
    <DashboardShell
      title="物件詳細"
      roleLabel="売主"
      navItems={sellerNav}
    >
      <Link
        href="/seller/properties"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        出品物件一覧に戻る
      </Link>

      {inheritanceStartDate && (
        <div className="mb-6">
          <InheritanceDeadlineBanner inheritanceStartDate={inheritanceStartDate} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 左: 物件情報 + 入札 */}
        <div className="xl:col-span-2 space-y-6">
          {/* 物件基本情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <StatusBadge status={property.status} />
                  <UrgencyBadge urgency={property.urgency} />
                </div>
                <h2 className="text-lg font-semibold">{property.title}</h2>
                <p className="flex items-center gap-1 text-sm text-neutral-400 mt-1">
                  <MapPin className="w-4 h-4" />
                  {property.address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">希望価格</p>
                <PriceDisplay price={property.price} size="lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl mb-5">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">物件種別</p>
                  <p className="text-sm font-medium">{PROPERTY_TYPE_LABEL[property.type]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">土地面積</p>
                  <p className="text-sm font-medium">{property.area}㎡</p>
                </div>
              </div>
              {property.yearBuilt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-400">築年数</p>
                    <p className="text-sm font-medium">
                      {new Date().getFullYear() - property.yearBuilt}年（{property.yearBuilt}年築）
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">登記状況</p>
                  <p className="text-sm font-medium">{property.registrationStatus}</p>
                </div>
              </div>
            </div>

            {property.description && (
              <div className="mb-4">
                <p className="text-xs text-neutral-400 mb-1">物件説明</p>
                <p className="text-sm leading-relaxed">{property.description}</p>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-3">
              <Link
                href={`/properties/${property.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-500 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                公開ページを確認
              </Link>
              {(property.status === 'reviewing' || property.status === 'returned') && (
                <Link
                  href={`/seller/properties/${property.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  物件情報を編集
                </Link>
              )}
              {property.status === 'failed' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleRelist('bidding')}
                    disabled={Boolean(relisting)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 disabled:opacity-60 transition-colors"
                  >
                    {relisting === 'bidding' && <Loader2 className="w-4 h-4 animate-spin" />}
                    再出品する
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRelist('normal_listing')}
                    disabled={Boolean(relisting)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-60 transition-colors"
                  >
                    {relisting === 'normal_listing' && <Loader2 className="w-4 h-4 animate-spin" />}
                    通常掲載に切替
                  </button>
                </>
              )}
            </div>
            {relistError && (
              <p className="mt-3 text-xs text-error-500">{relistError}</p>
            )}
          </div>

          {/* 入札状況 */}
          <div className="bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-cta-500" />
                <h3 className="text-base font-semibold">入札状況</h3>
              </div>
              <Link
                href={`/seller/bids?property=${property.id}`}
                className="text-sm text-neutral-400 hover:text-neutral-600"
              >
                入札一覧で見る
              </Link>
            </div>

            {displayBids.length === 0 ? (
              <div className="px-5 pb-5 text-center py-8">
                <Gavel className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">まだ入札はありません</p>
              </div>
            ) : (
              <>
                {highestBid && (
                  <div className="mx-5 mb-4 p-4 bg-cta-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-cta-700">現在の最高入札</p>
                        <p className="price text-xl text-cta-600 mt-1">
                          {Math.round(highestBid.amount / 10000).toLocaleString()}
                          <span className="text-sm font-normal text-cta-500 ml-1">万円</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-cta-700">{highestBid.bidderName}</p>
                        <p className="text-xs text-cta-500 mt-0.5">{highestBid.bidderType}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PC: テーブル */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-neutral-100">
                        <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">入札者</th>
                        <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                        <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">入札額</th>
                        <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayBids.map((bid, i) => (
                        <tr key={bid.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                          <td className="py-3.5 px-5 font-medium">{bid.bidderName}</td>
                          <td className="py-3.5 px-5 text-neutral-500">{bid.bidderType}</td>
                          <td className="py-3.5 px-5 text-right">
                            <span className={`price ${i === 0 ? 'text-cta-600' : ''}`}>
                              {bid.displayAmount.toLocaleString()}
                            </span>
                            <span className="text-xs text-neutral-400 ml-1">万円</span>
                            {i === 0 && <span className="text-xs text-cta-500 ml-2">最高額</span>}
                          </td>
                          <td className="py-3.5 px-5">
                            <BidStatusBadge status={bid.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* モバイル: カード */}
                <div className="sm:hidden divide-y divide-neutral-100">
                  {displayBids.map((bid, i) => (
                    <div key={bid.id} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{bid.bidderName}</p>
                          <p className="text-xs text-neutral-400">{bid.bidderType}</p>
                        </div>
                        <BidStatusBadge status={bid.status} />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="price text-sm">
                          <span className={i === 0 ? 'text-cta-600' : ''}>{bid.displayAmount.toLocaleString()}</span>
                          <span className="text-xs font-normal text-neutral-400 ml-1">万円</span>
                          {i === 0 && <span className="text-xs text-cta-500 ml-1">最高額</span>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 右サイドバー */}
        <div className="space-y-6">
          {/* 入札サマリ */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="text-base font-semibold mb-4">入札サマリ</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">入札数</span>
                <span className="price font-medium">{bids.length}件</span>
              </div>
              {highestBid && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">最高入札額</span>
                  <span className="price font-medium text-cta-600">
                    {Math.round(highestBid.amount / 10000).toLocaleString()}万円
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 書類状況 */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">書類状況</h3>
              <Link
                href="/seller/documents"
                className="text-xs text-primary-500 hover:text-primary-600"
              >
                管理画面へ
              </Link>
            </div>
            {documents.length === 0 ? (
              <p className="text-sm text-neutral-400">書類はまだアップロードされていません</p>
            ) : (
              <div className="space-y-3">
                {documents.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="text-sm truncate">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {docStatusIcon[doc.status]}
                      <span className="text-xs text-neutral-400">{docStatusLabel[doc.status]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/seller/documents"
              className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-2 text-xs font-medium text-primary-500 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors w-full justify-center"
            >
              <Download className="w-3.5 h-3.5" />
              書類をアップロード
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
