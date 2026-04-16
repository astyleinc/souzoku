'use client'

import {
  Send,
  ArrowLeft,
  Paperclip,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { brokerNav } from '@/config/navigation'
import { mockMessageThreads, mockCaseMessages } from '@/data/mock-dashboard'

export default function BrokerMessageDetailPage() {
  const thread = mockMessageThreads[0]

  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="提携業者"
      userName="松本 大輝"
      navItems={brokerNav}
    >
      <Link href="/broker/messages" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        メッセージ一覧に戻る
      </Link>

      {/* スレッド情報 */}
      <div className="bg-white rounded-2xl shadow-card mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold">{thread.propertyTitle}</h2>
          <p className="text-xs text-neutral-400 mt-0.5">買い手: {thread.buyerName}</p>
        </div>

        {/* メッセージ一覧 */}
        <div className="px-5 py-4 space-y-5 max-h-[500px] overflow-y-auto">
          {mockCaseMessages.map((msg) => {
            const isSelf = msg.senderRole === '業者'
            return (
              <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{msg.senderName}</span>
                  <span className="text-xs text-neutral-400">({msg.senderRole})</span>
                </div>
                <div className={`max-w-[80%] rounded-xl p-3 ${isSelf ? 'bg-primary-50' : 'bg-neutral-50'}`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{msg.createdAt}</p>
              </div>
            )
          })}
        </div>

        {/* 入力エリア */}
        <div className="px-5 py-4 border-t border-neutral-100">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                rows={2}
                placeholder="メッセージを入力..."
                className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
              />
              <div className="flex items-center gap-3 mt-2">
                <button className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                  <Paperclip className="w-3.5 h-3.5" />
                  ファイルを添付
                </button>
              </div>
            </div>
            <button className="p-2.5 text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
