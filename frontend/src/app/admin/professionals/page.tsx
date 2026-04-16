'use client'

import {
  Search,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { mockProfessionals, VERIFICATION_STATUS_LABEL } from '@/data/mock-dashboard'

const verificationStatusStyle: Record<string, string> = {
  pending: 'bg-warning-50 text-warning-700',
  verified: 'bg-success-50 text-success-700',
  rejected: 'bg-error-50 text-error-700',
}

const verificationIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  verified: <CheckCircle className="w-3.5 h-3.5" />,
  rejected: <XCircle className="w-3.5 h-3.5" />,
}

export default function AdminProfessionalsPage() {
  return (
    <DashboardShell
      title="士業管理"
      roleLabel="管理画面"
      userName="田中 太郎"
      navItems={adminNav}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="氏名・事務所名で検索..."
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl w-72 bg-neutral-50 focus:bg-white focus:border-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select className="px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
            <option value="">すべての認証状態</option>
            <option value="pending">認証待ち</option>
            <option value="verified">認証済み</option>
            <option value="rejected">却下</option>
          </select>
          <select className="px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
            <option value="">すべての資格</option>
            <option value="tax">税理士</option>
            <option value="judicial">司法書士</option>
            <option value="administrative">行政書士</option>
          </select>
        </div>
        <p className="text-sm text-neutral-400">{mockProfessionals.length}名</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">氏名</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">資格</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">事務所名</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">NW</th>
                <th className="text-center py-3.5 px-5 text-xs text-neutral-400 font-medium">紹介</th>
                <th className="text-center py-3.5 px-5 text-xs text-neutral-400 font-medium">成約</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">認証</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockProfessionals.map((p) => (
                <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                  <td className="py-3.5 px-5">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.email}</p>
                  </td>
                  <td className="py-3.5 px-5 text-neutral-500">{p.qualification}</td>
                  <td className="py-3.5 px-5 text-neutral-500">{p.officeName}</td>
                  <td className="py-3.5 px-5">
                    {p.nwAffiliations.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {p.nwAffiliations.map((nw) => (
                          <span key={nw} className="text-xs bg-secondary-50 text-secondary-700 px-1.5 py-0.5 rounded">
                            {nw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400">なし</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-center price">{p.referralCount}</td>
                  <td className="py-3.5 px-5 text-center price">{p.closedCount}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${verificationStatusStyle[p.verificationStatus]}`}>
                      {verificationIcon[p.verificationStatus]}
                      {VERIFICATION_STATUS_LABEL[p.verificationStatus]}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      {p.verificationStatus === 'pending' && (
                        <>
                          <button className="text-xs text-success-500 hover:underline font-medium">認証</button>
                          <button className="text-xs text-error-500 hover:underline font-medium">却下</button>
                        </>
                      )}
                      <button className="text-xs text-primary-500 hover:underline">詳細</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
