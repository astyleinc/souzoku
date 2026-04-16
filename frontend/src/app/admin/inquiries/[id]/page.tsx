'use client'

import {
  ArrowLeft,
  Send,
  User,
  Shield,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'

const inquiry = {
  id: 'inq2',
  subject: '入札金額の修正について',
  sender: '株式会社山本不動産',
  senderEmail: 'yamamoto@example.com',
  category: '入札',
  status: 'in_progress' as const,
  assignee: '管理者A',
  createdAt: '2026-04-15 10:30',
}

const messages = [
  { id: 'm1', author: '株式会社山本不動産', role: 'user', content: '先日、物件#P-015に対して3,600万円で入札しましたが、金額を3,800万円に修正したいです。入札画面から変更できないのですが、方法を教えていただけますか？', createdAt: '2026-04-15 10:30', isInternal: false },
  { id: 'm2', author: '管理者A', role: 'admin', content: 'お問い合わせありがとうございます。入札期間中であれば、入札詳細ページの「入札金額を更新」ボタンから変更が可能です。\n\nもし表示されない場合は、ブラウザのキャッシュをクリアしてお試しください。', createdAt: '2026-04-15 14:20', isInternal: false },
  { id: 'm3', author: '管理者A', role: 'admin', content: '念のため、入札システムのログを確認。ユーザーのセッションは正常。UI側の問題の可能性あり。', createdAt: '2026-04-15 14:25', isInternal: true },
]

export default function AdminInquiryDetailPage() {
  return (
    <DashboardShell
      title="お問い合わせ詳細"
      roleLabel="管理者"
      userName="管理者"
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
              <span>送信者: {inquiry.sender}</span>
              <span>カテゴリ: {inquiry.category}</span>
              <span>受付: {inquiry.createdAt}</span>
            </div>
          </div>

          {/* スレッド */}
          <div className="space-y-4">
            {messages.map((msg) => (
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
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="reply-type" defaultChecked className="text-primary-500" />
                <span className="text-sm">返信</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="reply-type" className="text-primary-500" />
                <span className="text-sm">内部メモ</span>
              </label>
            </div>
            <textarea
              rows={4}
              placeholder="返信を入力..."
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white resize-none"
            />
            <div className="flex justify-end mt-3">
              <button className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors">
                <Send className="w-4 h-4" />
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
            <select className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white mb-3">
              <option value="new">新規</option>
              <option value="in_progress" selected>対応中</option>
              <option value="waiting">返信待ち</option>
              <option value="resolved">解決済み</option>
            </select>
            <h3 className="text-base font-semibold mb-3 mt-4">担当者</h3>
            <select className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
              <option value="">未割当</option>
              <option value="admin-a" selected>管理者A</option>
              <option value="admin-b">管理者B</option>
            </select>
          </div>

          {/* 送信者情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">送信者情報</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-neutral-400">名前</p>
                <p className="font-medium">{inquiry.sender}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">メール</p>
                <p>{inquiry.senderEmail}</p>
              </div>
            </div>
          </div>

          {/* タイムライン */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">対応履歴</h3>
            <div className="space-y-3">
              {[
                { action: '管理者Aが返信', time: '2026-04-15 14:20' },
                { action: '管理者Aに割当', time: '2026-04-15 11:00' },
                { action: '問い合わせ受付', time: '2026-04-15 10:30' },
              ].map((event) => (
                <div key={event.time} className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs">{event.action}</p>
                    <p className="text-xs text-neutral-400">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
