'use client'

import { useState, useEffect } from 'react'
import {
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { brokerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type CaseThread = {
  id: string
  propertyTitle: string
  sellerName: string
  status: string
  updatedAt: string
}

export default function BrokerMessagesPage() {
  const [threads, setThreads] = useState<CaseThread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/cases?role=broker')
      if (res.success) {
        setThreads(toItems<CaseThread>(res.data))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="メッセージ" roleLabel="提携業者" navItems={brokerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="メッセージ"
      roleLabel="提携業者"
      navItems={brokerNav}
    >
      {threads.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="メッセージはありません"
          description="案件が割り当てられると、ここでやり取りできます"
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card divide-y divide-neutral-100">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/broker/messages/${thread.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50/50 transition-colors"
            >
              <div className="shrink-0">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-neutral-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{thread.propertyTitle}</p>
                <p className="text-xs text-neutral-400 mt-0.5">売主: {thread.sellerName}</p>
              </div>
              <div className="shrink-0 text-right flex items-center gap-2">
                <span className="text-xs text-neutral-400">{formatDate(thread.updatedAt)}</span>
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
