'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import {
  Upload,
  Send,
  ArrowLeft,
  CheckCircle,
  Circle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { brokerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const statusSteps = [
  { key: 'broker_assigned', label: '業者割当済み' },
  { key: 'seller_contacted', label: '売主連絡済み' },
  { key: 'buyer_contacted', label: '買い手連絡済み' },
  { key: 'explanation_done', label: '重説完了' },
  { key: 'contract_signed', label: '契約締結' },
  { key: 'settlement_done', label: '決済完了' },
]

const DocUploadRow = ({ label, caseId }: { label: string; caseId: string }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', label)
    formData.append('caseId', caseId)
    const res = await api.upload(`/documents/upload`, formData)
    setUploading(false)
    if (res.success) setUploaded(true)
    e.target.value = ''
  }

  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
      <span className="text-sm">{label}</span>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleUpload} />
      {uploaded ? (
        <span className="inline-flex items-center gap-1.5 text-xs text-success-600 font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          アップロード済み
        </span>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-primary-500 bg-white border border-neutral-200 rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          アップロード
        </button>
      )}
    </div>
  )
}

type CaseDetail = {
  id: string
  propertyTitle: string
  propertyAddress: string
  sellerName: string
  buyerName: string
  brokerName: string
  status: string
  salePrice: number
  createdAt: string
  updatedAt: string
}

type CaseMessage = {
  id: string
  senderName: string
  senderRole: string
  content: string
  createdAt: string
}

export default function BrokerCaseDetailPage() {
  const params = useParams()
  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [messages, setMessages] = useState<CaseMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [caseRes, msgRes] = await Promise.all([
        api.get<CaseDetail>(`/cases/${params.id}`),
        api.get<unknown>(`/cases/${params.id}/messages`),
      ])
      if (caseRes.success) setCaseData(caseRes.data)
      if (msgRes.success) setMessages(toItems<CaseMessage>(msgRes.data))
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    setSending(true)
    const res = await api.post(`/cases/${params.id}/messages`, {
      content: messageText.trim(),
    })
    if (res.success) {
      setMessageText('')
      const msgRes = await api.get<unknown>(`/cases/${params.id}/messages`)
      if (msgRes.success) setMessages(toItems<CaseMessage>(msgRes.data))
    }
    setSending(false)
  }

  const handleUpdateStatus = async (nextStatus: string) => {
    setUpdating(true)
    const res = await api.patch(`/cases/${params.id}/status`, { status: nextStatus })
    if (res.success && caseData) {
      setCaseData({ ...caseData, status: nextStatus })
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <DashboardShell title="案件詳細" roleLabel="提携業者" navItems={brokerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  if (!caseData) {
    return (
      <DashboardShell title="案件詳細" roleLabel="提携業者" navItems={brokerNav}>
        <p className="text-sm text-neutral-400 text-center py-20">案件が見つかりませんでした</p>
      </DashboardShell>
    )
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === caseData.status)
  const amount = caseData.salePrice ? Math.round(caseData.salePrice / 10000) : 0

  return (
    <DashboardShell
      title="案件詳細"
      roleLabel="提携業者"
      navItems={brokerNav}
    >
      <Link href="/broker/cases" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
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
                <p className="price">{amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
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
                <button
                  onClick={() => handleUpdateStatus(statusSteps[currentStepIndex + 1].key)}
                  disabled={updating}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors disabled:opacity-50"
                >
                  {updating ? '更新中...' : `${statusSteps[currentStepIndex + 1].label}に更新`}
                </button>
              </div>
            )}
          </div>

          {/* 書類アップロード */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">書類アップロード</h3>
            <div className="space-y-3">
              {[
                { label: '重要事項説明書', required: currentStepIndex >= 3 },
                { label: '売買契約書', required: currentStepIndex >= 4 },
                { label: '決済完了証明書類', required: caseData.status === 'settlement_done' },
              ].map((doc) => (
                <DocUploadRow key={doc.label} label={doc.label} caseId={String(caseData.id)} />
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
            {messages.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">まだメッセージはありません</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{msg.senderName}</span>
                    <span className="text-xs text-neutral-400">({msg.senderRole})</span>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-3">
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{msg.createdAt?.slice(0, 16).replace('T', ' ')}</p>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="メッセージを入力..."
                className="flex-1 px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !messageText.trim()}
                className="p-2.5 text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
