'use client'

import {
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  Globe,
  Users,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { mockProfessionals } from '@/data/mock-dashboard'

const verificationIcon = {
  verified: <CheckCircle className="w-4 h-4 text-success-500" />,
  pending: <Clock className="w-4 h-4 text-warning-500" />,
  rejected: <XCircle className="w-4 h-4 text-error-500" />,
}

const verificationLabel = {
  verified: '認証済み',
  pending: '認証待ち',
  rejected: '却下',
}

const verificationStyle = {
  verified: 'bg-success-50 text-success-700',
  pending: 'bg-warning-50 text-warning-700',
  rejected: 'bg-error-50 text-error-700',
}

export default function AdminProfessionalDetailPage() {
  const pro = mockProfessionals[0]

  return (
    <DashboardShell
      title="士業パートナー詳細"
      roleLabel="管理者"
      userName="Ouver運営"
      navItems={adminNav}
    >
      <Link href="/admin/professionals" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        士業管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* メイン情報 */}
        <div className="xl:col-span-2 space-y-6">
          {/* プロフィール */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold">{pro.name}</h2>
                <p className="text-sm text-neutral-400 mt-0.5">{pro.qualification} / {pro.registrationNumber}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${verificationStyle[pro.verificationStatus]}`}>
                {verificationIcon[pro.verificationStatus]}
                {verificationLabel[pro.verificationStatus]}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href={`mailto:${pro.email}`} className="text-primary-500 hover:underline">{pro.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400" />
                <a href={`tel:${pro.phone}`} className="hover:underline">{pro.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-400" />
                <span>{pro.officeName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>登録日: {pro.createdAt}</span>
              </div>
            </div>
          </div>

          {/* 紹介実績 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">紹介実績</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '紹介件数', value: pro.referralCount, unit: '件' },
                { label: '成約件数', value: pro.closedCount, unit: '件' },
                { label: '成約率', value: pro.referralCount > 0 ? Math.round((pro.closedCount / pro.referralCount) * 100) : 0, unit: '%' },
                { label: 'NW所属', value: pro.nwAffiliations.length, unit: '件' },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-400 mb-1">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}<span className="text-xs font-normal text-neutral-400 ml-0.5">{item.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* NW所属 */}
          {pro.nwAffiliations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-info-500" />
                ネットワーク所属
              </h3>
              <div className="flex flex-wrap gap-2">
                {pro.nwAffiliations.map((nw) => (
                  <span key={nw} className="px-3 py-1.5 text-xs font-medium bg-secondary-50 text-secondary-700 rounded-full">
                    {nw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* サイドバー: 管理操作 */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">管理操作</h3>
            <div className="space-y-3">
              {pro.verificationStatus === 'pending' && (
                <>
                  <button className="w-full px-4 py-2.5 text-sm font-medium text-white bg-success-500 rounded-xl hover:bg-success-600 transition-colors">
                    認証を承認する
                  </button>
                  <button className="w-full px-4 py-2.5 text-sm font-medium text-error-600 bg-error-50 border border-error-200 rounded-xl hover:bg-error-100 transition-colors">
                    認証を却下する
                  </button>
                </>
              )}
              {pro.verificationStatus === 'verified' && (
                <button className="w-full px-4 py-2.5 text-sm font-medium text-error-600 bg-error-50 border border-error-200 rounded-xl hover:bg-error-100 transition-colors">
                  認証を取り消す
                </button>
              )}
              <button className="w-full px-4 py-2.5 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                編集する
              </button>
            </div>
          </div>

          {/* 紹介クライアント */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              紹介クライアント
            </h3>
            <div className="space-y-3">
              {[
                { name: '中村 一郎', property: '練馬区 駅近マンション', status: '入札受付中' },
                { name: '小林 誠', property: '品川区 駅近オフィスビル', status: '公開' },
                { name: '加藤 裕子', property: '目黒区 一戸建て', status: '成約' },
              ].map((client) => (
                <div key={client.name} className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-sm font-medium">{client.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{client.property}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{client.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
