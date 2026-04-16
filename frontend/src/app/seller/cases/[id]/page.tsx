'use client'

import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Phone,
  Mail,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { mockCases, CASE_STATUS_LABEL } from '@/data/mock-dashboard'

const statusSteps = [
  { key: 'broker_assigned', label: '業者割当済み' },
  { key: 'seller_contacted', label: '売主連絡済み' },
  { key: 'buyer_contacted', label: '買い手連絡済み' },
  { key: 'explanation_done', label: '重説完了' },
  { key: 'contract_signed', label: '契約締結' },
  { key: 'settlement_done', label: '決済完了' },
]

export default function SellerCaseDetailPage() {
  const caseData = mockCases[0]
  const currentStepIndex = statusSteps.findIndex((s) => s.key === caseData.status)

  return (
    <DashboardShell
      title="案件詳細"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <Link href="/seller/cases" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        案件一覧に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 案件概要 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold mb-4">{caseData.propertyTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-1">所在地</p>
                <p>{caseData.propertyAddress}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">成約額</p>
                <p className="price">{caseData.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">買い手</p>
                <p>{caseData.buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">案件開始日</p>
                <p>{caseData.createdAt}</p>
              </div>
            </div>
          </div>

          {/* ステータス進行 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">進捗ステータス</h3>
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

          {/* 手続きの説明 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">今後の流れ</h3>
            <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
              <p>担当の仲介業者が売買手続きを進めます。各ステップの完了時に通知でお知らせします。</p>
              <ul className="list-disc pl-5 space-y-1 text-neutral-500">
                <li>重要事項説明（重説）は業者から日程調整の連絡があります</li>
                <li>契約締結時に売買契約書への署名が必要です</li>
                <li>決済完了後、所有権が買い手に移転されます</li>
              </ul>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 担当業者 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">担当仲介業者</h3>
            <p className="text-sm font-medium">{caseData.brokerName}</p>
            <p className="text-xs text-neutral-400 mt-1">担当: 松本 大輝</p>
            <div className="mt-3 space-y-2">
              <p className="text-xs text-neutral-400">
                ご不明な点はメッセージからお問い合わせください
              </p>
              <Link
                href="/seller/messages"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                メッセージを送る
              </Link>
            </div>
          </div>

          {/* 重要な日程 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">重要な日程</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">案件開始</span>
                <span>{caseData.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">最終更新</span>
                <span>{caseData.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
