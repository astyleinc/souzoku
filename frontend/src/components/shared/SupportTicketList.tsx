'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Clock,
  CheckCircle,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { api, toItems } from '@/lib/api'
import { formatDate } from '@/lib/format'

type SupportTicket = {
  id: string
  subject: string
  category: string
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  open: { label: '受付済み', icon: Clock, className: 'bg-warning-50 text-warning-700' },
  in_progress: { label: '対応中', icon: MessageSquare, className: 'bg-info-50 text-info-700' },
  resolved: { label: '解決済み', icon: CheckCircle, className: 'bg-success-50 text-success-700' },
}

type SupportTicketListProps = {
  contactHref: string
}

export const SupportTicketList = ({ contactHref }: SupportTicketListProps) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/support/tickets')
      if (res.success) {
        setTickets(toItems<SupportTicket>(res.data))
      } else {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
      </div>
    )
  }

  return (
    <div>
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      {/* ヘッダー操作 */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">お問い合わせ {tickets.length}件</p>
        <Link
          href={contactHref}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規問い合わせ
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <MessageSquare className="w-8 h-8 text-neutral-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-500">お問い合わせ履歴はありません</p>
          <p className="text-xs text-neutral-400 mt-1">ご質問があれば、お気軽にお問い合わせください。</p>
        </div>
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">カテゴリ</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">送信日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">最終更新</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => {
                    const sc = statusConfig[ticket.status] ?? statusConfig.open
                    return (
                      <tr key={ticket.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                        <td className="py-3.5 px-5 font-medium">{ticket.subject}</td>
                        <td className="py-3.5 px-5 text-neutral-500">{ticket.category}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.className}`}>
                            <sc.icon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-neutral-400">{formatDate(ticket.createdAt)}</td>
                        <td className="py-3.5 px-5 text-neutral-400">{formatDate(ticket.updatedAt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            {tickets.map((ticket) => {
              const sc = statusConfig[ticket.status] ?? statusConfig.open
              return (
                <div key={ticket.id} className="bg-white rounded-2xl shadow-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{ticket.subject}</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${sc.className}`}>
                      <sc.icon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                    <span>{ticket.category}</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
