'use client'

import {
  ArrowLeft,
  Mail,
  Clock,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { mockUsers, ROLE_LABEL } from '@/data/mock-dashboard'

const roleStyle: Record<string, string> = {
  seller: 'bg-secondary-50 text-secondary-700',
  buyer: 'bg-info-50 text-info-700',
  professional: 'bg-warning-50 text-warning-700',
  broker: 'bg-primary-50 text-primary-700',
  admin: 'bg-neutral-100 text-neutral-700',
}

export default function AdminUserDetailPage() {
  const user = mockUsers[0]

  return (
    <DashboardShell
      title="ユーザー詳細"
      roleLabel="管理者"
      userName="Ouver運営"
      navItems={adminNav}
    >
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        ユーザー管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* メイン情報 */}
        <div className="xl:col-span-2 space-y-6">
          {/* プロフィール */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-neutral-400 mt-0.5">ID: {user.id}</p>
              </div>
              <span className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full ${roleStyle[user.role]}`}>
                {ROLE_LABEL[user.role]}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href={`mailto:${user.email}`} className="text-primary-500 hover:underline">{user.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>登録日: {user.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>最終ログイン: {user.lastLoginAt}</span>
              </div>
            </div>
          </div>

          {/* アクティビティ */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">最近のアクティビティ</h3>
            <div className="space-y-3">
              {[
                { action: '物件を登録しました', target: '練馬区 駅近マンション 3LDK', date: '2026-04-10' },
                { action: '書類をアップロードしました', target: '登記事項証明書.pdf', date: '2026-04-10' },
                { action: '入札を確認しました', target: '株式会社山本不動産 3,600万円', date: '2026-04-14' },
                { action: 'ログインしました', target: '', date: '2026-04-15' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-primary-300 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    {activity.target && (
                      <p className="text-xs text-neutral-400 mt-0.5">{activity.target}</p>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400 shrink-0">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* ロール変更 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary-500" />
              ロール管理
            </h3>
            <div className="mb-4">
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">現在のロール</label>
              <select
                defaultValue={user.role}
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
              >
                <option value="seller">売主</option>
                <option value="buyer">買い手</option>
                <option value="professional">士業</option>
                <option value="broker">業者</option>
                <option value="admin">管理者</option>
              </select>
            </div>
            <button className="w-full px-4 py-2.5 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors">
              ロールを変更する
            </button>
          </div>

          {/* アカウント操作 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500" />
              アカウント操作
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2.5 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                パスワードリセット
              </button>
              <button className="w-full px-4 py-2.5 text-sm font-medium text-warning-600 bg-warning-50 border border-warning-200 rounded-xl hover:bg-warning-100 transition-colors">
                アカウントを停止する
              </button>
              <button className="w-full px-4 py-2.5 text-sm font-medium text-error-600 bg-error-50 border border-error-200 rounded-xl hover:bg-error-100 transition-colors">
                アカウントを削除する
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
