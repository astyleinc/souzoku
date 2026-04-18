'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Send,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { brokerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type CaseMessage = {
  id: string
  senderName: string
  senderRole: string
  content: string
  createdAt: string
}

type CaseInfo = {
  propertyTitle: string
  sellerName: string
}

export default function BrokerMessageDetailPage() {
  const params = useParams()
  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null)
  const [messages, setMessages] = useState<CaseMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [caseRes, msgRes] = await Promise.all([
        api.get<CaseInfo>(`/cases/${params.threadId}`),
        api.get<unknown>(`/cases/${params.threadId}/messages`),
      ])
      if (caseRes.success) setCaseInfo(caseRes.data)
      if (msgRes.success) setMessages(toItems<CaseMessage>(msgRes.data))
      if (!caseRes.success && !msgRes.success) setFetchError(true)
      setLoading(false)
    }
    load()
  }, [params.threadId])

  const handleSend = async () => {
    if (!text.trim()) return
    setSending(true)
    const res = await api.post(`/cases/${params.threadId}/messages`, { content: text.trim() })
    if (res.success) {
      setText('')
      const msgRes = await api.get<unknown>(`/cases/${params.threadId}/messages`)
      if (msgRes.success) setMessages(toItems<CaseMessage>(msgRes.data))
    }
    setSending(false)
  }

  if (loading) {
    return (
      <DashboardShell title="メッセージ" roleLabel="提携業者" navItems={brokerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="提携業者"
      navItems={brokerNav}
    >
      <Link href="/broker/messages" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        メッセージ一覧に戻る
      </Link>

      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold">{caseInfo?.propertyTitle}</h2>
          <p className="text-xs text-neutral-400 mt-0.5">売主: {caseInfo?.sellerName}</p>
        </div>

        <div className="px-5 py-4 space-y-5 max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">まだメッセージはありません</p>
          ) : (
            messages.map((msg) => {
              const isSelf = msg.senderRole === '業者' || msg.senderRole === 'broker'
              return (
                <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{msg.senderName}</span>
                    <span className="text-xs text-neutral-400">({msg.senderRole})</span>
                  </div>
                  <div className={`max-w-[80%] rounded-xl p-3 ${isSelf ? 'bg-primary-50' : 'bg-neutral-50'}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{msg.createdAt?.slice(0, 16).replace('T', ' ')}</p>
                </div>
              )
            })
          )}
        </div>

        <div className="px-5 py-4 border-t border-neutral-100">
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              rows={2}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
            />
            <button
              onClick={handleSend}
              disabled={sending || !text.trim()}
              className="p-2.5 text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
