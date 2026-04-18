'use client'

import { useState, useEffect } from 'react'
import {
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { sellerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Thread = {
  id: string
  propertyTitle: string
  brokerName: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export default function SellerMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/cases?role=seller')
      if (res.success) {
        const cases = toItems<Record<string, unknown>>(res.data)
        setThreads(
          cases.map((c) => ({
            id: String(c.id),
            propertyTitle: String(c.property_title ?? c.propertyTitle ?? ''),
            brokerName: String(c.broker_name ?? c.brokerName ?? '担当業者'),
            lastMessage: String(c.last_message ?? c.lastMessage ?? ''),
            lastMessageAt: String(c.last_message_at ?? c.lastMessageAt ?? c.updated_at ?? c.updatedAt ?? ''),
            unreadCount: Number(c.unread_count ?? c.unreadCount ?? 0),
          }))
        )
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="メッセージ" roleLabel="売主" navItems={sellerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="売主"
      navItems={sellerNav}
    >
      {threads.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="メッセージはありません"
          description="案件が開始すると、担当業者とのやり取りがここに表示されます"
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card divide-y divide-neutral-100">
          {threads.map((thread) => (
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
                  {thread.lastMessageAt.split(' ')[0]?.split('T')[0]}
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
