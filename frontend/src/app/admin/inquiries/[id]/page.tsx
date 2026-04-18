'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Send,
  User,
  Shield,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type InquiryDetail = {
  id: string
  subject: string
  senderName: string
  senderEmail: string
  category: string
  status: string
  assigneeName: string | null
  assigneeId: string | null
  createdAt: string
  messages: {
    id: string
    author: string
    role: string
    content: string
    createdAt: string
    isInternal: boolean
  }[]
}

export default function AdminInquiryDetailPage() {
  const params = useParams()
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [replyType, setReplyType] = useState<'reply' | 'note'>('reply')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInquiry = async () => {
    const res = await api.get<InquiryDetail>(`/admin/inquiries/${params.id}`)
    if (res.success) setInquiry(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchInquiry()
  }, [params.id])

  const handleSend = async () => {
    if (!replyText.trim()) return
    setSending(true)
    setError(null)

    const endpoint = replyType === 'note'
      ? `/admin/inquiries/${params.id}/notes`
      : `/admin/inquiries/${params.id}/reply`

    const res = await api.post(endpoint, { body: replyText.trim() })
    if (res.success) {
      setReplyText('')
      await fetchInquiry()
    } else {
      setError(res.error?.message ?? '送信に失敗しました')
    }
    setSending(false)
  }

  const handleStatusChange = async (status: string) => {
    const res = await api.patch(`/admin/inquiries/${params.id}/status`, { status })
    if (res.success && inquiry) {
      setInquiry({ ...inquiry, status })
    }
  }

  if (loading) {
    return (
      <DashboardShell title="お問い合わせ詳細" roleLabel="管理者" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  if (!inquiry) {
    return (
      <DashboardShell title="お問い合わせ詳細" roleLabel="管理者" navItems={adminNav}>
        <div className="flex items-center gap-2 p-4 bg-error-50 rounded-xl">
          <AlertCircle className="w-5 h-5 text-error-500" />
          <span className="text-sm text-error-700">お問い合わせが見つかりませんでした</span>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="お問い合わせ詳細"
      roleLabel="管理者"
      navItems={adminNav}
    >
      <Link href="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        一覧に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 件名 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold mb-2">{inquiry.subject}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
              <span>送信者: {inquiry.senderName}</span>
              <span>カテゴリ: {inquiry.category}</span>
              <span>受付: {inquiry.createdAt}</span>
            </div>
          </div>

          {/* スレッド */}
          <div className="space-y-4">
            {inquiry.messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl shadow-card p-5 ${
                  msg.isInternal ? 'border-l-4 border-warning-300' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    msg.role === 'admin' ? 'bg-primary-50' : 'bg-neutral-100'
                  }`}>
                    {msg.role === 'admin' ? (
                      <Shield className="w-3.5 h-3.5 text-primary-500" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{msg.author}</span>
                  {msg.isInternal && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-warning-50 text-warning-700 rounded-full">
                      内部メモ
                    </span>
                  )}
                  <span className="text-xs text-neutral-400 ml-auto">{msg.createdAt}</span>
                </div>
                <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line pl-9">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* 返信フォーム */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            {error && (
              <div className="flex items-center gap-2 p-2 mb-3 text-xs text-error-700 bg-error-50 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="reply-type"
                  checked={replyType === 'reply'}
                  onChange={() => setReplyType('reply')}
                  className="text-primary-500"
                />
                <span className="text-sm">返信</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="reply-type"
                  checked={replyType === 'note'}
                  onChange={() => setReplyType('note')}
                  className="text-primary-500"
                />
                <span className="text-sm">内部メモ</span>
              </label>
            </div>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={replyType === 'reply' ? '返信を入力...' : '内部メモを入力...'}
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSend}
                disabled={!replyText.trim() || sending}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                送信
              </button>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* ステータス */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">ステータス</h3>
            <select
              value={inquiry.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white mb-3"
            >
              <option value="new">新規</option>
              <option value="in_progress">対応中</option>
              <option value="waiting_reply">返信待ち</option>
              <option value="resolved">解決済み</option>
            </select>
            <h3 className="text-base font-semibold mb-3 mt-4">担当者</h3>
            <p className="text-sm text-neutral-600">{inquiry.assigneeName ?? '未割当'}</p>
          </div>

          {/* 送信者情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">送信者情報</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-neutral-400">名前</p>
                <p className="font-medium">{inquiry.senderName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">メール</p>
                <p>{inquiry.senderEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
