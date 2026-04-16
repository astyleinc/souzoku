'use client'

import { useState, useEffect } from 'react'
import { Loader2, Users } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { professionalNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type Referral = {
  id: string
  propertyTitle: string
  propertyAddress: string
  sellerName: string
  askingPrice: number
  bidCount: number
  nwCompanyName: string | null
  status: string
  createdAt: string
}

export default function ProfessionalReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/referrals/me')
      if (res.success) {
        setReferrals(toItems<Referral>(res.data))
      } else {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="紹介案件" roleLabel="士業パートナー" navItems={professionalNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="紹介案件"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      {referrals.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <Users className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">紹介案件はまだありません</p>
        </div>
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">売主</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">価格</th>
                    <th className="text-center py-3 px-5 text-xs text-neutral-400 font-medium">入札数</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">NW</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">紹介日</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <p className="font-medium truncate max-w-[200px]">{r.propertyTitle}</p>
                        <p className="text-xs text-neutral-400">{r.propertyAddress}</p>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">{r.sellerName}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="price">{Math.round(r.askingPrice / 10000).toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 ml-1">万円</span>
                      </td>
                      <td className="py-3.5 px-5 text-center price">{r.bidCount}</td>
                      <td className="py-3.5 px-5 text-xs text-neutral-400">
                        {r.nwCompanyName ?? '直接紹介'}
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="py-3.5 px-5 text-neutral-400">{r.createdAt?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            {referrals.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.propertyTitle}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{r.propertyAddress}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                  <span>売主: {r.sellerName}</span>
                  <span>{r.nwCompanyName ? 'NW経由' : '直接'}</span>
                  <span className="ml-auto price text-sm text-foreground">{Math.round(r.askingPrice / 10000).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
