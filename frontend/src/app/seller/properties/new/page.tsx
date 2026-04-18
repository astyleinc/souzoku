'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Upload,
  Info,
  Loader2,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  MapPin,
  Building2,
  Banknote,
  ImagePlus,
  GripVertical,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { api } from '@/lib/api'
import {
  ALLOWED_PREFECTURES,
  FILE_UPLOAD_ACCEPT_ATTR,
  FILE_UPLOAD_MAX_SIZE_BYTES,
  FILE_UPLOAD_MAX_SIZE_MB,
  MIN_LISTING_PRICE,
} from '@shared/constants'

// Phase 1 対応エリア（shared定数から取り込み）
const PREFECTURES = ALLOWED_PREFECTURES

// 最低出品価格を万円単位で表示するための換算値
const MIN_LISTING_PRICE_MAN = MIN_LISTING_PRICE / 10_000

// 登録時のURLクエリ（?nw=...）が register/page.tsx で保存される
const REFERRAL_STORAGE_KEY = 'ouver:referral'

// localStorageから紹介NW IDを読み取る（物件登録時に一度だけ使用）
const readReferralNwId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.localStorage.getItem(REFERRAL_STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as { nwId?: string }
    return parsed.nwId
  } catch {
    return undefined
  }
}

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
  saleReason: string
  askingPrice: string
  instantPrice: string
  urgency: string
  registrationStatus: string
  inheritanceStartDate: string
}

const initialForm: FormData = {
  title: '',
  propertyType: '',
  prefecture: '',
  city: '',
  address: '',
  landArea: '',
  buildingArea: '',
  builtYear: '',
  description: '',
  saleReason: '',
  askingPrice: '',
  instantPrice: '',
  urgency: '',
  registrationStatus: '',
  inheritanceStartDate: '',
}

const MAX_IMAGES = 20
const MAX_FILE_SIZE = FILE_UPLOAD_MAX_SIZE_BYTES

type ImageFile = {
  id: string
  file: File
  preview: string
}

const DRAFT_KEY = 'ouver-property-draft'

const STEPS = [
  { label: '所在地', icon: MapPin },
  { label: '物件詳細', icon: Building2 },
  { label: '売却条件', icon: Banknote },
] as const

