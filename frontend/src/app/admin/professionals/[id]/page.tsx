'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
  History,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type ProfessionalDetail = {
  id: string
  name: string
  qualification: string
  registrationNumber: string
  email: string
  phone: string
  officeName: string
  verificationStatus: 'verified' | 'pending' | 'rejected'
  referralCount: number
  closedCount: number
  createdAt: string
}

type NwAffiliation = {
  id: string
  companyName: string
}

type ReferralClient = {
  id: string
  name: string
  propertyTitle: string
  status: string
}

type HistoryEntry = {
  id: string
  fieldName: string
  oldValue: string | null
  newValue: string | null
  changedAt: string
}

const HISTORY_FIELD_LABEL: Record<string, string> = {
  officeName: '所属事務所',
  employmentType: '就業形態',
  payoutMethod: '報酬支払先',
  payoutAccount: '報酬支払口座',
}

const verificationLabel: Record<string, string> = {
  verified: '認証済み',
  pending: '認証待ち',
  rejected: '却下',
}

const verificationStyle: Record<string, string> = {
  verified: 'bg-success-50 text-success-700',
  pending: 'bg-warning-50 text-warning-700',
  rejected: 'bg-error-50 text-error-700',
}

const VerificationIcon = ({ status }: { status: string }) => {
  if (status === 'verified') return <CheckCircle className="w-4 h-4 text-success-500" />
  if (status === 'pending') return <Clock className="w-4 h-4 text-warning-500" />
  return <XCircle className="w-4 h-4 text-error-500" />
}

export default function AdminProfessionalDetailPage() {
  const params = useParams()
  const [pro, setPro] = useState<ProfessionalDetail | null>(null)
  const [nwAffiliations, setNwAffiliations] = useState<NwAffiliation[]>([])
  const [clients, setClients] = useState<ReferralClient[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const [proRes, nwRes, historyRes] = await Promise.all([
        api.get<unknown>(`/admin-ext/users/${params.id}`),
        api.get<unknown>(`/professionals/${params.id}/nw`).catch(() => ({ success: false, data: [] })),
        api.get<unknown>(`/professionals/${params.id}/history`).catch(() => ({ success: false, data: [] })),
      ])
      if (proRes.success) setPro(proRes.data as ProfessionalDetail)
      if (nwRes.success) setNwAffiliations(toItems<NwAffiliation>(nwRes.data))
      if (historyRes.success) setHistory(toItems<HistoryEntry>(historyRes.data))
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <DashboardShell title="士業パートナー詳細" roleLabel="管理者" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  if (!pro) {
    return (
      <DashboardShell title="士業パートナー詳細" roleLabel="管理者" navItems={adminNav}>
        <p className="text-sm text-neutral-400 text-center py-20">士業パートナーが見つかりませんでした</p>
      </DashboardShell>
    )
  }

  const conversionRate = pro.referralCount > 0 ? Math.round((pro.closedCount / pro.referralCount) * 100) : 0

  const handleVerification = async (status: 'verified' | 'rejected') => {
    setActionLoading(true)
    setActionError(null)
    const res = await api.patch(`/admin/professionals/${params.id}/verification`, { status })
    if (res.success) {
      setPro((prev) => prev ? { ...prev, verificationStatus: status } : prev)
    } else {
      setActionError(status === 'verified' ? '承認に失敗しました' : '却下に失敗しました')
    }
    setActionLoading(false)
  }

  return (
    <DashboardShell
      title="士業パートナー詳細"
      roleLabel="管理者"
      navItems={adminNav}
    >
      <Link href="/admin/professionals" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        士業管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* プロフィール */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold">{pro.name}</h2>
                <p className="text-sm text-neutral-400 mt-0.5">{pro.qualification} / {pro.registrationNumber}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${verificationStyle[pro.verificationStatus] ?? 'bg-neutral-100 text-neutral-500'}`}>
                <VerificationIcon status={pro.verificationStatus} />
                {verificationLabel[pro.verificationStatus] ?? pro.verificationStatus}
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
                <span>登録日: {pro.createdAt?.slice(0, 10)}</span>
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
                { label: '成約率', value: conversionRate, unit: '%' },
                { label: 'NW所属', value: nwAffiliations.length, unit: '件' },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-400 mb-1">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}<span className="text-xs font-normal text-neutral-400 ml-0.5">{item.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* 変更履歴 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-500" />
              変更履歴
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-neutral-400">変更履歴はまだありません</p>
            ) : (
              <ul className="space-y-3">
                {history.slice().reverse().map((h) => (
                  <li key={h.id} className="flex items-start gap-3 text-sm border-l-2 border-neutral-100 pl-3">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-700">
                        {HISTORY_FIELD_LABEL[h.fieldName] ?? h.fieldName}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        <span className="text-neutral-400">{h.oldValue ?? '(未設定)'}</span>
                        <span className="mx-1.5 text-neutral-300">→</span>
                        <span>{h.newValue ?? '(未設定)'}</span>
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">{new Date(h.changedAt).toLocaleString('ja-JP')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* NW所属 */}
          {nwAffiliations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-info-500" />
                ネットワーク所属
              </h3>
              <div className="flex flex-wrap gap-2">
                {nwAffiliations.map((nw) => (
                  <span key={nw.id} className="px-3 py-1.5 text-xs font-medium bg-secondary-50 text-secondary-700 rounded-full">
                    {nw.companyName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">管理操作</h3>
            {actionError && (
              <div className="mb-3 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
                {actionError}
              </div>
            )}
            <div className="space-y-3">
              {pro.verificationStatus === 'pending' && (
                <>
                  <button
                    onClick={() => handleVerification('verified')}
                    disabled={actionLoading}
                    className="w-full px-4 py-2.5 text-sm font-medium text-white bg-success-500 rounded-xl hover:bg-success-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? '処理中...' : '認証を承認する'}
                  </button>
                  <button
                    onClick={() => handleVerification('rejected')}
                    disabled={actionLoading}
                    className="w-full px-4 py-2.5 text-sm font-medium text-error-600 bg-error-50 border border-error-200 rounded-xl hover:bg-error-100 transition-colors disabled:opacity-50"
                  >
                    認証を却下する
                  </button>
                </>
              )}
              {pro.verificationStatus === 'verified' && (
                <button
                  onClick={() => handleVerification('rejected')}
                  disabled={actionLoading}
                  className="w-full px-4 py-2.5 text-sm font-medium text-error-600 bg-error-50 border border-error-200 rounded-xl hover:bg-error-100 transition-colors disabled:opacity-50"
                >
                  認証を取り消す
                </button>
              )}
              <Link
                href={`/admin/professionals/${params.id}/edit`}
                className="block w-full px-4 py-2.5 text-sm font-medium text-center text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                編集する
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              紹介クライアント
            </h3>
            <p className="text-sm text-neutral-400">クライアント情報はクライアント一覧から確認できます</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
