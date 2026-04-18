'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Star,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Broker = {
  id: string
  companyName: string
  representativeName: string
  licenseNumber: string
  email: string
  phone: string
  totalDeals: number
  averageRating: number
  recentAverage: number | null
  recentCount: number
  lowRatingAlert: boolean
  createdAt: string
}

export default function AdminBrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/brokers')
      if (res.success) {
        setBrokers(toItems<Broker>(res.data))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="業者管理" roleLabel="管理画面" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="業者管理"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">{brokers.length}社</p>
        <Link
          href="/admin/brokers/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          業者を追加
        </Link>
      </div>

      {brokers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <p className="text-sm text-neutral-400">業者が登録されていません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {brokers.map((broker) => (
            <div key={broker.id} className={`bg-white rounded-2xl shadow-card p-5 ${broker.lowRatingAlert ? 'ring-1 ring-error-200' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold">{broker.companyName}</h3>
                    {broker.lowRatingAlert && (
                      <span
                        title={`直近${broker.recentCount}件の平均評価 ${broker.recentAverage?.toFixed(2) ?? '-'} が閾値3.0を下回っています`}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-error-50 text-error-700 text-[10px] font-medium"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        低評価
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{broker.representativeName}</p>
                </div>
                {broker.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning-500" />
                    <span className="price text-sm">{broker.averageRating}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">免許番号</span>
                  <span className="text-xs">{broker.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">累計成約</span>
                  <span className="price">{broker.totalDeals}件</span>
                </div>
                {broker.recentAverage !== null && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">直近{broker.recentCount}件の評価</span>
                    <span className={`price ${broker.lowRatingAlert ? 'text-error-600' : ''}`}>
                      {broker.recentAverage.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">メール</span>
                  <span className="text-xs truncate max-w-[160px]">{broker.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">電話</span>
                  <span className="text-xs">{broker.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">登録日</span>
                  <span className="text-xs">{formatDate(broker.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
                <Link
                  href={`/admin/brokers/${broker.id}`}
                  className="flex-1 py-1.5 text-xs font-medium text-primary-500 border border-primary-200 rounded-xl hover:bg-primary-50 transition-all duration-200 text-center"
                >
                  詳細
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
