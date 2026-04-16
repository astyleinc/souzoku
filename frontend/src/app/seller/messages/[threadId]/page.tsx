'use client'

import {
  Send,
  ArrowLeft,
  Paperclip,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'

export default function SellerMessageDetailPage() {
  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <Link href="/seller/messages" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        メッセージ一覧に戻る
      </Link>

      <div className="bg-white rounded-2xl shadow-card mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold">大田区 商業地の一戸建て</h2>
          <p className="text-xs text-neutral-400 mt-0.5">担当: 東京中央不動産株式会社</p>
        </div>

        <div className="px-5 py-4 space-y-5 max-h-[500px] overflow-y-auto">
          {[
            { id: 'sm1', senderName: '松本 大輝', senderRole: '業者', content: '中村様、このたびは成約おめでとうございます。仲介手続きを担当いたします東京中央不動産の松本です。今後の進め方についてご説明させてください。', createdAt: '2026-04-03 10:00' },
            { id: 'sm2', senderName: '中村 一郎', senderRole: '売主', content: 'よろしくお願いいたします。まずはどのような手続きが必要でしょうか。', createdAt: '2026-04-03 14:00' },
            { id: 'sm3', senderName: '松本 大輝', senderRole: '業者', content: 'まず買い手様との内見を調整し、その後重要事項説明、契約締結と進めていきます。重要事項説明の日程は来週水曜日14時でよろしいでしょうか。', createdAt: '2026-04-14 10:00' },
          ].map((msg) => {
            const isSelf = msg.senderRole === '売主'
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
