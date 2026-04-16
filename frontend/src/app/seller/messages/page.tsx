'use client'

import {
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { sellerNav } from '@/config/navigation'

const sellerThreads = [
  { id: 'smt1', caseId: 'c1', propertyTitle: '大田区 商業地の一戸建て', brokerName: '東京中央不動産株式会社', lastMessage: '重要事項説明の日程は来週水曜日14時でよろしいでしょうか。', lastMessageAt: '2026-04-14 10:00', unreadCount: 1 },
]

export default function SellerMessagesPage() {
  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="売主"
      navItems={sellerNav}
    >
      {sellerThreads.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="メッセージはありません"
          description="案件が開始すると、担当業者とのやり取りがここに表示されます"
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card divide-y divide-neutral-100">
          {sellerThreads.map((thread) => (
            <Link
              key={thread.id}
              href={`/seller/messages/${thread.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50/50 transition-colors"
            >
              <div className="shrink-0">
                {thread.unreadCount > 0 ? (
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4.5 h-4.5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4.5 h-4.5 text-neutral-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm truncate ${thread.unreadCount > 0 ? 'font-semibold' : 'font-medium'}`}>
                    {thread.propertyTitle}
                  </p>
                  {thread.unreadCount > 0 && (
                    <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-error-500 rounded-full">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  担当: {thread.brokerName}
                </p>
                <p className={`text-sm mt-1 truncate ${thread.unreadCount > 0 ? 'text-foreground' : 'text-neutral-400'}`}>
                  {thread.lastMessage}
                </p>
              </div>

              <div className="shrink-0 text-right flex items-center gap-2">
                <span className="text-xs text-neutral-400">
                  {thread.lastMessageAt.split(' ')[0]}
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
