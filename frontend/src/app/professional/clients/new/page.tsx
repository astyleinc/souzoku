'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

const inputClass = 'w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors'
const selectClass = inputClass
const labelClass = 'block text-sm font-medium mb-1.5'

type NwCompany = {
  id: string
  name: string
}

type FormData = {
  nwRoute: string
  nwCompanyId: string
  sellerName: string
  sellerEmail: string
  sellerPhone: string
  sellerAddress: string
  propertyTitle: string
  propertyAddress: string
  propertyType: string
  area: string
  askingPrice: string
  buyNowPrice: string
  bidDuration: string
  note: string
}

const initialForm: FormData = {
  nwRoute: 'direct',
  nwCompanyId: '',
  sellerName: '',
  sellerEmail: '',
  sellerPhone: '',
  sellerAddress: '',
  propertyTitle: '',
  propertyAddress: '',
  propertyType: '',
  area: '',
  askingPrice: '',
  buyNowPrice: '',
  bidDuration: '14',
  note: '',
}

type DocUpload = {
  label: string
  file: File | null
}

export default function ProfessionalClientNewPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialForm)
  const [nwCompanies, setNwCompanies] = useState<NwCompany[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/referrals/nw-companies')
      if (res.success) setNwCompanies(toItems<NwCompany>(res.data))
    }
    load()
  }, [])
  const [docs, setDocs] = useState<DocUpload[]>([
    { label: '登記事項証明書', file: null },
    { label: '遺産分割協議書', file: null },
    { label: '本人確認書類', file: null },
    { label: '物件写真', file: null },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleFileSelect = (index: number) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.jpeg,.png'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setError('ファイルサイズは10MB以下にしてください')
          return
        }
        setDocs((prev) => prev.map((d, i) => i === index ? { ...d, file } : d))
      }
    }
    input.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.sellerName || !form.sellerEmail || !form.propertyTitle || !form.propertyAddress || !form.propertyType || !form.askingPrice) {
      setError('必須項目を入力してください')
      return
    }

    const price = Number(form.askingPrice)
    if (isNaN(price) || price < 1000) {
      setError('希望売出価格は1,000万円以上で入力してください')
      return
    }

    setSubmitting(true)
    const res = await api.post('/referrals/me/clients', {
      nwRoute: form.nwCompanyId ? 'nw' : 'direct',
      nwCompanyId: form.nwCompanyId || undefined,
      seller: {
        name: form.sellerName,
        email: form.sellerEmail,
        phone: form.sellerPhone,
        address: form.sellerAddress,
      },
      property: {
        title: form.propertyTitle,
        address: form.propertyAddress,
        type: form.propertyType,
        area: form.area ? Number(form.area) : undefined,
        askingPrice: price * 10000,
        buyNowPrice: form.buyNowPrice ? Number(form.buyNowPrice) * 10000 : undefined,
        bidDuration: Number(form.bidDuration),
        note: form.note || undefined,
      },
    })

    if (res.success) {
      router.push('/professional/clients')
    } else {
      setError(res.error?.message ?? '登録に失敗しました')
    }
    setSubmitting(false)
  }

  return (
    <DashboardShell
      title="売主を代理登録"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      <Link href="/professional/clients" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        クライアント一覧に戻る
      </Link>

      <div className="max-w-2xl space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-error-700 bg-error-50 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NW経路 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-base font-semibold mb-4">紹介経路</h2>
            <div>
              <label className={labelClass}>NW経路を選択</label>
              <select className={selectClass} value={form.nwCompanyId} onChange={set('nwCompanyId')}>
                <option value="">直接紹介（NW経由なし）</option>
                {nwCompanies.map((nw) => (
                  <option key={nw.id} value={nw.id}>{nw.name}</option>
                ))}
              </select>
              <p className="text-xs text-neutral-400 mt-1.5">
                NW経由の場合、報酬配分にNW手数料（3%）が適用されます
              </p>
            </div>
          </div>

          {/* 売主情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-base font-semibold mb-4">売主情報</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>売主氏名 <span className="text-error-500">*</span></label>
                <input type="text" placeholder="中村 一郎" className={inputClass} value={form.sellerName} onChange={set('sellerName')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>メールアドレス <span className="text-error-500">*</span></label>
                  <input type="email" placeholder="nakamura@example.com" className={inputClass} value={form.sellerEmail} onChange={set('sellerEmail')} />
                </div>
                <div>
                  <label className={labelClass}>電話番号</label>
                  <input type="tel" placeholder="03-1234-5678" className={inputClass} value={form.sellerPhone} onChange={set('sellerPhone')} />
                </div>
              </div>
              <div>
                <label className={labelClass}>住所</label>
                <input type="text" placeholder="東京都○○区○○1丁目2-3" className={inputClass} value={form.sellerAddress} onChange={set('sellerAddress')} />
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-3">
              売主にはアカウント作成の通知メールが届きます。初回ログイン時にパスワード設定が必要です。
            </p>
          </div>

          {/* 物件情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-base font-semibold mb-4">物件情報</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>物件タイトル <span className="text-error-500">*</span></label>
                <input type="text" placeholder="○○区 ○○マンション 3LDK" className={inputClass} value={form.propertyTitle} onChange={set('propertyTitle')} />
              </div>
              <div>
                <label className={labelClass}>物件所在地 <span className="text-error-500">*</span></label>
                <input type="text" placeholder="東京都○○区○○5丁目" className={inputClass} value={form.propertyAddress} onChange={set('propertyAddress')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>物件種別 <span className="text-error-500">*</span></label>
                  <select className={selectClass} value={form.propertyType} onChange={set('propertyType')}>
                    <option value="">選択してください</option>
                    <option value="mansion">マンション</option>
                    <option value="house">一戸建て</option>
                    <option value="land">土地</option>
                    <option value="building">ビル</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>面積（㎡）</label>
                  <input type="number" placeholder="72.5" className={inputClass} value={form.area} onChange={set('area')} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>希望売出価格（万円） <span className="text-error-500">*</span></label>
                  <input type="number" placeholder="3500" className={inputClass} value={form.askingPrice} onChange={set('askingPrice')} />
                  <p className="text-xs text-neutral-400 mt-1">最低出品価格: 1,000万円</p>
                </div>
                <div>
                  <label className={labelClass}>即決価格（万円・任意）</label>
                  <input type="number" placeholder="4000" className={inputClass} value={form.buyNowPrice} onChange={set('buyNowPrice')} />
                </div>
              </div>
              <div>
                <label className={labelClass}>入札期間</label>
                <select className={selectClass} value={form.bidDuration} onChange={set('bidDuration')}>
                  <option value="7">7日間</option>
                  <option value="14">14日間</option>
                  <option value="21">21日間</option>
                  <option value="30">30日間</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>備考（任意）</label>
                <textarea
                  rows={3}
                  placeholder="物件の特記事項があれば入力してください"
                  className={`${inputClass} resize-none`}
                  value={form.note}
                  onChange={set('note')}
                />
              </div>
            </div>
          </div>

          {/* 書類アップロード */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-base font-semibold mb-4">書類アップロード</h2>
            <div className="space-y-3">
              {docs.map((doc, i) => (
                <div key={doc.label} className="flex items-center gap-3 p-3 border border-dashed border-neutral-200 rounded-xl hover:border-primary-300 transition-colors">
                  {doc.file ? (
                    <CheckCircle className="w-4 h-4 text-success-500 shrink-0" />
                  ) : (
                    <Upload className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{doc.label}</p>
                    {doc.file ? (
                      <p className="text-xs text-success-600">{doc.file.name}</p>
                    ) : (
                      <p className="text-xs text-neutral-400">PDF / JPG / PNG（10MBまで）</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFileSelect(i)}
                    className="px-3 py-1.5 text-xs font-medium text-primary-500 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    {doc.file ? '変更' : '選択'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 送信 */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              登録する
            </button>
            <Link href="/professional/clients" className="px-6 py-3 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