export default function NewPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [draftRestored, setDraftRestored] = useState(false)
  const [images, setImages] = useState<ImageFile[]>([])
  const [imageError, setImageError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  // 下書き復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>
        setForm((prev) => ({ ...prev, ...parsed }))
        setDraftRestored(true)
        setTimeout(() => setDraftRestored(false), 3000)
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [])

  // 下書き自動保存（入力の度に）
  const saveDraft = useCallback((data: FormData) => {
    const hasData = Object.values(data).some((v) => v !== '')
    if (hasData) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    }
  }, [])

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const next = { ...form, [field]: e.target.value }
    setForm(next)
    saveDraft(next)
    setFieldErrors((prev) => {
      const updated = { ...prev }
      delete updated[field]
      return updated
    })
  }

  // ステップごとのバリデーション
  const validateStep = (s: number): boolean => {
    const errors: Record<string, string> = {}

    if (s === 0) {
      if (!form.propertyType) errors.propertyType = '物件種別を選択してください'
      if (!form.prefecture) errors.prefecture = '都道府県を選択してください'
      if (!form.city.trim()) errors.city = '市区町村を入力してください'
      if (!form.address.trim()) errors.address = '住所を入力してください'
    }

    if (s === 1) {
      if (!form.title.trim()) errors.title = '物件名を入力してください'
      if (!form.description.trim()) errors.description = '物件説明を入力してください'
    }

    if (s === 2) {
      if (!form.askingPrice) {
        errors.askingPrice = '希望価格を入力してください'
      } else if (Number(form.askingPrice) < MIN_LISTING_PRICE_MAN) {
        errors.askingPrice = `最低出品価格は${MIN_LISTING_PRICE_MAN.toLocaleString()}万円です`
      }
      if (form.instantPrice && Number(form.instantPrice) <= Number(form.askingPrice)) {
        errors.instantPrice = '即決価格は希望価格より高く設定してください'
      }
      if (!form.urgency) errors.urgency = '売却の緊急度を選択してください'
      if (!form.registrationStatus) errors.registrationStatus = '相続登記の状況を選択してください'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const goNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    setFieldErrors({})
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
  }

  const addImages = (files: FileList | File[]) => {
    setImageError(null)
    const fileArray = Array.from(files)
    const remaining = MAX_IMAGES - images.length

    if (remaining <= 0) {
      setImageError(`写真は最大${MAX_IMAGES}枚までです`)
      return
    }

    const validFiles: ImageFile[] = []
    for (const file of fileArray.slice(0, remaining)) {
      if (!file.type.startsWith('image/')) {
        setImageError('画像ファイル（JPG, PNG, WebP）を選択してください')
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        setImageError(`1枚あたり${FILE_UPLOAD_MAX_SIZE_MB}MB以下のファイルを選択してください`)
        continue
      }
      validFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: URL.createObjectURL(file),
      })
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles])
    }

    if (fileArray.length > remaining) {
      setImageError(`${fileArray.length - remaining}枚が制限超過のためスキップされました`)
    }
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((img) => img.id !== id)
    })
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateStep(step)) return

    setSubmitting(true)

    const referralNwCompanyId = readReferralNwId()

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
      inheritanceStartDate: form.inheritanceStartDate || undefined,
      isRegistrationComplete: form.registrationStatus === 'completed',
      ...(referralNwCompanyId ? { referralNwCompanyId, referralChannel: 'nw' as const } : {}),
    }

    const res = await api.post<{ id: string }>('/properties', body)

    if (res.success) {
      clearDraft()
      // 物件登録に成功したら紹介情報は消費済みなので削除
      try {
        window.localStorage.removeItem(REFERRAL_STORAGE_KEY)
      } catch {
        // localStorage操作失敗は無視
      }
      router.push(`/seller/properties/${res.data.id}`)
    } else {
      setError(res.error.message || '物件の登録に失敗しました')
    }
    setSubmitting(false)
  }

  const fieldError = (field: keyof FormData) =>
    fieldErrors[field] ? (
      <p className="text-xs text-error-500 mt-1">{fieldErrors[field]}</p>
    ) : null

  const filledStepCount = (() => {
    let count = 0
    if (form.propertyType && form.prefecture && form.city && form.address) count++
    if (form.title && form.description) count++
    if (form.askingPrice && form.urgency && form.registrationStatus) count++
    return count
  })()

  return (
    <DashboardShell
      title="新規出品"
      roleLabel="売主"
      navItems={sellerNav}
    >
      <div className="max-w-2xl">
        {/* 下書き復元通知 */}
        {draftRestored && (
          <div className="mb-6 p-3 bg-info-50 border border-info-200 rounded-xl text-sm text-info-700 flex items-center justify-between">
            <span>前回の入力内容を復元しました</span>
            <button
              onClick={() => {
                clearDraft()
                setForm(initialForm)
                setStep(0)
                setDraftRestored(false)
              }}
              className="text-xs text-info-500 hover:underline ml-4"
            >
              クリアする
            </button>
          </div>
        )}

        {/* ステッププログレス */}
        <nav className="mb-8">
          <ol className="flex items-center gap-0">
            {STEPS.map((s, i) => {
              const isActive = i === step
              const isCompleted = i < step || (i < filledStepCount && i < step + 1 && !isActive)
              const isPast = i < step
              return (
                <li key={s.label} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => {
                      if (isPast) {
                        setFieldErrors({})
                        setStep(i)
                      }
                    }}
                    disabled={!isPast}
                    className={`flex items-center gap-2 ${isPast ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : isPast
                          ? 'bg-success-100 text-success-600'
                          : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      {isPast ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </span>
                    <span className={`text-sm font-medium hidden sm:inline ${
                      isActive ? 'text-primary-600' : isPast ? 'text-success-600' : 'text-neutral-400'
                    }`}>
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 rounded ${isPast ? 'bg-success-300' : 'bg-neutral-200'}`} />
                  )}
                </li>
              )
            })}
          </ol>
          <p className="text-xs text-neutral-400 mt-3">
            ステップ {step + 1} / {STEPS.length}
          </p>
        </nav>

        {step === 0 && (
          <div className="bg-info-50 rounded-2xl p-5 mb-8 flex items-start gap-3">
            <Info className="w-5 h-5 text-info-500 shrink-0 mt-0.5" />
            <div className="text-sm text-info-700">
              <p className="font-medium mb-1.5">まずは物件の場所を教えてください</p>
              <p className="text-xs text-info-600">後から変更可能です。書類のアップロードは登録後にご案内します。</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600 flex items-start gap-2">
            <X className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ステップ1: 所在地 */}
          {step === 0 && (
            <section className="space-y-5">
              <div>
                <label className={labelClass}>
                  物件種別 <span className="text-error-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'apartment', label: 'マンション' },
                    { value: 'house', label: '一戸建て' },
                    { value: 'land', label: '土地' },
                    { value: 'other', label: 'その他' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const next = { ...form, propertyType: opt.value }
                        setForm(next)
                        saveDraft(next)
                        setFieldErrors((prev) => { const u = { ...prev }; delete u.propertyType; return u })
                      }}
                      className={`px-4 py-3 text-sm font-medium rounded-xl border-2 transition-colors ${
                        form.propertyType === opt.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {fieldError('propertyType')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    都道府県 <span className="text-error-500">*</span>
                  </label>
                  <select value={form.prefecture} onChange={set('prefecture')} className={selectClass}>
                    <option value="">選択してください</option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {fieldError('prefecture')}
                </div>
                <div>
                  <label className={labelClass}>
                    市区町村 <span className="text-error-500">*</span>
                  </label>
                  <input type="text" value={form.city} onChange={set('city')} placeholder="例: 練馬区" className={inputClass} />
                  {fieldError('city')}
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  住所（番地以降） <span className="text-error-500">*</span>
                </label>
                <input type="text" value={form.address} onChange={set('address')} placeholder="例: 豊玉北5丁目29-1" className={inputClass} />
                {fieldError('address')}
              </div>
            </section>
          )}

          {/* ステップ2: 物件詳細 */}
          {step === 1 && (
            <section className="space-y-5">
              {/* 画像アップロード */}
              <div>
                <label className={labelClass}>
                  物件写真（最大{MAX_IMAGES}枚）
                </label>
                <p className="text-xs text-neutral-400 mb-3">
                  1枚目がメイン画像として表示されます。ドラッグで並べ替え可能です。
                </p>

                {/* ドロップゾーン + プレビュー */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 transition-colors ${
                    dragOver
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                      {images.map((img, idx) => (
                        <div
                          key={img.id}
                          className="relative aspect-[4/3] rounded-lg overflow-hidden group bg-neutral-200"
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', String(idx))}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const from = Number(e.dataTransfer.getData('text/plain'))
                            if (!isNaN(from) && from !== idx) moveImage(from, idx)
                          }}
                        >
                          <Image
                            src={img.preview}
                            alt={`写真${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="150px"
                          />
                          {/* メイン画像バッジ */}
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-primary-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                              メイン
                            </span>
                          )}
                          {/* 並べ替えハンドル */}
                          <div className="absolute top-1.5 right-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                            <GripVertical className="w-4 h-4 text-white drop-shadow" />
                          </div>
                          {/* 削除ボタン */}
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* アップロードボタン */}
                  <label className="flex flex-col items-center gap-2 py-6 cursor-pointer">
                    <ImagePlus className={`w-8 h-8 ${images.length > 0 ? 'text-neutral-300' : 'text-neutral-400'}`} />
                    <span className="text-sm font-medium text-neutral-500">
                      {images.length === 0 ? '写真を追加' : '写真を追加する'}
                    </span>
                    <span className="text-xs text-neutral-400">
                      クリックまたはドラッグ&ドロップ（JPG, PNG, WebP / 各10MBまで）
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) addImages(e.target.files)
                        e.target.value = ''
                      }}
                    />
                  </label>
                </div>

                {imageError && (
                  <p className="text-xs text-error-500 mt-1.5">{imageError}</p>
                )}
                <p className="text-xs text-neutral-400 mt-1.5">
                  {images.length} / {MAX_IMAGES}枚
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  物件名（タイトル） <span className="text-error-500">*</span>
                </label>
                <input type="text" value={form.title} onChange={set('title')} placeholder="例: 練馬区 駅近マンション 3LDK" className={inputClass} />
                <p className="text-xs text-neutral-400 mt-1.5">検索結果に表示されます。所在地・特徴を含めると買い手に伝わりやすくなります</p>
                {fieldError('title')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>土地面積</label>
                  <div className="relative">
                    <input type="number" step="0.1" value={form.landArea} onChange={set('landArea')} placeholder="72.5" className={`${inputClass} pr-10`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">㎡</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>建物面積</label>
                  <div className="relative">
                    <input type="number" step="0.1" value={form.buildingArea} onChange={set('buildingArea')} placeholder="72.5" className={`${inputClass} pr-10`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">㎡</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>築年</label>
                  <input type="number" value={form.builtYear} onChange={set('builtYear')} placeholder="2003" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  物件説明 <span className="text-error-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={set('description')}
                  placeholder="物件の特徴、周辺環境、アクセスなどを記載してください"
                  className={`${inputClass} resize-none`}
                />
                {fieldError('description')}
              </div>

              <div>
                <label className={labelClass}>売却理由</label>
                <textarea
                  rows={2}
                  value={form.saleReason}
                  onChange={set('saleReason')}
                  placeholder="相続の経緯など（任意）"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </section>
          )}

          {/* ステップ3: 売却条件 */}
          {step === 2 && (
            <section className="space-y-5">
              <div>
                <label className={labelClass}>
                  希望価格（最低入札価格） <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input type="number" min={MIN_LISTING_PRICE_MAN} value={form.askingPrice} onChange={set('askingPrice')} placeholder="3500" className={`${inputClass} pr-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5">最低出品価格は{MIN_LISTING_PRICE_MAN.toLocaleString()}万円です</p>
                {fieldError('askingPrice')}
              </div>

              <div>
                <label className={labelClass}>即決価格（任意）</label>
                <div className="relative">
                  <input type="number" value={form.instantPrice} onChange={set('instantPrice')} placeholder="4000" className={`${inputClass} pr-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5">この価格以上の入札があった場合、即時通知されます</p>
                {fieldError('instantPrice')}
              </div>

              <div>
                <label className={labelClass}>
                  売却の緊急度 <span className="text-error-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'urgent', label: '至急（1ヶ月以内）', sub: '最優先で掲載されます' },
                    { value: 'three_months', label: '3ヶ月以内', sub: '一般的な売却スケジュール' },
                    { value: 'one_year', label: '1年以内', sub: 'じっくり検討したい方' },
                    { value: 'undecided', label: '未定', sub: 'まずは相場を知りたい方' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const next = { ...form, urgency: opt.value }
                        setForm(next)
                        saveDraft(next)
                        setFieldErrors((prev) => { const u = { ...prev }; delete u.urgency; return u })
                      }}
                      className={`text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                        form.urgency === opt.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <p className={`text-sm font-medium ${form.urgency === opt.value ? 'text-primary-700' : 'text-neutral-700'}`}>{opt.label}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{opt.sub}</p>
                    </button>
                  ))}
                </div>
                {fieldError('urgency')}
              </div>

              <div>
                <label className={labelClass}>
                  相続登記の状況 <span className="text-error-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'completed', label: '相続登記済み', sub: 'すぐに掲載できます' },
                    { value: 'in_progress', label: '登記手続き中', sub: '手続き完了まで「登記中」として掲載されます' },
                    { value: 'not_started', label: '未着手', sub: '士業パートナーをご紹介できます' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const next = { ...form, registrationStatus: opt.value }
                        setForm(next)
                        saveDraft(next)
                        setFieldErrors((prev) => { const u = { ...prev }; delete u.registrationStatus; return u })
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                        form.registrationStatus === opt.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <p className={`text-sm font-medium ${form.registrationStatus === opt.value ? 'text-primary-700' : 'text-neutral-700'}`}>{opt.label}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{opt.sub}</p>
                    </button>
                  ))}
                </div>
                {fieldError('registrationStatus')}
              </div>

              <div>
                <label className={labelClass}>相続開始日（任意）</label>
                <input
                  type="date"
                  value={form.inheritanceStartDate}
                  onChange={set('inheritanceStartDate')}
                  className={inputClass}
                />
                <p className="text-xs text-neutral-400 mt-1.5">
                  相続税申告期限（10ヶ月）・相続登記期限（3年）までのカウントダウン表示に使用します
                </p>
              </div>

              {/* 書類案内 */}
              <div className="bg-neutral-50 rounded-xl p-5 text-sm text-neutral-500">
                <div className="flex items-start gap-3">
                  <Upload className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <p>登記事項証明書・本人確認書類などの書類アップロードは、物件登録後に物件詳細画面から行えます。</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      審査には登記事項証明書・本人確認書類が必要です。物件写真は前のステップでアップロードできます。
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-neutral-100">
            {step === 0 ? (
              <Link
                href="/seller/properties"
                className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                キャンセル
              </Link>
            ) : (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                戻る
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all"
              >
                次へ
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                審査に提出する
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
