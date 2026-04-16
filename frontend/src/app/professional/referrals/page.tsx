'use client'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { professionalNav } from '@/config/navigation'
import { mockProperties } from '@/data/mock'

const sellerNames = ['中村 一郎', '小林 誠', '加藤 裕子', '佐々木 恵', '渡辺 健', '石田 美咲']

export default function ProfessionalReferralsPage() {
  return (
    <DashboardShell
      title="紹介案件"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={professionalNav}
    >
      {/* フィルタ */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
          <option value="">すべてのステータス</option>
          <option value="reviewing">審査待ち</option>
          <option value="published">公開</option>
          <option value="bidding">入札受付中</option>
          <option value="closed">成約</option>
        </select>
        <select className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
          <option value="">すべてのNW</option>
          <option value="awaka">awaka cross</option>
          <option value="direct">直接紹介</option>
        </select>
      </div>

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
              {mockProperties.slice(0, 6).map((p, i) => (
                <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                  <td className="py-3.5 px-5">
                    <p className="font-medium truncate max-w-[200px]">{p.title}</p>
                    <p className="text-xs text-neutral-400">{p.address}</p>
                  </td>
                  <td className="py-3.5 px-5 text-neutral-500">{sellerNames[i]}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="price">{p.price.toLocaleString()}</span>
                    <span className="text-xs text-neutral-400 ml-1">万円</span>
                  </td>
                  <td className="py-3.5 px-5 text-center price">{p.bidCount}</td>
                  <td className="py-3.5 px-5 text-xs text-neutral-400">
                    {i % 2 === 0 ? 'awaka cross' : '直接紹介'}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3.5 px-5 text-neutral-400">{p.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モバイル: カード */}
      <div className="lg:hidden space-y-3">
        {mockProperties.slice(0, 6).map((p, i) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{p.address}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
              <span>売主: {sellerNames[i]}</span>
              <span>{i % 2 === 0 ? 'NW経由' : '直接'}</span>
              <span className="ml-auto price text-sm text-foreground">{p.price.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
