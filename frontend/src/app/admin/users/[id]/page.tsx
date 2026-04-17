'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Clock,
  Shield,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { ROLE_LABEL } from '@/data/mock-dashboard'
import { api } from '@/lib/api'

const roleStyle: Record<string, string> = {
  seller: 'bg-secondary-50 text-secondary-700',
  buyer: 'bg-info-50 text-info-700',
  professional: 'bg-warning-50 text-warning-700',
  broker: 'bg-primary-50 text-primary-700',
  admin: 'bg-neutral-100 text-neutral-700',
}

type UserDetail = {
  id: string
  name: string
  email: string
  role: string
  phone: string | null
  address: string | null
  createdAt: string
  updatedAt: string
  activity: {
    propertyCount: number
    bidCount: number
    caseCount: number
  }
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [suspending, setSuspending] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [roleUpdating, setRoleUpdating] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<UserDetail>(`/admin/users/${params.id}`)
      if (res.success) setUser(res.data)
      setLoading(false)
    }
    load()
  }, [params.id])

  const [suspended, setSuspended] = useState(false)

  const handleSuspend = async () => {
    if (!user) return
    setSuspending(true)
    const res = await api.patch(`/admin/users/${user.id}/status`, { status: 'suspended' })
    if (res.success) {
      setSuspended(true)
    }
    setSuspending(false)
  }

  if (loading) {
    return (
      <DashboardShell title="ユーザー詳細" roleLabel="管理者" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  if (!user) {
    return (
      <DashboardShell title="ユーザー詳細" roleLabel="管理者" navItems={adminNav}>
        <p className="text-sm text-neutral-400 text-center py-20">ユーザーが見つかりませんでした</p>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="ユーザー詳細"
      roleLabel="管理者"
      navItems={adminNav}
    >
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        ユーザー管理に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* プロフィール */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-neutral-400 mt-0.5">ID: {user.id}</p>
              </div>
              <span className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full ${roleStyle[user.role] ?? 'bg-neutral-100 text-neutral-700'}`}>
                {ROLE_LABEL[user.role] ?? user.role}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href={`mailto:${user.email}`} className="text-primary-500 hover:underline">{user.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>登録日: {user.createdAt?.slice(0, 10)}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">電話:</span>
                  <span>{user.phone}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">住所:</span>
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* アクティビティサマリ */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">アクティビティ</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-neutral-50 rounded-xl">
                <p className="price text-xl">{user.activity.propertyCount}</p>
                <p className="text-xs text-neutral-400 mt-1">登録物件</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-xl">
                <p className="price text-xl">{user.activity.bidCount}</p>
                <p className="text-xs text-neutral-400 mt-1">入札</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-xl">
                <p className="price text-xl">{user.activity.caseCount}</p>
                <p className="text-xs text-neutral-400 mt-1">案件</p>
              </div>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary-500" />
              ロール管理
            </h3>
            <div className="mb-4">
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">現在のロール</label>
              <select
                value={selectedRole || user.role}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
              >
                <option value="seller">売主</option>
                <option value="buyer">買い手</option>
                <option value="professional">士業</option>
                <option value="broker">業者</option>
                <option value="admin">管理者</option>
              </select>
            </div>
            <button
              onClick={async () => {
                const newRole = selectedRole || user.role
                if (newRole === user.role) return
                setRoleUpdating(true)
                const res = await api.patch(`/admin/users/${params.id}/role`, { role: newRole })
                if (res.success) {
                  setUser((prev) => prev ? { ...prev, role: newRole } : prev)
                }
                setRoleUpdating(false)
              }}
              disabled={roleUpdating || !selectedRole || selectedRole === user.role}
              className="w-full px-4 py-2.5 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-50"
            >
              {roleUpdating ? 'ロール変更中...' : 'ロールを変更する'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500" />
              アカウント操作
            </h3>
            <div className="space-y-3">
              {suspended ? (
                <div className="flex items-center gap-2 p-3 bg-warning-50 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-warning-500" />
                  <span className="text-sm text-warning-700">アカウントを停止しました</span>
                </div>
              ) : (
                <button
                  onClick={handleSuspend}
                  disabled={suspending}
                  className="w-full px-4 py-2.5 text-sm font-medium text-warning-600 bg-warning-50 border border-warning-200 rounded-xl hover:bg-warning-100 transition-colors disabled:opacity-50"
                >
                  {suspending ? '処理中...' : 'アカウントを停止する'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
