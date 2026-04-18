'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import {
  ArrowLeft,
  Loader2,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { api } from '@/lib/api'
import type { ApiProperty } from '@/lib/mappers'

// Phase 1 対応エリア（東京都・神奈川県のみ）
const PREFECTURES = ['東京都', '神奈川県']

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'
const selectClass = `${inputClass} bg-white`
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

type FormData = {
  title: string
  propertyType: string
  prefecture: string
  city: string
  address: string
  landArea: string
  buildingArea: string
  builtYear: string
  description: string
  askingPrice: string
  instantPrice: string
  urgency: string
  isRegistrationComplete: string
}

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<ApiProperty>(`/properties/${id}`)
      if (res.success) {
        const p = res.data
        setForm({
          title: p.title,
          propertyType: p.propertyType,
          prefecture: p.prefecture,
          city: p.city,
          address: p.address ?? '',
          landArea: p.landArea ? String(p.landArea / 10) : '',
          buildingArea: p.buildingArea ? String(p.buildingArea / 10) : '',
          builtYear: p.builtYear ? String(p.builtYear) : '',
          description: p.description ?? '',
          askingPrice: String(Math.round(p.askingPrice / 10000)),
          instantPrice: '',
          urgency: p.urgency,
          isRegistrationComplete: p.isRegistrationComplete ? 'completed' : 'in_progress',
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => prev ? { ...prev, [field]: e.target.value } : prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError(null)
    setSubmitting(true)

    const body = {
      title: form.title.trim(),
      propertyType: form.propertyType,
      prefecture: form.prefecture,
      city: form.city.trim(),
      address: form.address.trim(),
      description: form.description.trim(),
      landArea: form.landArea ? Math.round(Number(form.landArea) * 10) : undefined,
      buildingArea: form.buildingArea ? Math.round(Number(form.buildingArea) * 10) : undefined,
      builtYear: form.builtYear ? Number(form.builtYear) : undefined,
      askingPrice: Number(form.askingPrice) * 10000,
      instantPrice: form.instantPrice ? Number(form.instantPrice) * 10000 : undefined,
      urgency: form.urgency,
      isRegistrationComplete: form.isRegistrationComplete === 'completed',
    }

    const res = await api.put(`/properties/${id}`, body)

    if (res.success) {
      router.push(`/seller/properties/${id}`)
    } else {
      setError(res.error.message || '物件情報の更新に失敗しました')
    }
    setSubmitting(false)
  }

  if (loading || !form) {
    return (
      <DashboardShell title="物件情報の編集" roleLabel="売主" navItems={sellerNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="物件情報の編集"
      roleLabel="売主"
      navItems={sellerNav}
    >
      <Link href={`/seller/properties/${id}`} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        物件詳細に戻る
      </Link>

      <div className="max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600 flex items-start gap-2">
            <X className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 物件基本情報 */}
          <section>
            <h2 className="text-base font-semibold mb-5">物件情報</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>物件名 <span className="text-error-500">*</span></label>
                <input type="text" value={form.title} onChange={set('title')} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>物件種別 <span className="text-error-500">*</span></label>
                <select value={form.propertyType} onChange={set('propertyType')} className={selectClass}>
                  <option value="apartment">マンション</option>
                  <option value="house">一戸建て</option>
                  <option value="land">土地</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>都道府県 <span className="text-error-500">*</span></label>
                  <select value={form.prefecture} onChange={set('prefecture')} className={selectClass}>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>市区町村 <span className="text-error-500">*</span></label>
                  <input type="text" value={form.city} onChange={set('city')} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>住所（番地以降） <span className="text-error-500">*</span></label>
                <input type="text" value={form.address} onChange={set('address')} className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>土地面積</label>
                  <div className="relative">
                    <input type="number" step="0.1" value={form.landArea} onChange={set('landArea')} className={`${inputClass} pr-10`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">㎡</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>建物面積</label>
                  <div className="relative">
                    <input type="number" step="0.1" value={form.buildingArea} onChange={set('buildingArea')} className={`${inputClass} pr-10`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">㎡</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>築年</label>
                <input type="number" value={form.builtYear} onChange={set('builtYear')} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>物件説明 <span className="text-error-500">*</span></label>
                <textarea rows={4} value={form.description} onChange={set('description')} className={`${inputClass} resize-none`} />
              </div>
            </div>
          </section>

          {/* 価格・入札設定 */}
          <section>
            <h2 className="text-base font-semibold mb-5">価格・入札設定</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>希望価格（最低入札価格） <span className="text-error-500">*</span></label>
                <div className="relative">
                  <input type="number" min={1000} value={form.askingPrice} onChange={set('askingPrice')} className={`${inputClass} pr-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>即決価格（任意）</label>
                <div className="relative">
                  <input type="number" value={form.instantPrice} onChange={set('instantPrice')} className={`${inputClass} pr-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>売却の緊急度 <span className="text-error-500">*</span></label>
                <select value={form.urgency} onChange={set('urgency')} className={selectClass}>
                  <option value="urgent">至急（1ヶ月以内）</option>
                  <option value="three_months">3ヶ月以内</option>
                  <option value="one_year">1年以内</option>
                  <option value="undecided">未定</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>相続登記の状況 <span className="text-error-500">*</span></label>
                <select value={form.isRegistrationComplete} onChange={set('isRegistrationComplete')} className={selectClass}>
                  <option value="completed">相続登記済み</option>
                  <option value="in_progress">登記手続き中</option>
                  <option value="not_started">未着手</option>
                </select>
              </div>
            </div>
          </section>

          {/* 送信 */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            <Link
              href={`/seller/properties/${id}`}
              className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              変更を保存する
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
