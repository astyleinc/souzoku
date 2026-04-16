'use client'

import {
  Mail,
  Phone,
  Building2,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SearchInput } from '@/components/shared/SearchInput'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { EmptyState } from '@/components/shared/EmptyState'
import { professionalNav } from '@/config/navigation'
import { mockProfessionalClients } from '@/data/mock-dashboard'

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
  return (
    <DashboardShell
      title="紹介クライアント"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={professionalNav}
    >
      {/* ヘッダー操作 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput placeholder="クライアント名で検索" className="w-full sm:w-64" />
          <FilterSelect
            options={[
              { value: 'awaka', label: 'awaka cross' },
              { value: 'direct', label: '直接紹介' },
            ]}
            placeholder="すべての経路"
          />
          <button className="px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors">
            検索
          </button>
        </div>
        <Link
          href="/professional/clients/new"
          className="px-4 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors shrink-0"
        >
          代理登録
        </Link>
      </div>

      {mockProfessionalClients.length === 0 ? (
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
                紹介クライアント（{mockProfessionalClients.length}名）
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
                  {mockProfessionalClients.map((client) => (
                    <tr key={client.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5 font-medium">{client.name}</td>
                      <td className="py-3.5 px-5">
                        <p className="text-neutral-600 truncate max-w-[200px]">{client.latestPropertyTitle}</p>
                      </td>
                      <td className="py-3.5 px-5 text-center price">{client.propertyCount}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[client.latestPropertyStatus] ?? ''}`}>
                          {statusLabel[client.latestPropertyStatus] ?? client.latestPropertyStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-neutral-400">{client.nwRoute}</td>
                      <td className="py-3.5 px-5 text-neutral-400">{client.referredAt}</td>
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
            <h2 className="text-base font-semibold mb-3">
              紹介クライアント（{mockProfessionalClients.length}名）
            </h2>
            {mockProfessionalClients.map((client) => (
              <div key={client.id} className="bg-white rounded-2xl shadow-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5 truncate">{client.latestPropertyTitle}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusStyle[client.latestPropertyStatus] ?? ''}`}>
                    {statusLabel[client.latestPropertyStatus] ?? client.latestPropertyStatus}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-neutral-400">
                  <span>物件数: {client.propertyCount}</span>
                  <span>{client.nwRoute}</span>
                  <span>{client.referredAt}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                  <a
                    href={`mailto:${client.email}`}
                    className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {client.email}
                  </a>
                  <a
                    href={`tel:${client.phone}`}
                    className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 ml-auto"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {client.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
