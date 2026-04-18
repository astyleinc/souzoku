'use client'

import { useState, useEffect } from 'react'
import {
  Mail,
  Phone,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { professionalNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Client = {
  id: string
  name: string
  email: string
  phone: string
  latestPropertyTitle: string
  latestPropertyStatus: string
  propertyCount: number
  nwRoute: string
  referredAt: string
}

const statusLabel: Record<string, string> = {
  reviewing: '審査待ち',
  published: '公開',
  bidding: '入札受付中',
  closed: '成約',
}

const statusStyle: Record<string, string> = {
  reviewing: 'bg-neutral-50 text-neutral-600 border border-neutral-300',
  published: 'bg-primary-500 text-white',
  bidding: 'bg-cta-500 text-white',
  closed: 'bg-success-500 text-white',
}

export default function ProfessionalClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/referrals/me/clients')
      if (res.success) {
        setClients(toItems<Client>(res.data))
      } else {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="紹介クライアント" roleLabel="士業パートナー" navItems={professionalNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="紹介クライアント"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">{clients.length}名</p>
        <Link
          href="/professional/clients/new"
          className="px-4 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors shrink-0"
        >
          代理登録
        </Link>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="紹介クライアントはまだいません"
          description="紹介リンクを共有して売主を紹介すると、ここに表示されます"
        />
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">
                紹介クライアント（{clients.length}名）
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">売主名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">最新物件</th>
                    <th className="text-center py-3 px-5 text-xs text-neutral-400 font-medium">物件数</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">紹介経路</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">紹介日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">連絡先</th>
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5 font-medium">{client.name}</td>
                      <td className="py-3.5 px-5">
                        <p className="text-neutral-600 truncate max-w-[200px]">{client.latestPropertyTitle}</p>
                      </td>
                      <td className="py-3.5 px-5 text-center price">{client.propertyCount}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[client.latestPropertyStatus] ?? 'bg-neutral-100 text-neutral-500'}`}>
                          {statusLabel[client.latestPropertyStatus] ?? client.latestPropertyStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-neutral-400">{client.nwRoute}</td>
                      <td className="py-3.5 px-5 text-neutral-400">{formatDate(client.referredAt)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <a href={`mailto:${client.email}`} className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <Mail className="w-4 h-4" />
                          </a>
                          <a href={`tel:${client.phone}`} className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <Link href={`/professional/clients/${client.id}`} className="text-xs text-primary-500 hover:underline font-medium">
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            {clients.map((client) => (
              <div key={client.id} className="bg-white rounded-2xl shadow-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5 truncate">{client.latestPropertyTitle}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusStyle[client.latestPropertyStatus] ?? 'bg-neutral-100 text-neutral-500'}`}>
                    {statusLabel[client.latestPropertyStatus] ?? client.latestPropertyStatus}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-neutral-400">
                  <span>物件数: {client.propertyCount}</span>
                  <span>{client.nwRoute}</span>
                  <span>{formatDate(client.referredAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
