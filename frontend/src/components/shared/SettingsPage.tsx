'use client'

import { useState, useEffect } from 'react'
import {
  User,
  Bell,
  Lock,
  Save,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import type { NavItem } from '@/config/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/AuthProvider'

type SettingsPageProps = {
  roleLabel: string
  navItems: NavItem[]
}

type Profile = {
  name: string
  email: string
  phone: string | null
}

export const SettingsPage = ({ roleLabel, navItems }: SettingsPageProps) => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // パスワード変更
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMessage, setPwMessage] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<Profile>('/users/me')
      if (res.success) {
        setProfile(res.data)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setError(null)
    setSaved(false)

    const res = await api.put('/users/me', {
      name: profile.name,
      phone: profile.phone,
    })

    if (res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError('保存に失敗しました')
    }
    setSaving(false)
  }

  const handlePasswordChange = async () => {
    setPwError(null)
    setPwMessage(null)

    if (newPassword.length < 8) {
      setPwError('新しいパスワードは8文字以上で設定してください')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('新しいパスワードが一致しません')
      return
    }

    setPwSaving(true)
    const res = await api.put('/users/me/password', {
      currentPassword,
      newPassword,
    })

    if (res.success) {
      setPwMessage('パスワードを変更しました')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPwError('現在のパスワードが正しくありません')
    }
    setPwSaving(false)
  }

  const rolePath = user?.role === 'admin' ? '/admin' : `/${user?.role ?? 'seller'}`

  if (loading) {
    return (
      <DashboardShell title="設定" roleLabel={roleLabel} navItems={navItems}>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="設定" roleLabel={roleLabel} navItems={navItems}>
      <div className="max-w-3xl space-y-6">
        {/* プロフィール */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold">プロフィール</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">基本情報を管理します</p>

          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-600 mb-1.5 block">お名前</label>
              <input
                type="text"
                value={profile?.name ?? ''}
                onChange={(e) => setProfile((p) => p ? { ...p, name: e.target.value } : p)}
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 bg-white transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 mb-1.5 block">メールアドレス</label>
              <input
                type="email"
                value={profile?.email ?? ''}
                disabled
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-400"
              />
              <p className="text-xs text-neutral-400 mt-1">メールアドレスの変更はサポートにお問い合わせください</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 mb-1.5 block">電話番号</label>
              <input
                type="tel"
                value={profile?.phone ?? ''}
                onChange={(e) => setProfile((p) => p ? { ...p, phone: e.target.value } : p)}
                placeholder="03-1234-5678"
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-neutral-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              保存
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-success-500">
                <CheckCircle className="w-4 h-4" />
                保存しました
              </span>
            )}
          </div>
        </div>

        {/* セキュリティ */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-neutral-500" />
            <h2 className="text-base font-semibold">パスワード変更</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">パスワードを変更します</p>

          {pwError && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
              {pwError}
            </div>
          )}
          {pwMessage && (
            <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-xl text-sm text-success-600">
              {pwMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-600 mb-1.5 block">現在のパスワード</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="現在のパスワードを入力"
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 mb-1.5 block">新しいパスワード</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8文字以上"
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 mb-1.5 block">新しいパスワード（確認）</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="もう一度入力"
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100">
            <button
              onClick={handlePasswordChange}
              disabled={pwSaving || !currentPassword || !newPassword}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-neutral-700 hover:bg-neutral-800 rounded-xl transition-colors disabled:opacity-60"
            >
              {pwSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              パスワードを変更
            </button>
          </div>
        </div>

        {/* 危険な操作 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold text-error-600 mb-1">アカウント</h2>
          <p className="text-sm text-neutral-400 mb-4">アカウントの削除やセキュリティログの確認</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`${rolePath}/settings/security-log`}
              className="text-sm text-primary-500 hover:underline"
            >
              セキュリティログ →
            </Link>
            <Link
              href={`${rolePath}/settings/delete-account`}
              className="text-sm text-error-500 hover:underline"
            >
              アカウント削除 →
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
