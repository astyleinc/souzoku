'use client'

import {
  Send,
  ArrowLeft,
  Paperclip,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { buyerNav } from '@/config/navigation'
import { mockMessageThreads, mockCaseMessages } from '@/data/mock-dashboard'

export default function BuyerMessageDetailPage() {
  const thread = mockMessageThreads[0]

  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
    >
      <Link href="/buyer/messages" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        メッセージ一覧に戻る
      </Link>

      <div className="bg-white rounded-2xl shadow-card mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold">{thread.propertyTitle}</h2>
          <p className="text-xs text-neutral-400 mt-0.5">担当業者: 東京中央不動産株式会社</p>
        </div>

        {/* メッセージ一覧 */}
        <div className="px-5 py-4 space-y-5 max-h-[500px] overflow-y-auto">
          {[
            { id: 'bm1', senderName: '松本 大輝', senderRole: '業者', content: 'ご入札ありがとうございます。物件に関してご質問がございましたらお気軽にどうぞ。', createdAt: '2026-04-08 10:00' },
            { id: 'bm2', senderName: '株式会社山本不動産', senderRole: '買い手', content: '内見の日程を調整させてください。来週火曜日か水曜日の午後は可能でしょうか。', createdAt: '2026-04-08 14:30' },
            { id: 'bm3', senderName: '松本 大輝', senderRole: '業者', content: '来週水曜日の14時でいかがでしょうか。現地でお待ちしております。', createdAt: '2026-04-09 09:00' },
            { id: 'bm4', senderName: '株式会社山本不動産', senderRole: '買い手', content: '水曜14時で承知しました。当日よろしくお願いいたします。', createdAt: '2026-04-09 10:30' },
          ].map((msg) => {
            const isSelf = msg.senderRole === '買い手'
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
