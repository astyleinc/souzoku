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
const selectClass = `${inputClass} bg-white`
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

type ProfessionalData = {
  id: string
  name: string
  qualification: string
  registrationNumber: string
  email: string
  phone: string
  officeName: string
  address: string | null
}

export default function AdminEditProfessionalPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    qualification: '',
    registrationNumber: '',
    email: '',
    phone: '',
    officeName: '',
    address: '',
  })

  useEffect(() => {
    const load = async () => {
      const res = await api.get<ProfessionalData>(`/professionals/${params.id}`)
      if (res.success) {
        const d = res.data
        setForm({
          name: d.name,
          qualification: d.qualification,
          registrationNumber: d.registrationNumber,
          email: d.email,
          phone: d.phone,
          officeName: d.officeName,
          address: d.address ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const res = await api.patch(`/professionals/${params.id}`, form)
    if (res.success) {
      router.push(`/admin/professionals/${params.id}`)
    } else {
      setError(res.error?.message ?? '更新に失敗しました')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <DashboardShell title="士業パートナー編集" roleLabel="管理者" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="士業パートナー編集" roleLabel="管理者" navItems={adminNav}>
      <Link href={`/admin/professionals/${params.id}`} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        士業パートナー詳細に戻る
      </Link>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-error-50 text-error-600 text-sm rounded-xl">{error}</div>
          )}

          <section className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold">基本情報</h2>
            <div>
              <label className={labelClass}>氏名 <span className="text-error-500">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>資格 <span className="text-error-500">*</span></label>
                <select required value={form.qualification} onChange={(e) => set('qualification', e.target.value)} className={selectClass}>
                  <option value="">選択してください</option>
                  <option value="tax_accountant">税理士</option>
                  <option value="judicial_scrivener">司法書士</option>
                  <option value="administrative_scrivener">行政書士</option>
                  <option value="lawyer">弁護士</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>登録番号 <span className="text-error-500">*</span></label>
                <input type="text" required value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>メールアドレス <span className="text-error-500">*</span></label>
                <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>電話番号 <span className="text-error-500">*</span></label>
                <input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold">事務所情報</h2>
            <div>
              <label className={labelClass}>事務所名 <span className="text-error-500">*</span></label>
              <input type="text" required value={form.officeName} onChange={(e) => set('officeName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>所在地</label>
              <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link href={`/admin/professionals/${params.id}`} className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
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
