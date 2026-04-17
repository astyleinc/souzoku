'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Globe,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type NwCompany = {
  id: string
  name: string
  contactEmail: string | null
  contactPhone: string | null
  isActive: boolean
  affiliatedCount: number
  createdAt: string
}

export default function AdminNwCompaniesPage() {
  const [companies, setCompanies] = useState<NwCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/admin/nw-companies')
      if (res.success) setCompanies(toItems<NwCompany>(res.data))
      setLoading(false)
    }
    load()
  }, [])

  const handleToggleActive = async (id: string, current: boolean) => {
    const res = await api.patch(`/admin/nw-companies/${id}`, { isActive: !current })
    if (res.success) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !current } : c))
      )
    }
  }

  if (loading) {
    return (
      <DashboardShell title="NW会社マスタ" roleLabel="管理画面" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="NW会社マスタ" roleLabel="管理画面" navItems={adminNav}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">{companies.length}社</p>
        <Link
          href="/admin/nw-companies/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          NW会社を追加
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <Globe className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">NW会社が登録されていません</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">会社名</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">連絡先メール</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">電話</th>
                  <th className="text-center py-3 px-5 text-xs text-neutral-400 font-medium">所属士業数</th>
                  <th className="text-center py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">登録日</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                    <td className="py-3.5 px-5 font-medium">{c.name}</td>
                    <td className="py-3.5 px-5 text-neutral-500">{c.contactEmail ?? '-'}</td>
                    <td className="py-3.5 px-5 text-neutral-500">{c.contactPhone ?? '-'}</td>
                    <td className="py-3.5 px-5 text-center price">{c.affiliatedCount}</td>
                    <td className="py-3.5 px-5 text-center">
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-success-50 text-success-700 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          有効
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-500 rounded-full">
                          <XCircle className="w-3 h-3" />
                          無効
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-neutral-400">{c.createdAt?.slice(0, 10)}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/nw-companies/${c.id}/edit`}
                          className="text-xs text-primary-500 hover:underline font-medium"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleToggleActive(c.id, c.isActive)}
                          className={`text-xs font-medium ${c.isActive ? 'text-warning-500 hover:text-warning-600' : 'text-success-500 hover:text-success-600'}`}
                        >
                          {c.isActive ? '無効化' : '有効化'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
