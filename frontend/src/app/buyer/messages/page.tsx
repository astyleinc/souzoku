'use client'

import {
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { buyerNav } from '@/config/navigation'
import { mockMessageThreads } from '@/data/mock-dashboard'

export default function BuyerMessagesPage() {
  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
    >
      {mockMessageThreads.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="メッセージはありません"
          description="入札後、業者とのやり取りがここに表示されます"
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card divide-y divide-neutral-100">
          {mockMessageThreads.map((thread) => (
            <Link
              key={thread.id}
              href={`/buyer/messages/${thread.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50/50 transition-colors"
            >
              {/* 未読インジケーター */}
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

              {/* 内容 */}
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
                <p className={`text-sm mt-1 truncate ${thread.unreadCount > 0 ? 'text-foreground' : 'text-neutral-400'}`}>
                  {thread.lastMessage}
                </p>
              </div>

              {/* 日時 + 矢印 */}
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
