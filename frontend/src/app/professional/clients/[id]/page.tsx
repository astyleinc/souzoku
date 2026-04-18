'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  Circle,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type ClientDetail = {
  id: string
  name: string
  email: string
  phone: string
  propertyCount: number
  latestPropertyTitle: string
  latestPropertyStatus: string
  referredAt: string
  nwRoute: string
  confirmedRevenue: number
  estimatedRevenue: number
  properties: {
    id: string
    title: string
    status: string
    referredAt: string
  }[]
}

const statusSteps = [
  { key: 'reviewing', label: '審査待ち' },
  { key: 'published', label: '公開' },
  { key: 'bidding', label: '入札受付中' },
  { key: 'bid_ended', label: '入札終了' },
  { key: 'closed', label: '成約' },
  { key: 'settlement', label: '決済完了' },
]

const statusStepIndex: Record<string, number> = {
  reviewing: 0,
  published: 1,
  bidding: 2,
  bid_ended: 3,
  closed: 4,
  settlement: 5,
}

const STATUS_LABEL: Record<string, string> = {
  reviewing: '審査待ち',
  published: '公開',
  bidding: '入札受付中',
  bid_ended: '入札終了',
  closed: '成約',
  settlement: '決済完了',
}

const toMan = (yen: number) => (yen / 10000).toFixed(1)

export default function ProfessionalClientDetailPage() {
  const params = useParams()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<ClientDetail>(`/referrals/me/clients/${params.id}`)
      if (res.success) {
        setClient(res.data)
      } else {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <DashboardShell title="クライアント詳細" roleLabel="士業パートナー" navItems={professionalNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  if (!client) {
    return (
      <DashboardShell title="クライアント詳細" roleLabel="士業パートナー" navItems={professionalNav}>
        <p className="text-sm text-neutral-400 text-center py-20">クライアントが見つかりませんでした</p>
      </DashboardShell>
    )
  }

  const currentStep = statusStepIndex[client.latestPropertyStatus] ?? 0

  return (
    <DashboardShell
      title="クライアント詳細"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      <Link href="/professional/clients" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        クライアント一覧に戻る
      </Link>

      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* クライアント情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold mb-4">{client.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href={`mailto:${client.email}`} className="text-primary-500 hover:underline">{client.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400" />
                <a href={`tel:${client.phone}`} className="text-primary-500 hover:underline">{client.phone}</a>
              </div>
            </div>
          </div>

          {/* 紹介物件一覧 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">紹介物件（{client.propertyCount}件）</h3>
            <div className="space-y-4">
              {/* メインの物件 */}
              <div className="p-4 border border-neutral-100 rounded-xl">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-medium">{client.latestPropertyTitle}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">紹介日: {client.referredAt?.slice(0, 10)}</p>
                  </div>
                </div>
                {/* ステータス進行 */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {statusSteps.map((step, i) => {
                    const isCompleted = i <= currentStep
                    return (
                      <div key={step.key} className="flex items-center gap-1.5">
                        {isCompleted ? (
                          <CheckCircle className={`w-4 h-4 shrink-0 ${i === currentStep ? 'text-cta-500' : 'text-success-500'}`} />
                        ) : (
                          <Circle className="w-4 h-4 shrink-0 text-neutral-200" />
                        )}
                        <span className={`text-xs ${i === currentStep ? 'font-semibold text-foreground' : isCompleted ? 'text-neutral-600' : 'text-neutral-300'}`}>
                          {step.label}
                        </span>
                        {i < statusSteps.length - 1 && (
                          <div className={`w-3 h-px ${isCompleted && i < currentStep ? 'bg-success-300' : 'bg-neutral-200'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* その他の物件 */}
              {(client.properties ?? []).filter((_, i) => i > 0).map((prop) => (
                <div key={prop.id} className="p-4 border border-neutral-100 rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{prop.title}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">紹介日: {prop.referredAt?.slice(0, 10)}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                      {STATUS_LABEL[prop.status] ?? prop.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              {client.nwRoute}
            </span>
            {client.nwRoute !== '直接紹介' && (
              <div className="mt-3 p-3 bg-neutral-50 rounded-xl text-xs text-neutral-500">
                <p>NW経由配分率:</p>
                <p className="mt-1">業者50% / Ouver32% / 士業15% / NW3%</p>
              </div>
            )}
          </div>

          {/* 報酬サマリ */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cta-500" />
              紹介料サマリ
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">確定済み</span>
                <span className="price font-medium">{toMan(client.confirmedRevenue)}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">見込み</span>
                <span className="price font-medium">{toMan(client.estimatedRevenue)}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex justify-between">
                <span className="font-medium">合計</span>
                <span className="price font-semibold">{toMan(client.confirmedRevenue + client.estimatedRevenue)}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
              </div>
            </div>
          </div>

          {/* 操作 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">操作</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${client.email}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
              >
                <Mail className="w-4 h-4" />
                メールを送る
              </a>
              <a
                href={`tel:${client.phone}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                電話する
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
