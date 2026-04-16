'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Star,
  Briefcase,
  FileText,
  Landmark,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CaseStatusBadge } from '@/components/shared/CaseStatusBadge'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type BrokerDetail = {
  id: string
  companyName: string
  representativeName: string
  licenseNumber: string
  email: string
  phone: string
  averageRating: number
  totalDeals: number
  bankName: string | null
  branchName: string | null
  accountType: string | null
  accountNumber: string | null
  createdAt: string
}

type CaseItem = {
  id: string
  propertyTitle: string
  propertyAddress: string
  sellerName: string
  buyerName: string
  status: string
  amount: number
}

const toMan = (yen: number) => Math.round(yen / 10000)

export default function AdminBrokerDetailPage() {
  const params = useParams()
  const [broker, setBroker] = useState<BrokerDetail | null>(null)
  const [cases, setCases] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [brokerRes, casesRes] = await Promise.all([
        api.get<unknown>(`/brokers/${params.id}`),
        api.get<unknown>('/cases'),
      ])
      if (brokerRes.success) {
        setBroker(brokerRes.data as BrokerDetail)
        if (casesRes.success) {
          const brokerCases = toItems<CaseItem>(casesRes.data).filter(
            (c) => c.propertyTitle
          )
          setCases(brokerCases)
        }
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <DashboardShell title="宅建業者詳細" roleLabel="管理者" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  if (!broker) {
    return (
      <DashboardShell title="宅建業者詳細" roleLabel="管理者" navItems={adminNav}>
        <p className="text-sm text-neutral-400 text-center py-20">業者が見つかりませんでした</p>
      </DashboardShell>
    )
  }

  const feeStage = broker.totalDeals <= 5 ? '60%' : broker.totalDeals <= 20 ? '55%' : '50%'

  return (
    <DashboardShell
      title="宅建業者詳細"
      roleLabel="管理者"
      navItems={adminNav}
    >
      <Link href="/admin/brokers" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        業者管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 会社プロフィール */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold">{broker.companyName}</h2>
                <p className="text-sm text-neutral-400 mt-0.5">{broker.licenseNumber}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning-400" />
                <span className="text-sm font-medium">{broker.averageRating}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-400" />
                <span>代表: {broker.representativeName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href={`mailto:${broker.email}`} className="text-primary-500 hover:underline">{broker.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400" />
                <a href={`tel:${broker.phone}`} className="hover:underline">{broker.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>登録日: {broker.createdAt?.slice(0, 10)}</span>
              </div>
            </div>
          </div>

          {/* 実績 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">取引実績</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '総取引件数', value: broker.totalDeals, unit: '件' },
                { label: '平均評価', value: broker.averageRating, unit: '' },
                { label: '手数料段階', value: feeStage, unit: '' },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-400 mb-1">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}<span className="text-xs font-normal text-neutral-400 ml-0.5">{item.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* 担当案件 */}
          <div className="bg-white rounded-2xl shadow-card">
            <div className="px-6 py-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary-500" />
                担当案件
              </h3>
            </div>
            {cases.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {cases.map((c) => (
                  <div key={c.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{c.propertyTitle}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{c.propertyAddress}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                          <span>売主: {c.sellerName}</span>
                          <span>買い手: {c.buyerName}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <CaseStatusBadge status={c.status} />
                        <p className="price text-sm mt-1">{toMan(c.amount).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 pb-6">
                <p className="text-sm text-neutral-400">担当案件はありません</p>
              </div>
            )}
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">管理操作</h3>
            <div className="space-y-3">
              <Link
                href={`/admin/brokers/${params.id}/edit`}
                className="block w-full px-4 py-2.5 text-sm font-medium text-center text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                編集する
              </Link>
            </div>
          </div>

          {broker.bankName && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-cta-500" />
                振込口座
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">銀行名</span>
                  <span>{broker.bankName}</span>
                </div>
                {broker.branchName && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">支店名</span>
                    <span>{broker.branchName}</span>
                  </div>
                )}
                {broker.accountType && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">口座種別</span>
                    <span>{broker.accountType}</span>
                  </div>
                )}
                {broker.accountNumber && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">口座番号</span>
                    <span>{broker.accountNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
