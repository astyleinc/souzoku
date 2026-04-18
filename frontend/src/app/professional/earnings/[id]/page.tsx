'use client'

import { useState, useEffect, use } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Globe,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Earning = {
  id: string
  propertyTitle: string
  propertyAddress: string
  clientId: string
  clientName: string
  referralId: string
  salePrice: number
  brokerageFee: number
  professionalAmount: number
  nwRoute: string | null
  isNwReferral: boolean
  status: 'paid' | 'pending'
  closedAt: string
  paidAt: string | null
  referredAt: string
}

export default function ProfessionalEarningDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [earning, setEarning] = useState<Earning | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<Earning>(`/professionals/me/earnings/${id}`)
      if (res.success) {
        setEarning(res.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <DashboardShell title="紹介料詳細" roleLabel="士業パートナー" navItems={professionalNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  if (!earning) {
    return (
      <DashboardShell title="紹介料詳細" roleLabel="士業パートナー" navItems={professionalNav}>
        <Link href="/professional/earnings" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          紹介料実績に戻る
        </Link>
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <p className="text-sm text-neutral-400">データが見つかりませんでした</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="紹介料詳細"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      <Link href="/professional/earnings" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        紹介料実績に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 取引情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">{earning.propertyTitle}</h2>
              {earning.status === 'paid' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success-50 text-success-700 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                  入金済み
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-warning-50 text-warning-700 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  未入金
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-1">所在地</p>
                <p>{earning.propertyAddress}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">紹介クライアント</p>
                <p className="font-medium">{earning.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">紹介日</p>
                <p>{earning.referredAt}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">決済完了日</p>
                <p>{earning.closedAt}</p>
              </div>
            </div>
          </div>

          {/* 報酬計算 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cta-500" />
              紹介料の計算
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">成約価格</span>
                <span className="price font-medium">{earning.salePrice.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">仲介手数料（税別）</span>
                <span className="price font-medium">{earning.brokerageFee.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">計算式</span>
                <span className="text-xs text-neutral-400">仲介手数料 × 15%</span>
              </div>
              <div className="flex justify-between py-3 bg-cta-50 rounded-xl px-4 -mx-1">
                <span className="font-semibold">紹介料</span>
                <span className="price text-lg font-bold text-cta-500">{earning.professionalAmount.toFixed(1)}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
              </div>
            </div>
          </div>

          {/* 入金情報 */}
          {earning.status === 'paid' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-3">入金情報</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-neutral-400 mb-1">入金日</p>
                  <p>{earning.paidAt}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-1">入金額</p>
                  <p className="price font-medium">{earning.professionalAmount.toFixed(1)}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 紹介経路 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-info-500" />
              紹介経路
            </h3>
            <span className="inline-block px-3 py-1.5 text-xs font-medium bg-secondary-50 text-secondary-700 rounded-full">
              {earning.nwRoute}
            </span>
            {earning.isNwReferral && (
              <div className="mt-3 p-3 bg-neutral-50 rounded-xl text-xs text-neutral-500">
                <p>NW経由の配分率:</p>
                <p className="mt-1">業者50% / Ouver32% / 士業15% / NW3%</p>
              </div>
            )}
          </div>

          {/* 関連ページ */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">関連ページ</h3>
            <div className="space-y-2">
              <Link
                href={`/professional/clients/${earning.clientId}`}
                className="block p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors text-sm"
              >
                <p className="font-medium text-primary-500">クライアント詳細</p>
                <p className="text-xs text-neutral-400 mt-0.5">{earning.clientName}</p>
              </Link>
              <Link
                href={`/professional/referrals/${earning.referralId}`}
                className="block p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors text-sm"
              >
                <p className="font-medium text-primary-500">紹介案件詳細</p>
                <p className="text-xs text-neutral-400 mt-0.5">{earning.propertyTitle}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
