'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Star,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type Broker = {
  id: string
  companyName: string
  representativeName: string
  licenseNumber: string
  email: string
  phone: string
  totalDeals: number
  averageRating: number
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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
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
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors">
          <Plus className="w-4 h-4" />
          業者を追加
        </button>
      </div>

      {brokers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <p className="text-sm text-neutral-400">業者が登録されていません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {brokers.map((broker) => (
            <div key={broker.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">{broker.companyName}</h3>
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
                  <span className="text-xs">{broker.createdAt?.slice(0, 10)}</span>
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
