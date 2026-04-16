'use client'

import {
  Upload,
  Send,
  ArrowLeft,
  CheckCircle,
  Circle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { brokerNav } from '@/config/navigation'
import { mockCases, mockCaseMessages } from '@/data/mock-dashboard'

const statusSteps = [
  { key: 'broker_assigned', label: '業者割当済み' },
  { key: 'seller_contacted', label: '売主連絡済み' },
  { key: 'buyer_contacted', label: '買い手連絡済み' },
  { key: 'explanation_done', label: '重説完了' },
  { key: 'contract_signed', label: '契約締結' },
  { key: 'settlement_done', label: '決済完了' },
]

export default function BrokerCaseDetailPage() {
  const caseData = mockCases[0]
  const currentStepIndex = statusSteps.findIndex((s) => s.key === caseData.status)

  return (
    <DashboardShell
      title="案件詳細"
      roleLabel="提携業者"
      userName="松本 大輝"
      navItems={brokerNav}
    >
      <Link href="/broker/cases" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        案件一覧に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* メイン情報 */}
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
                <p className="text-xs text-neutral-400 mb-1">売主</p>
                <p>{caseData.sellerName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">買い手</p>
                <p>{caseData.buyerName}</p>
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
                      <span className="text-xs text-cta-500 font-medium ml-auto">現在のステータス</span>
                    )}
                  </div>
                )
              })}
            </div>

            {currentStepIndex < statusSteps.length - 1 && (
              <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <p className="text-sm text-neutral-400">次のステータスへ進める:</p>
                <button className="px-4 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors">
                  {statusSteps[currentStepIndex + 1].label}に更新
                </button>
              </div>
            )}
          </div>

          {/* 書類アップロード */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">書類アップロード</h3>
            <div className="space-y-3">
              {[
                { label: '重要事項説明書', required: caseData.status === 'explanation_done' || statusSteps.findIndex((s) => s.key === caseData.status) >= 3 },
                { label: '売買契約書', required: statusSteps.findIndex((s) => s.key === caseData.status) >= 4 },
                { label: '決済完了証明書類', required: caseData.status === 'settlement_done' },
              ].map((doc) => (
                <div key={doc.label} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-sm">{doc.label}</span>
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-primary-500 bg-white border border-neutral-200 rounded-xl hover:bg-primary-50 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    アップロード
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* やり取り */}
        <div className="bg-white rounded-2xl shadow-card flex flex-col h-fit max-h-[600px]">
          <div className="px-5 py-4">
            <h3 className="text-base font-semibold">やり取り</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            {mockCaseMessages.map((msg) => (
              <div key={msg.id}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{msg.senderName}</span>
                  <span className="text-xs text-neutral-400">({msg.senderRole})</span>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{msg.createdAt}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="メッセージを入力..."
                className="flex-1 px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
              />
              <button className="p-2.5 text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
