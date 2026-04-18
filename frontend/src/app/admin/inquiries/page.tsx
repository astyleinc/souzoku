'use client'

import { useState, useEffect } from 'react'
import {
  Clock,
  CheckCircle,
  MessageSquare,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SearchInput } from '@/components/shared/SearchInput'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Inquiry = {
  id: string
  subject: string
  senderName: string
  category: string
  status: string
  assigneeName: string | null
  createdAt: string
}

const statusConfig: Record<string, { label: string; icon: typeof AlertCircle; className: string }> = {
  new: { label: '新規', icon: AlertCircle, className: 'bg-error-50 text-error-700' },
  open: { label: '新規', icon: AlertCircle, className: 'bg-error-50 text-error-700' },
  in_progress: { label: '対応中', icon: MessageSquare, className: 'bg-info-50 text-info-700' },
  waiting: { label: '返信待ち', icon: Clock, className: 'bg-warning-50 text-warning-700' },
  waiting_reply: { label: '返信待ち', icon: Clock, className: 'bg-warning-50 text-warning-700' },
  resolved: { label: '解決済み', icon: CheckCircle, className: 'bg-success-50 text-success-700' },
  closed: { label: '解決済み', icon: CheckCircle, className: 'bg-success-50 text-success-700' },
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const fetchInquiries = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (statusFilter) params.set('status', statusFilter)
    if (categoryFilter) params.set('category', categoryFilter)
    const qs = params.toString()
    const res = await api.get<unknown>(`/admin/inquiries${qs ? `?${qs}` : ''}`)
    if (res.success) setInquiries(toItems<Inquiry>(res.data))
    setLoading(false)
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const statusCounts = inquiries.reduce<Record<string, number>>((acc, inq) => {
    acc[inq.status] = (acc[inq.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <DashboardShell
      title="お問い合わせ管理"
      roleLabel="管理者"
      navItems={adminNav}
    >
      {/* サマリ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: '新規', keys: ['new', 'open'], className: 'text-error-500' },
          { label: '対応中', keys: ['in_progress'], className: 'text-info-500' },
          { label: '返信待ち', keys: ['waiting', 'waiting_reply'], className: 'text-warning-500' },
          { label: '解決済み', keys: ['resolved', 'closed'], className: 'text-success-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.className}`}>{s.keys.reduce((sum, k) => sum + (statusCounts[k] ?? 0), 0)}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* フィルタ */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput
          placeholder="件名で検索"
          className="w-full sm:w-64"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <FilterSelect
          options={[
            { value: 'new', label: '新規' },
            { value: 'in_progress', label: '対応中' },
            { value: 'waiting', label: '返信待ち' },
            { value: 'resolved', label: '解決済み' },
          ]}
          placeholder="すべてのステータス"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <FilterSelect
          options={[
            { value: '物件掲載', label: '物件掲載' },
            { value: '入札', label: '入札' },
            { value: '支払い', label: '支払い' },
            { value: 'アカウント', label: 'アカウント' },
            { value: '書類', label: '書類' },
          ]}
          placeholder="すべてのカテゴリ"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        <button
          onClick={fetchInquiries}
          className="px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
        >
          検索
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">送信者</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">カテゴリ</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">担当者</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">受付日</th>
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => {
                    const sc = statusConfig[inq.status] ?? statusConfig.new
                    return (
                      <tr key={inq.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                        <td className="py-3.5 px-5 font-medium">{inq.subject}</td>
                        <td className="py-3.5 px-5 text-neutral-500">{inq.senderName}</td>
                        <td className="py-3.5 px-5 text-neutral-500">{inq.category}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.className}`}>
                            <sc.icon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-neutral-500">{inq.assigneeName ?? '未割当'}</td>
                        <td className="py-3.5 px-5 text-neutral-400">{inq.createdAt?.slice(0, 10)}</td>
                        <td className="py-3.5 px-5">
                          <Link href={`/admin/inquiries/${inq.id}`} className="text-xs text-primary-500 hover:underline font-medium">
                            詳細
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            {inquiries.map((inq) => {
              const sc = statusConfig[inq.status] ?? statusConfig.new
              return (
                <Link key={inq.id} href={`/admin/inquiries/${inq.id}`} className="block bg-white rounded-2xl shadow-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{inq.subject}</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${sc.className}`}>
                      <sc.icon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-neutral-400">
                    <span>{inq.senderName}</span>
                    <span>{inq.category}</span>
                    <span>{inq.createdAt?.slice(0, 10)}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
