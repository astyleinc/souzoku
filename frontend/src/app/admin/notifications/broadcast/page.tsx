'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Send,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'

export default function AdminNotificationBroadcastPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    targetRoles: [] as string[],
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    message: '',
  })

  const toggleRole = (role: string) =>
    setForm((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.targetRoles.length === 0) {
      setError('送信先ロールを1つ以上選択してください')
      return
    }
    if (!form.message.trim()) {
      setError('メッセージを入力してください')
      return
    }
    setError(null)
    setSending(true)

    // 現状のAPIは target を単一指定のため、選択ロールごとに順次送信
    const titleMap = {
      info: 'お知らせ',
      success: '完了のお知らせ',
      warning: '注意喚起',
      error: '重要なお知らせ',
    } as const
    const allRoles = ['seller', 'buyer', 'professional', 'broker']
    const isAll = form.targetRoles.length === allRoles.length

    const targets: Array<'all' | 'seller' | 'buyer' | 'professional' | 'broker'> =
      isAll ? ['all'] : (form.targetRoles as Array<'seller' | 'buyer' | 'professional' | 'broker'>)

    let failure: string | null = null
    for (const target of targets) {
      const res = await api.post('/admin/notifications/broadcast', {
        target,
        title: titleMap[form.type],
        body: form.message,
        channel: 'system',
      })
      if (!res.success) {
        failure = res.error.message
        break
      }
    }

    setSending(false)
    if (failure) {
      setError(failure)
    } else {
      setSent(true)
    }
  }

  return (
    <DashboardShell title="通知を送信" roleLabel="管理画面" navItems={adminNav}>
      <Link href="/admin/notifications" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        通知一覧に戻る
      </Link>

      <div className="max-w-2xl">
        {sent ? (
          <div className="bg-white rounded-2xl shadow-card p-10 text-center">
            <CheckCircle className="w-12 h-12 text-success-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">通知を送信しました</h2>
            <p className="text-sm text-neutral-400 mb-6">
              {form.targetRoles.length}つのロールに通知が配信されます。
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setSent(false); setForm({ targetRoles: [], type: 'info', message: '' }) }}
                className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                続けて送信
              </button>
              <Link href="/admin/notifications" className="px-4 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors">
                通知一覧に戻る
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-error-50 text-error-600 text-sm rounded-xl">{error}</div>
            )}

            <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
              {/* 送信先ロール */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">
                  送信先ロール <span className="text-error-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'seller', label: '売主' },
                    { key: 'buyer', label: '買い手' },
                    { key: 'professional', label: '士業' },
                    { key: 'broker', label: '業者' },
                  ].map((role) => (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => toggleRole(role.key)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-colors ${
                        form.targetRoles.includes(role.key)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        targetRoles: prev.targetRoles.length === 4 ? [] : ['seller', 'buyer', 'professional', 'broker'],
                      }))
                    }
                    className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {form.targetRoles.length === 4 ? '全解除' : '全選択'}
                  </button>
                </div>
              </div>

              {/* 通知タイプ */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">通知タイプ</label>
                <div className="flex gap-3">
                  {[
                    { key: 'info' as const, label: 'お知らせ', color: 'bg-info-50 text-info-700 border-info-200' },
                    { key: 'success' as const, label: '成功', color: 'bg-success-50 text-success-700 border-success-200' },
                    { key: 'warning' as const, label: '注意', color: 'bg-warning-50 text-warning-700 border-warning-200' },
                    { key: 'error' as const, label: '重要', color: 'bg-error-50 text-error-700 border-error-200' },
                  ].map((t) => (
                    <label key={t.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={form.type === t.key}
                        onChange={() => setForm((prev) => ({ ...prev, type: t.key }))}
                        className="sr-only"
                      />
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                        form.type === t.key ? t.color : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                      }`}>
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* メッセージ */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                  メッセージ <span className="text-error-500">*</span>
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  placeholder="通知メッセージを入力..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link href="/admin/notifications" className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                送信する
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  )
}
