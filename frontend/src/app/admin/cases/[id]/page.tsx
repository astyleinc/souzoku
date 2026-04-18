'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  Users,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CaseStatusBadge } from '@/components/shared/CaseStatusBadge'
import { adminNav } from '@/config/navigation'
import { CASE_STATUS_LABEL } from '@/data/mock-dashboard'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type CaseDetail = {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  salePrice: number
  brokerId: string
  brokerName: string
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  status: string
  explanationDocUrl: string | null
  contractDocUrl: string | null
  settlementDocUrl: string | null
  cancelReason: string | null
  createdAt: string
  updatedAt: string
}

const statusSteps = [
  { key: 'broker_assigned', label: '業者割当済み' },
  { key: 'seller_contacted', label: '売主連絡済み' },
  { key: 'buyer_contacted', label: '買い手連絡済み' },
  { key: 'explanation_done', label: '重説完了' },
  { key: 'contract_signed', label: '契約締結' },
  { key: 'settlement_done', label: '決済完了' },
]

const toMan = (yen: number) => Math.round(yen / 10000)

export default function AdminCaseDetailPage() {
  const params = useParams()
  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const loadCase = async () => {
    const res = await api.get<CaseDetail>(`/cases/${params.id}`)
    if (res.success) setCaseData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    loadCase()
  }, [params.id])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!caseData) return
    setStatusUpdating(true)
    setActionError(null)
    const res = await api.patch(`/cases/${caseData.id}/status`, { status: newStatus })
    if (res.success) {
      setCaseData((prev) => prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : prev)
    } else {
      setActionError(res.error?.message ?? 'ステータス更新に失敗しました')
    }
    setStatusUpdating(false)
  }

  const handleCancel = async () => {
    if (!caseData) return
    setStatusUpdating(true)
    setActionError(null)
    const res = await api.patch(`/cases/${caseData.id}/status`, { status: 'cancelled' })
    if (res.success) {
      setCaseData((prev) => prev ? { ...prev, status: 'cancelled' } : prev)
    } else {
      setActionError(res.error?.message ?? '中止に失敗しました')
    }
    setStatusUpdating(false)
  }

  if (loading) {
    return (
      <DashboardShell title="案件詳細" roleLabel="管理画面" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  if (!caseData) {
    return (
      <DashboardShell title="案件詳細" roleLabel="管理画面" navItems={adminNav}>
        <p className="text-sm text-neutral-400 text-center py-20">案件が見つかりませんでした</p>
      </DashboardShell>
    )
  }

  const currentStepIdx = statusSteps.findIndex((s) => s.key === caseData.status)
  const isCancelled = caseData.status === 'cancelled'
  const isCompleted = caseData.status === 'settlement_done'
  const nextStatus = !isCancelled && !isCompleted && currentStepIdx < statusSteps.length - 1
    ? statusSteps[currentStepIdx + 1]
    : null

  return (
    <DashboardShell title="案件詳細" roleLabel="管理画面" navItems={adminNav}>
      <Link href="/admin/cases" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        案件管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 物件情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold">{caseData.propertyTitle}</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">{caseData.propertyAddress}</p>
                </div>
              </div>
              <CaseStatusBadge status={caseData.status} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">成約金額</p>
                <p className="price font-semibold">{toMan(caseData.salePrice).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">作成日</p>
                <p>{caseData.createdAt?.slice(0, 10)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">最終更新</p>
                <p>{caseData.updatedAt?.slice(0, 10)}</p>
              </div>
            </div>
          </div>

          {/* 進捗タイムライン */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-5">進捗タイムライン</h3>
            <div className="relative">
              {statusSteps.map((step, i) => {
                const isActive = i <= currentStepIdx && !isCancelled
                const isCurrent = step.key === caseData.status
                return (
                  <div key={step.key} className="flex items-start gap-4 pb-6 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-success-500' : 'bg-neutral-200'
                      }`}>
                        {isActive ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs text-neutral-400 font-medium">{i + 1}</span>
                        )}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-6 mt-1 ${isActive && i < currentStepIdx ? 'bg-success-300' : 'bg-neutral-200'}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-foreground' : isActive ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && !isCancelled && (
                        <span className="text-xs text-primary-500 font-medium">現在のステータス</span>
                      )}
                    </div>
                  </div>
                )
              })}
              {isCancelled && (
                <div className="flex items-start gap-4 pt-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-error-500 shrink-0">
                    <XCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium text-error-600">案件中止</p>
                    {caseData.cancelReason && (
                      <p className="text-xs text-neutral-500 mt-0.5">理由: {caseData.cancelReason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 書類 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-400" />
              案件書類
            </h3>
            <div className="space-y-3">
              {[
                { label: '重要事項説明書', url: caseData.explanationDocUrl, step: 'explanation_done' },
                { label: '売買契約書', url: caseData.contractDocUrl, step: 'contract_signed' },
                { label: '決済関連書類', url: caseData.settlementDocUrl, step: 'settlement_done' },
              ].map((doc) => (
                <div key={doc.label} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm">{doc.label}</span>
                  </div>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline font-medium">
                      確認
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-300">未アップロード</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 関係者 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-400" />
              関係者
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">売主</p>
                <p className="font-medium">{caseData.sellerName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">買い手</p>
                <p className="font-medium">{caseData.buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">担当業者</p>
                <p className="font-medium">{caseData.brokerName}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2">
              <Link href={`/admin/properties/${caseData.propertyId}`} className="block text-xs text-primary-500 hover:underline">
                物件詳細を見る
              </Link>
            </div>
          </div>

          {/* ステータス管理 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">ステータス管理</h3>
            {actionError && (
              <div className="mb-3 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
                {actionError}
              </div>
            )}

            {isCompleted && (
              <p className="text-sm text-success-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                この案件は決済完了しています
              </p>
            )}

            {isCancelled && (
              <p className="text-sm text-error-600 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                この案件は中止されています
              </p>
            )}

            {nextStatus && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">
                  現在: {(CASE_STATUS_LABEL as Record<string, string>)[caseData.status] ?? caseData.status}
                </p>
                <button
                  onClick={() => handleStatusUpdate(nextStatus.key)}
                  disabled={statusUpdating}
                  className="w-full py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {statusUpdating ? '更新中...' : `「${nextStatus.label}」に進める`}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={statusUpdating}
                  className="w-full py-2.5 text-sm font-medium text-error-600 bg-error-50 border border-error-200 rounded-xl hover:bg-error-100 transition-colors disabled:opacity-50"
                >
                  案件を中止する
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
