'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

type BrokerData = {
  id: string
  companyName: string
  representativeName: string
  licenseNumber: string
  email: string
  phone: string
  bankName: string | null
  branchName: string | null
  accountType: string | null
  accountNumber: string | null
}

export default function AdminEditBrokerPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    companyName: '',
    representativeName: '',
    licenseNumber: '',
    email: '',
    phone: '',
    bankName: '',
    bankBranch: '',
    bankAccountType: 'ordinary',
    bankAccountNumber: '',
  })

  useEffect(() => {
    const load = async () => {
      const res = await api.get<BrokerData>(`/brokers/${params.id}`)
      if (res.success) {
        const d = res.data
        setForm({
          companyName: d.companyName,
          representativeName: d.representativeName,
          licenseNumber: d.licenseNumber,
          email: d.email,
          phone: d.phone,
          bankName: d.bankName ?? '',
          bankBranch: d.branchName ?? '',
          bankAccountType: d.accountType ?? 'ordinary',
          bankAccountNumber: d.accountNumber ?? '',
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
    setError(null)
    setSubmitting(true)
    const res = await api.patch(`/brokers/${params.id}`, form)
    if (res.success) {
      router.push(`/admin/brokers/${params.id}`)
    } else {
      setError(res.error?.message ?? '更新に失敗しました')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <DashboardShell title="業者編集" roleLabel="管理画面" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="業者編集" roleLabel="管理画面" navItems={adminNav}>
      <Link href={`/admin/brokers/${params.id}`} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        業者詳細に戻る
      </Link>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-error-50 text-error-600 text-sm rounded-xl">{error}</div>
          )}

          <section className="bg-white rounded-2xl shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold">会社情報</h2>
            <div>
              <label className={labelClass}>会社名 <span className="text-error-500">*</span></label>
              <input type="text" required value={form.companyName} onChange={set('companyName')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>宅建業免許番号 <span className="text-error-500">*</span></label>
              <input type="text" required value={form.licenseNumber} onChange={set('licenseNumber')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>代表者名 <span className="text-error-500">*</span></label>
              <input type="text" required value={form.representativeName} onChange={set('representativeName')} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>メール <span className="text-error-500">*</span></label>
                <input type="email" required value={form.email} onChange={set('email')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>電話 <span className="text-error-500">*</span></label>
                <input type="tel" required value={form.phone} onChange={set('phone')} className={inputClass} />
              </div>
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
            <Link href={`/admin/brokers/${params.id}`} className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
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
