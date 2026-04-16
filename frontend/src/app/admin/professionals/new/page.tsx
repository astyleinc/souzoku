'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'
const selectClass = `${inputClass} bg-white`
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

export default function AdminNewProfessionalPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    qualification: '',
    registrationNumber: '',
    email: '',
    phone: '',
    officeName: '',
    address: '',
    networks: [] as string[],
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleNetwork = (nw: string) =>
    setForm((prev) => ({
      ...prev,
      networks: prev.networks.includes(nw)
        ? prev.networks.filter((n) => n !== nw)
        : [...prev.networks, nw],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const res = await api.post('/admin/professionals', {
      lastName: form.lastName,
      firstName: form.firstName,
      qualification: form.qualification,
      registrationNumber: form.registrationNumber,
      email: form.email,
      phone: form.phone,
      officeName: form.officeName,
      address: form.address,
      networks: form.networks,
    })
    setSubmitting(false)
    if (res.success) {
      router.push('/admin/professionals')
    } else {
      setError(res.error.message)
    }
  }

  return (
    <DashboardShell
      title="士業パートナー登録"
      roleLabel="管理者"
      navItems={adminNav}
    >
      <Link href="/admin/professionals" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        士業管理に戻る
      </Link>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="p-4 bg-error-50 text-error-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* 基本情報 */}
          <section>
            <h2 className="text-base font-semibold mb-5">基本情報</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    姓 <span className="text-error-500">*</span>
                  </label>
                  <input type="text" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="例: 山田" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    名 <span className="text-error-500">*</span>
                  </label>
                  <input type="text" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="例: 太郎" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    資格 <span className="text-error-500">*</span>
                  </label>
                  <select required value={form.qualification} onChange={(e) => set('qualification', e.target.value)} className={selectClass}>
                    <option value="">選択してください</option>
                    <option value="tax_accountant">税理士</option>
                    <option value="judicial_scrivener">司法書士</option>
                    <option value="administrative_scrivener">行政書士</option>
                    <option value="lawyer">弁護士</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    登録番号 <span className="text-error-500">*</span>
                  </label>
                  <input type="text" required value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)} placeholder="例: 第12345号" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    メールアドレス <span className="text-error-500">*</span>
                  </label>
                  <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="例: yamada@example.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    電話番号 <span className="text-error-500">*</span>
                  </label>
                  <input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="例: 03-1234-5678" className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          {/* 事務所情報 */}
          <section>
            <h2 className="text-base font-semibold mb-5">事務所情報</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  事務所名 <span className="text-error-500">*</span>
                </label>
                <input type="text" required value={form.officeName} onChange={(e) => set('officeName', e.target.value)} placeholder="例: 山田税理士事務所" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>所在地</label>
                <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="例: 東京都千代田区丸の内1丁目1-1" className={inputClass} />
              </div>
            </div>
          </section>

          {/* NW所属 */}
          <section>
            <h2 className="text-base font-semibold mb-5">ネットワーク所属</h2>
            <div className="space-y-3">
              {['awaka cross', 'UIコンサルティング', 'ミツカル'].map((nw) => (
                <label key={nw} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.networks.includes(nw)}
                    onChange={() => toggleNetwork(nw)}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
                  />
                  <span className="text-sm">{nw}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 送信 */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            <Link
              href="/admin/professionals"
              className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
