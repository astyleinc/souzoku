'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

export default function AdminNewNwCompanyPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    bankName: '',
    bankBranch: '',
    bankAccountType: 'ordinary',
    bankAccountNumber: '',
    invoiceNumber: '',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) {
      setError('会社名は必須です')
      return
    }
    setError(null)
    setSubmitting(true)
    const res = await api.post('/admin/nw-companies', form)
    if (res.success) {
      router.push('/admin/nw-companies')
    } else {
      setError(res.error?.message ?? '登録に失敗しました')
    }
    setSubmitting(false)
  }

  return (
    <DashboardShell title="NW会社登録" roleLabel="管理画面" navItems={adminNav}>
      <Link href="/admin/nw-companies" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        NW会社マスタに戻る
      </Link>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-error-50 text-error-600 text-sm rounded-xl">{error}</div>
          )}

          <section className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold">基本情報</h2>
            <div>
              <label className={labelClass}>会社名 <span className="text-error-500">*</span></label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="例: 東京相続NW" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>連絡先メール</label>
                <input type="email" value={form.contactEmail} onChange={set('contactEmail')} placeholder="info@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>連絡先電話</label>
                <input type="tel" value={form.contactPhone} onChange={set('contactPhone')} placeholder="03-1234-5678" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>インボイス番号</label>
              <input type="text" value={form.invoiceNumber} onChange={set('invoiceNumber')} placeholder="T1234567890123" className={inputClass} />
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold">振込口座</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>銀行名</label>
                <input type="text" value={form.bankName} onChange={set('bankName')} placeholder="三菱UFJ銀行" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>支店名</label>
                <input type="text" value={form.bankBranch} onChange={set('bankBranch')} placeholder="丸の内支店" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>口座種別</label>
                <select value={form.bankAccountType} onChange={set('bankAccountType')} className={`${inputClass} bg-white`}>
                  <option value="ordinary">普通</option>
                  <option value="current">当座</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>口座番号</label>
                <input type="text" value={form.bankAccountNumber} onChange={set('bankAccountNumber')} placeholder="1234567" className={inputClass} />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link href="/admin/nw-companies" className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
              キャンセル
            </Link>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-50">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              登録する
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
