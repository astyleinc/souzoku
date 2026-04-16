'use client'

import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Globe,
  DollarSign,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'

const statusSteps = [
  { key: 'reviewing', label: '審査待ち' },
  { key: 'published', label: '公開' },
  { key: 'bidding', label: '入札受付中' },
  { key: 'bid_ended', label: '入札終了' },
  { key: 'closed', label: '成約' },
  { key: 'settlement', label: '決済完了' },
]

export default function ProfessionalReferralDetailPage() {
  const referral = {
    clientName: '中村 一郎',
    clientEmail: 'nakamura@example.com',
    clientPhone: '03-1234-5678',
    propertyTitle: '練馬区 駅近マンション 3LDK',
    propertyAddress: '東京都練馬区豊玉北5丁目',
    propertyType: 'マンション',
    area: 72.5,
    askingPrice: 3500,
    currentStatus: 'bidding',
    bidCount: 3,
    nwRoute: 'awaka cross',
    referredAt: '2026-03-01',
    estimatedFee: 33.75,
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === referral.currentStatus)

  return (
    <DashboardShell
      title="紹介案件詳細"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      <Link href="/professional/referrals" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        紹介案件一覧に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 物件情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold mb-4">{referral.propertyTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-1">所在地</p>
                <p>{referral.propertyAddress}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">希望価格</p>
                <p className="price">{referral.askingPrice.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">物件種別</p>
                <p>{referral.propertyType}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">面積</p>
                <p>{referral.area}㎡</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">入札件数</p>
                <p>{referral.bidCount}件</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">紹介日</p>
                <p>{referral.referredAt}</p>
              </div>
            </div>
          </div>

          {/* ステータス進行 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">物件ステータス</h3>
            <div className="space-y-3">
              {statusSteps.map((step, i) => {
                const isCompleted = i <= currentStepIndex
                const isCurrent = i === currentStepIndex
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle className={`w-5 h-5 shrink-0 ${isCurrent ? 'text-cta-500' : 'text-success-500'}`} />
                    ) : (
                      <Circle className="w-5 h-5 shrink-0 text-neutral-200" />
                    )}
                    <span className={`text-sm ${isCurrent ? 'font-semibold text-foreground' : isCompleted ? 'text-foreground' : 'text-neutral-400'}`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-xs text-cta-500 font-medium ml-auto">現在</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 紹介クライアント */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">紹介クライアント</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{referral.clientName}</p>
              <p className="text-neutral-400">{referral.clientEmail}</p>
              <p className="text-neutral-400">{referral.clientPhone}</p>
            </div>
          </div>

          {/* NW経路 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-info-500" />
              紹介経路
            </h3>
            <span className="inline-block px-3 py-1.5 text-xs font-medium bg-secondary-50 text-secondary-700 rounded-full">
              {referral.nwRoute}
            </span>
            <div className="mt-3 p-3 bg-neutral-50 rounded-xl text-xs text-neutral-500">
              <p>NW経由の配分率:</p>
              <p className="mt-1">業者50% / Ouver32% / 士業15% / NW3%</p>
            </div>
          </div>

          {/* 報酬見込み */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cta-500" />
              紹介料見込み
            </h3>
            <p className="price text-lg">{referral.estimatedFee.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
            <p className="text-xs text-neutral-400 mt-1">
              仲介手数料 × 15%（成約後に確定）
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
