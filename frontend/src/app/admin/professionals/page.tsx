'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { VERIFICATION_STATUS_LABEL } from '@/data/mock-dashboard'
import { api, toItems } from '@/lib/api'

type Professional = {
  id: string
  name: string
  email: string
  qualification: string
  officeName: string
  nwAffiliations: string[]
  referralCount: number
  closedCount: number
  verificationStatus: string
}

const verificationStatusStyle: Record<string, string> = {
  pending: 'bg-warning-50 text-warning-700',
  auto_verified: 'bg-success-50 text-success-700',
  manually_verified: 'bg-success-50 text-success-700',
  rejected: 'bg-error-50 text-error-700',
}

export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchProfessionals = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (statusFilter) params.set('verificationStatus', statusFilter)
    const res = await api.get<unknown>(`/admin/professionals?${params.toString()}`)
    if (res.success) {
      setProfessionals(toItems<Professional>(res.data))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfessionals()
  }, [])

  return (
    <DashboardShell
      title="士業管理"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProfessionals()}
              placeholder="氏名・事務所名で検索..."
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl w-72 bg-neutral-50 focus:bg-white focus:border-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
          >
            <option value="">すべての認証状態</option>
            <option value="pending">認証待ち</option>
            <option value="auto_verified">認証済み</option>
            <option value="rejected">却下</option>
          </select>
          <button
            onClick={fetchProfessionals}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors"
          >
            検索
          </button>
        </div>
        <p className="text-sm text-neutral-400">{professionals.length}名</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      ) : professionals.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <Users className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">士業が見つかりませんでした</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">氏名</th>
                  <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">資格</th>
                  <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">事務所名</th>
                  <th className="text-center py-3.5 px-5 text-xs text-neutral-400 font-medium">紹介</th>
                  <th className="text-center py-3.5 px-5 text-xs text-neutral-400 font-medium">成約</th>
                  <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">認証</th>
                  <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((p) => (
                  <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                    <td className="py-3.5 px-5">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-neutral-400">{p.email}</p>
                    </td>
                    <td className="py-3.5 px-5 text-neutral-500">{p.qualification}</td>
                    <td className="py-3.5 px-5 text-neutral-500">{p.officeName}</td>
                    <td className="py-3.5 px-5 text-center price">{p.referralCount}</td>
                    <td className="py-3.5 px-5 text-center price">{p.closedCount}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${verificationStatusStyle[p.verificationStatus] ?? 'bg-neutral-100 text-neutral-500'}`}>
                        {VERIFICATION_STATUS_LABEL[p.verificationStatus] ?? p.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <Link href={`/admin/professionals/${p.id}`} className="text-xs text-primary-500 hover:underline font-medium">
                        詳細
                      </Link>
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
