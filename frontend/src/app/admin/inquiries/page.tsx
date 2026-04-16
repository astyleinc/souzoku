'use client'

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

const statusConfig = {
  new: { label: '新規', icon: AlertCircle, className: 'bg-error-50 text-error-700' },
  in_progress: { label: '対応中', icon: MessageSquare, className: 'bg-info-50 text-info-700' },
  waiting: { label: '返信待ち', icon: Clock, className: 'bg-warning-50 text-warning-700' },
  resolved: { label: '解決済み', icon: CheckCircle, className: 'bg-success-50 text-success-700' },
}

const mockInquiries = [
  { id: 'inq1', subject: '物件の審査が遅れています', sender: '中村 一郎', category: '物件掲載', status: 'new' as const, assignee: '未割当', createdAt: '2026-04-16' },
  { id: 'inq2', subject: '入札金額の修正について', sender: '株式会社山本不動産', category: '入札', status: 'in_progress' as const, assignee: '管理者A', createdAt: '2026-04-15' },
  { id: 'inq3', subject: '紹介料の振込先を変更したい', sender: '山田 太郎', category: '支払い', status: 'waiting' as const, assignee: '管理者B', createdAt: '2026-04-14' },
  { id: 'inq4', subject: 'パスワードリセットができません', sender: '佐藤 花子', category: 'アカウント', status: 'in_progress' as const, assignee: '管理者A', createdAt: '2026-04-13' },
  { id: 'inq5', subject: '書類のアップロードエラー', sender: '田中 次郎', category: '書類', status: 'resolved' as const, assignee: '管理者B', createdAt: '2026-04-10' },
]

export default function AdminInquiriesPage() {
  return (
    <DashboardShell
      title="お問い合わせ管理"
      roleLabel="管理者"
      userName="管理者"
      navItems={adminNav}
    >
      {/* サマリ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: '新規', count: 1, className: 'text-error-500' },
          { label: '対応中', count: 2, className: 'text-info-500' },
          { label: '返信待ち', count: 1, className: 'text-warning-500' },
          { label: '解決済み', count: 1, className: 'text-success-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.className}`}>{s.count}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* フィルタ */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput placeholder="件名で検索" className="w-full sm:w-64" />
        <FilterSelect
          options={[
            { value: 'new', label: '新規' },
            { value: 'in_progress', label: '対応中' },
            { value: 'waiting', label: '返信待ち' },
            { value: 'resolved', label: '解決済み' },
          ]}
          placeholder="すべてのステータス"
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
        />
        <button className="px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors">
          検索
        </button>
      </div>

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
              {mockInquiries.map((inq) => {
                const sc = statusConfig[inq.status]
                return (
                  <tr key={inq.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                    <td className="py-3.5 px-5 font-medium">{inq.subject}</td>
                    <td className="py-3.5 px-5 text-neutral-500">{inq.sender}</td>
                    <td className="py-3.5 px-5 text-neutral-500">{inq.category}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.className}`}>
                        <sc.icon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-neutral-500">{inq.assignee}</td>
                    <td className="py-3.5 px-5 text-neutral-400">{inq.createdAt}</td>
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
        {mockInquiries.map((inq) => {
          const sc = statusConfig[inq.status]
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
                <span>{inq.sender}</span>
                <span>{inq.category}</span>
                <span>{inq.createdAt}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </DashboardShell>
  )
}
