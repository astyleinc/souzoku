'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { api } from '@/lib/api'

type RoleKey = 'seller' | 'buyer' | 'professional'

type Role = {
  key: RoleKey
  label: string
  eyebrow: string
  description: string
  href: string
}

const ROLES: Role[] = [
  {
    key: 'seller',
    label: '売主（相続人）として',
    eyebrow: 'FOR SELLERS',
    description: '相続した不動産を、入札で売却したい方へ。',
    href: '/seller',
  },
  {
    key: 'buyer',
    label: '買い手として',
    eyebrow: 'FOR BUYERS',
    description: '相続不動産を購入したい・投資したい方へ。',
    href: '/buyer',
  },
  {
    key: 'professional',
    label: '士業パートナーとして',
    eyebrow: 'FOR PROFESSIONALS',
    description: '相続のご相談を、Ouverにつないでくださる方へ。',
    href: '/professional',
  },
]

const STEP_LABELS = ['ご利用目的', 'プロフィール', 'スタート'] as const

export default function WelcomePage() {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null)
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const selectedRoleData = ROLES.find((r) => r.key === selectedRole)

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError('表示名をご入力ください。')
      return
    }
    setSaving(true)
    setError('')

    const res = await api.put('/users/me', {
      name: name.trim(),
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      role: selectedRole ?? undefined,
    })

    if (res.success) {
      await refresh()
      setCurrentStep(2)
    } else {
      setError('プロフィールを保存できませんでした。もう一度お試しください。')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <header className="py-7">
        <div className="max-w-[1260px] mx-auto px-5 md:px-9">
          <Link href="/" className="inline-flex items-center gap-3 w-fit">
            <div className="w-8 h-8 bg-bark rounded-[8px] flex items-center justify-center">
              <span className="text-warm font-bold text-[13px]">O</span>
            </div>
            <span className="text-[14px] font-bold text-bark tracking-[-0.01em]">Ouver</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 md:px-9 pb-20">
        <div className="w-full max-w-[620px]">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
              <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
              WELCOME
              <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
            </div>
            <h1 className="font-bold text-[clamp(28px,3.6vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
              Ouverへようこそ
            </h1>
            <p className="text-[13px] text-bark-2 leading-[1.95]">
              はじめに、いくつかの設定だけお願いします。あとからでも変更いただけます。
            </p>
          </div>

          <div className="mb-10">
            <ul className="grid grid-cols-3 gap-3">
              {STEP_LABELS.map((label, i) => {
                const done = i < currentStep
                const active = i === currentStep
                return (
                  <li key={label} className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 w-full">
                      <span
                        className={`price flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
                          done
                            ? 'bg-sage-deep text-warm'
                            : active
                              ? 'bg-bark text-warm'
                              : 'bg-bark-4/10 text-bark-4'
                        }`}
                      >
                        {i + 1}
                      </span>
                      {i < STEP_LABELS.length - 1 && (
                        <span
                          aria-hidden
                          className={`flex-1 h-px ${
                            done ? 'bg-sage-deep' : 'bg-bark-4/20'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[11px] tracking-[0.12em] font-semibold ${
                        active ? 'text-bark' : 'text-bark-4'
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="surface-card rounded-[16px] p-8 md:p-10">
            {currentStep === 0 && (
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-bark tracking-[-0.015em] mb-2">
                  どのような立場でご利用ですか
                </h2>
                <p className="text-[13px] text-bark-2 leading-[1.9] mb-6">
                  いちばん近いものをお選びください。
                </p>

                <ul className="space-y-3">
                  {ROLES.map((role) => {
                    const active = selectedRole === role.key
                    return (
                      <li key={role.key}>
                        <button
                          type="button"
                          onClick={() => setSelectedRole(role.key)}
                          className={`w-full text-left p-5 rounded-[12px] border transition-colors ${
                            active
                              ? 'border-sage-deep/40 bg-sage-xlight/50'
                              : 'border-black/10 bg-white hover:border-black/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] tracking-[0.28em] font-semibold text-sage-deep mb-1.5">
                                {role.eyebrow}
                              </p>
                              <p className="text-[15px] font-bold text-bark mb-1">
                                {role.label}
                              </p>
                              <p className="text-[12px] text-bark-3 leading-[1.8]">
                                {role.description}
                              </p>
                            </div>
                            <span
                              aria-hidden
                              className={`mt-1 flex-none w-4 h-4 rounded-full border-2 ${
                                active
                                  ? 'border-sage-deep bg-sage-deep'
                                  : 'border-bark-4/30 bg-white'
                              }`}
                            />
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>

                <div className="flex justify-end mt-8 pt-6 border-t border-black/8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    disabled={!selectedRole}
                    className="px-7 py-3 bg-bark text-warm rounded-full text-[13px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px disabled:opacity-40 disabled:hover:translate-y-0 inline-flex items-center gap-2"
                  >
                    次へ進む
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-bark tracking-[-0.015em] mb-2">
                  プロフィールをご入力ください
                </h2>
                <p className="text-[13px] text-bark-2 leading-[1.9] mb-6">
                  {selectedRoleData?.label}として登録します。
                </p>

                {error && (
                  <div className="mb-5 p-4 bg-white border border-black/10 rounded-[10px] text-[13px] text-bark-2 leading-[1.7]">
                    <span className="font-bold text-bark">保存できませんでした</span>
                    <span className="block mt-1">{error}</span>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      表示名
                      <span className="text-[10px] text-sage-deep tracking-[0.16em]">
                        REQUIRED
                      </span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="お名前または会社名"
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03-1234-5678"
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      ご住所
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="東京都〇〇区〇〇"
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/8">
                  <button
                    type="button"
                    onClick={() => { setCurrentStep(0); setError('') }}
                    className="text-[13px] text-bark-3 font-semibold hover:text-bark transition-colors inline-flex items-center gap-1.5"
                  >
                    <span aria-hidden>←</span>
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving || !name.trim()}
                    className="px-7 py-3 bg-bark text-warm rounded-full text-[13px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px disabled:opacity-40 disabled:hover:translate-y-0 inline-flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                    保存して次へ
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center py-2">
                <div className="flex items-center justify-center gap-3 mb-5 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                  READY
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                </div>
                <h2 className="text-[22px] md:text-[24px] font-bold text-bark tracking-[-0.02em] mb-3 [word-break:keep-all]">
                  これで準備が整いました
                </h2>
                <p className="text-[13px] text-bark-2 leading-[1.95] mb-8">
                  {selectedRoleData?.label}として、Ouverをご利用いただけます。
                  <br />
                  まずはダッシュボードから、ご確認ください。
                </p>
                <button
                  type="button"
                  onClick={() => router.push(selectedRoleData?.href ?? '/')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
                >
                  ダッシュボードへ
                  <span aria-hidden>→</span>
                </button>
              </div>
            )}
          </div>

          {currentStep < 2 && (
            <p className="text-center text-[12px] text-bark-4 mt-7">
              <Link
                href="/"
                className="underline-offset-[4px] hover:underline decoration-bark-4/40"
              >
                あとで設定する
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
