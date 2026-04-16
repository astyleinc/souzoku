'use client'

import { Search } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { mockUsers, ROLE_LABEL } from '@/data/mock-dashboard'

const roleStyle: Record<string, string> = {
  seller: 'bg-primary-50 text-primary-700',
  buyer: 'bg-cta-50 text-cta-700',
  professional: 'bg-secondary-50 text-secondary-700',
  broker: 'bg-info-50 text-info-700',
  admin: 'bg-neutral-100 text-neutral-700',
}

export default function AdminUsersPage() {
  return (
    <DashboardShell
      title="ユーザー管理"
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
              placeholder="氏名・メールで検索..."
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-neutral-50 focus:bg-white focus:border-primary-300 transition-colors"
            />
          </div>
          <select className="px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-neutral-50 focus:bg-white focus:border-primary-300 transition-colors">
            <option value="">すべてのロール</option>
            {Object.entries(ROLE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-neutral-400">{mockUsers.length}名</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">氏名</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">メール</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">ロール</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">登録日</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">最終ログイン</th>
                <th className="text-left py-3.5 px-5 text-xs text-neutral-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-neutral-600">
                          {user.name.slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-neutral-500">{user.email}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${roleStyle[user.role]}`}>
                      {ROLE_LABEL[user.role]}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-neutral-500">{user.createdAt}</td>
                  <td className="py-3.5 px-5 text-neutral-500">{user.lastLoginAt}</td>
                  <td className="py-3.5 px-5">
                    <button className="text-xs text-primary-500 hover:underline">詳細</button>
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
