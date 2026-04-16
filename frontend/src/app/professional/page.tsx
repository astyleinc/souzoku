'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Copy,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { NotificationList } from '@/components/shared/NotificationList'
import { SummaryCard } from '@/components/shared/SummaryCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { OnboardingChecklist } from '@/components/shared/OnboardingChecklist'
import { professionalNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import type { Notification, ApiNotification } from '@/types/dashboard'
import { toNotification } from '@/types/dashboard'

type ReferralLink = {
  id: string
  code: string
  nwCompanyId: string | null
  isActive: boolean
  clickCount: number
}

type RevenueItem = {
  propertyTitle: string
  salePrice: number
  professionalAmount: number
  paymentStatus: string
}

type RevenueSummary = {
  totalEarnings: number
  unpaidAmount: number
  referralCount: number
  closedCount: number
}

export default function ProfessionalDashboardPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([])
  const [summary, setSummary] = useState<RevenueSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [notifRes, linksRes, summaryRes] = await Promise.all([
        api.get<unknown>('/notifications?limit=5'),
        api.get<unknown>('/referrals/me'),
        api.get<RevenueSummary>('/revenue/professional/me/summary'),
      ])

      if (notifRes.success) {
        setNotifications(toItems<ApiNotification>(notifRes.data).map(toNotification))
      }
      if (linksRes.success) {
        setReferralLinks(toItems<ReferralLink>(linksRes.data))
      }
      if (summaryRes.success) {
        setSummary(summaryRes.data)
      }
      if (!notifRes.success && !linksRes.success && !summaryRes.success) {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  const activeLink = referralLinks.find((l) => l.isActive)
  const referralUrl = activeLink
    ? `${window.location.origin}/register?ref=${activeLink.code}`
    : null

  const handleCopy = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      <OnboardingChecklist
        items={[
          { label: 'プロフィールを完成させる', href: '/professional/settings', completed: true },
          { label: '資格証明書をアップロード', href: '/professional/settings', completed: true },
          { label: '紹介リンクを発行する', href: '/professional/referral-link', completed: referralLinks.length > 0 },
          { label: 'クライアントを紹介する', href: '/professional/clients/new', completed: false },
        ]}
      />

      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon={Users} iconColor="text-primary-500" iconBg="bg-primary-50" label="紹介件数" value={String(summary?.referralCount ?? 0)} />
        <SummaryCard icon={CheckCircle} iconColor="text-success-500" iconBg="bg-success-50" label="成約件数" value={String(summary?.closedCount ?? 0)} sub={summary && summary.referralCount > 0 ? `成約率 ${Math.round((summary.closedCount / summary.referralCount) * 100)}%` : undefined} />
        <SummaryCard icon={DollarSign} iconColor="text-cta-500" iconBg="bg-cta-50" label="累計紹介料" value={summary ? (summary.totalEarnings / 10000).toFixed(1) : '0'} sub="万円" />
        <SummaryCard icon={DollarSign} iconColor="text-warning-500" iconBg="bg-warning-50" label="未入金" value={summary ? (summary.unpaidAmount / 10000).toFixed(1) : '0'} sub="万円" />
      </div>

      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          <Users className="w-4 h-4 shrink-0" />
          データの取得に失敗しました。ネットワーク接続を確認し、ページを更新してください。
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 紹介案件一覧 */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-card">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-base font-semibold">紹介案件</h2>
                <Link href="/professional/referrals" className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
                  すべて <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="px-5 pb-5">
                <Link href="/professional/clients" className="text-sm text-primary-500 hover:underline">
                  クライアント一覧を見る →
                </Link>
              </div>
            </div>
          </div>

          {/* 紹介リンク + 通知 */}
          <div className="space-y-6">
            {/* 紹介リンク */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="px-5 py-4">
                <h2 className="text-base font-semibold">紹介リンク</h2>
              </div>
              <div className="px-5 pb-5">
                <p className="text-xs text-neutral-400 mb-3">
                  このリンクを売主に共有すると、紹介案件として自動的に紐づけられます
                </p>
                {referralUrl ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralUrl}
                      className="flex-1 px-3 py-2.5 text-xs border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-500"
                    />
                    <button
                      onClick={handleCopy}
                      className="p-2.5 text-primary-500 hover:bg-primary-50 rounded-xl transition-colors"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/professional/referral-link"
                    className="text-sm text-primary-500 hover:underline"
                  >
                    紹介リンクを発行する →
                  </Link>
                )}
              </div>
            </div>

            {/* 通知 */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="px-5 py-4">
                <h2 className="text-base font-semibold">通知</h2>
              </div>
              <div className="px-5 pb-5">
                <NotificationList notifications={notifications.slice(0, 3)} variant="compact" />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
