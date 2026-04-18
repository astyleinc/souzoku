'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

type NwCompanyData = {
  id: string
  name: string
  contactEmail: string | null
  contactPhone: string | null
  bankName: string | null
  bankBranch: string | null
  bankAccountType: string | null
  bankAccountNumber: string | null
  invoiceNumber: string | null
  isActive: boolean
}

export default function AdminEditNwCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const load = async () => {
      const res = await api.get<NwCompanyData>(`/admin/nw-companies/${params.id}`)
      if (res.success) {
        const d = res.data
        setForm({
          name: d.name,
          contactEmail: d.contactEmail ?? '',
          contactPhone: d.contactPhone ?? '',
          bankName: d.bankName ?? '',
          bankBranch: d.bankBranch ?? '',
          bankAccountType: d.bankAccountType ?? 'ordinary',
          bankAccountNumber: d.bankAccountNumber ?? '',
          invoiceNumber: d.invoiceNumber ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [params.id])

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
    const res = await api.patch(`/admin/nw-companies/${params.id}`, form)
    if (res.success) {
      router.push('/admin/nw-companies')
    } else {
      setError(res.error?.message ?? '更新に失敗しました')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <DashboardShell title="NW会社編集" roleLabel="管理画面" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="NW会社編集" roleLabel="管理画面" navItems={adminNav}>
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
              <input type="text" required value={form.name} onChange={set('name')} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>連絡先メール</label>
                <input type="email" value={form.contactEmail} onChange={set('contactEmail')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>連絡先電話</label>
                <input type="tel" value={form.contactPhone} onChange={set('contactPhone')} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>インボイス番号</label>
              <input type="text" value={form.invoiceNumber} onChange={set('invoiceNumber')} className={inputClass} />
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold">振込口座</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>銀行名</label>
                <input type="text" value={form.bankName} onChange={set('bankName')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>支店名</label>
                <input type="text" value={form.bankBranch} onChange={set('bankBranch')} className={inputClass} />
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
                <input type="text" value={form.bankAccountNumber} onChange={set('bankAccountNumber')} className={inputClass} />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link href="/admin/nw-companies" className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
              キャンセル
            </Link>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-50">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              保存する
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
