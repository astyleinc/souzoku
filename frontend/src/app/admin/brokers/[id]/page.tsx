'use client'

import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Star,
  Briefcase,
  FileText,
  Landmark,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { mockBrokers, mockCases, CASE_STATUS_LABEL } from '@/data/mock-dashboard'

const caseStatusStyle: Record<string, string> = {
  broker_assigned: 'bg-info-50 text-info-700',
  seller_contacted: 'bg-info-50 text-info-700',
  buyer_contacted: 'bg-warning-50 text-warning-700',
  explanation_done: 'bg-warning-50 text-warning-700',
  contract_signed: 'bg-success-50 text-success-700',
  settlement_done: 'bg-success-50 text-success-700',
  cancelled: 'bg-error-50 text-error-700',
}

export default function AdminBrokerDetailPage() {
  const broker = mockBrokers[0]
  const brokerCases = mockCases.filter((c) => c.brokerName === broker.companyName)

  return (
    <DashboardShell
      title="宅建業者詳細"
      roleLabel="管理者"
      userName="Ouver運営"
      navItems={adminNav}
    >
      <Link href="/admin/brokers" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        業者管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* メイン情報 */}
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
                <span>登録日: {broker.createdAt}</span>
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
                { label: '手数料段階', value: broker.totalDeals <= 5 ? '60%' : broker.totalDeals <= 20 ? '55%' : '50%', unit: '' },
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
            {brokerCases.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {brokerCases.map((c) => (
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
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${caseStatusStyle[c.status] || 'bg-neutral-100 text-neutral-600'}`}>
                          {CASE_STATUS_LABEL[c.status]}
                        </span>
                        <p className="price text-sm mt-1">{c.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
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
              <button className="w-full px-4 py-2.5 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                編集する
              </button>
              <button className="w-full px-4 py-2.5 text-sm font-medium text-error-600 bg-error-50 border border-error-200 rounded-xl hover:bg-error-100 transition-colors">
                提携を解除する
              </button>
            </div>
          </div>

          {/* 振込口座 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cta-500" />
              振込口座
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">銀行名</span>
                <span>三菱UFJ銀行</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">支店名</span>
                <span>日本橋支店</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">口座種別</span>
                <span>普通</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">口座番号</span>
                <span>1234567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
