'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'

export default function AdminNewHelpArticlePage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    body: '',
    status: 'draft' as 'draft' | 'published',
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const res = await api.post('/help/articles', form)
    setSubmitting(false)
    if (res.success) {
      router.push('/admin/content')
    } else {
      setError(res.error.message)
    }
  }

  return (
    <DashboardShell title="ヘルプ記事作成" roleLabel="管理画面" navItems={adminNav}>
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        コンテンツ管理に戻る
      </Link>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-error-50 text-error-600 text-sm rounded-xl">{error}</div>
          )}

          <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">タイトル <span className="text-error-500">*</span></label>
              <input type="text" required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="記事タイトル" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">スラッグ <span className="text-error-500">*</span></label>
                <input type="text" required value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="article-slug" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">カテゴリ <span className="text-error-500">*</span></label>
                <select required value={form.category} onChange={(e) => set('category', e.target.value)} className={`${inputClass} bg-white`}>
                  <option value="">選択してください</option>
                  <option value="はじめに">はじめに</option>
                  <option value="物件登録">物件登録</option>
                  <option value="入札">入札</option>
                  <option value="取引">取引</option>
                  <option value="支払い">支払い</option>
                  <option value="アカウント">アカウント</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">本文 <span className="text-error-500">*</span></label>
              <textarea
                required
                value={form.body}
                onChange={(e) => set('body', e.target.value)}
                rows={12}
                placeholder="記事の本文を入力..."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">公開ステータス</label>
              <div className="flex gap-4">
                {(['draft', 'published'] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={form.status === s}
                      onChange={() => setForm((prev) => ({ ...prev, status: s }))}
                      className="w-4 h-4 text-primary-500 focus:ring-primary-500/20"
                    />
                    <span className="text-sm">{s === 'draft' ? '下書き' : '公開'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/admin/content" className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
              キャンセル
            </Link>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '保存する'}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
