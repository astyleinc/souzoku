'use client'

import {
  Send,
  ArrowLeft,
  Paperclip,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'

export default function ProfessionalMessageDetailPage() {
  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={professionalNav}
    >
      <Link href="/professional/messages" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        メッセージ一覧に戻る
      </Link>

      <div className="bg-white rounded-2xl shadow-card mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold">中村 一郎</h2>
          <p className="text-xs text-neutral-400 mt-0.5">練馬区 駅近マンション 3LDK</p>
        </div>

        <div className="px-5 py-4 space-y-5 max-h-[500px] overflow-y-auto">
          {[
            { id: 'pm1', senderName: '山田 太郎', senderRole: '士業', content: '中村様、物件登録の代理手続きが完了しました。審査結果をお待ちください。', createdAt: '2026-03-01 10:00' },
            { id: 'pm2', senderName: 'Ouver運営', senderRole: '管理者', content: '物件の審査が完了し、公開されました。入札受付が開始されます。', createdAt: '2026-03-03 14:00' },
            { id: 'pm3', senderName: '中村 一郎', senderRole: '売主', content: 'ありがとうございます。入札が入ったらまたご連絡いただけますか。', createdAt: '2026-03-03 16:00' },
            { id: 'pm4', senderName: '山田 太郎', senderRole: '士業', content: '書類の確認が完了しました。ご質問があればお知らせください。', createdAt: '2026-04-15 10:00' },
          ].map((msg) => {
            const isSelf = msg.senderRole === '士業'
            return (
              <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{msg.senderName}</span>
                  <span className="text-xs text-neutral-400">({msg.senderRole})</span>
                </div>
                <div className={`max-w-[80%] rounded-xl p-3 ${isSelf ? 'bg-primary-50' : msg.senderRole === '管理者' ? 'bg-info-50' : 'bg-neutral-50'}`}>
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
