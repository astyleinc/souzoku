'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { api } from '@/lib/api'

type RoleOption = 'seller' | 'buyer'

const roleDashboard: Record<string, string> = {
  seller: '/seller',
  buyer: '/buyer',
}

const REFERRAL_STORAGE_KEY = 'ouver:referral'

type ReferralContext = {
  code?: string
  nwId?: string
}

const readAndPersistReferral = (searchParams: URLSearchParams): ReferralContext => {
  if (typeof window === 'undefined') return {}

  const refFromQuery = searchParams.get('ref') ?? undefined
  const nwFromQuery = searchParams.get('nw') ?? undefined

  if (refFromQuery || nwFromQuery) {
    try {
      window.localStorage.setItem(
        REFERRAL_STORAGE_KEY,
        JSON.stringify({ code: refFromQuery, nwId: nwFromQuery }),
      )
    } catch {}
    return { code: refFromQuery, nwId: nwFromQuery }
  }

  try {
    const stored = window.localStorage.getItem(REFERRAL_STORAGE_KEY)
    if (stored) return JSON.parse(stored) as ReferralContext
  } catch {}
  return {}
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm" />}>
      <RegisterForm />
    </Suspense>
  )
}

const RoleMark = ({ type }: { type: RoleOption }) => {
  if (type === 'seller') {
    return (
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        className="w-7 h-7 text-sage-deep"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 22 L24 10 L40 22 V38 A1 1 0 0 1 39 39 H30 V28 H18 V39 H9 A1 1 0 0 1 8 38 V22 Z" />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className="w-7 h-7 text-sage-deep"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="20" cy="22" r="10" />
      <path d="M28 30 L38 40" />
      <path d="M15 22 L25 22" />
    </svg>
  )
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, login } = useAuth()
  const [step, setStep] = useState<'role' | 'form'>('role')
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null)
  const [referral, setReferral] = useState<ReferralContext>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.replace(roleDashboard[user.role] ?? '/')
    }
  }, [user, router])

  useEffect(() => {
    setReferral(readAndPersistReferral(searchParams))
  }, [searchParams])

  if (user) return null

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('お名前をご入力ください。')
      return
    }
    if (!email) {
      setError('メールアドレスをご入力ください。')
      return
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上でお願いします。')
      return
    }
    if (password !== passwordConfirm) {
      setError('パスワードが一致しません。もう一度ご確認ください。')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: name.trim(),
          role: selectedRole,
        }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.message ?? '登録できませんでした。少し時間をおいてから、もう一度お試しください。')
        setLoading(false)
        return
      }

      const loginResult = await login(email, password)

      if (loginResult.success && selectedRole === 'seller' && (referral.code || referral.nwId)) {
        await api.post('/referrals/link', {
          code: referral.code,
          nwCompanyId: referral.nwId,
        })
        try {
          if (referral.nwId) {
            window.localStorage.setItem(
              REFERRAL_STORAGE_KEY,
              JSON.stringify({ nwId: referral.nwId }),
            )
          } else {
            window.localStorage.removeItem(REFERRAL_STORAGE_KEY)
          }
        } catch {}
      }

      setLoading(false)

      if (loginResult.success) {
        router.push(roleDashboard[selectedRole ?? 'buyer'] ?? '/')
      } else {
        router.push('/login')
      }
    } catch {
      setError('通信エラーが発生しました。時間をおいて、もう一度お試しください。')
      setLoading(false)
    }
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
        <div className="w-full max-w-[460px]">
          {step === 'role' ? (
            <div>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                  SIGN UP
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                </div>
                <h1 className="font-bold text-[clamp(28px,3.6vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
                  新規登録
                </h1>
                <p className="text-[13px] text-bark-2 leading-[1.9]">
                  まずは、どちらのお立場で登録されるかを選んでください。
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('seller')}
                  className="w-full surface-card rounded-[14px] p-6 text-left group transition-[transform,box-shadow] hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sage-xlight rounded-[10px] flex items-center justify-center shrink-0">
                      <RoleMark type="seller" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] tracking-[0.24em] font-semibold text-sage-deep mb-1">
                        FOR SELLER
                      </div>
                      <p className="text-[16px] font-bold text-bark tracking-[-0.01em] mb-1.5 group-hover:text-sage-deep transition-colors">
                        不動産を売りたい
                      </p>
                      <p className="text-[13px] text-bark-2 leading-[1.85]">
                        相続した不動産を、入札で売却できます。
                      </p>
                    </div>
                    <span aria-hidden className="text-sage-deep/70 text-[16px] pt-2 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('buyer')}
                  className="w-full surface-card rounded-[14px] p-6 text-left group transition-[transform,box-shadow] hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sage-xlight rounded-[10px] flex items-center justify-center shrink-0">
                      <RoleMark type="buyer" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] tracking-[0.24em] font-semibold text-sage-deep mb-1">
                        FOR BUYER
                      </div>
                      <p className="text-[16px] font-bold text-bark tracking-[-0.01em] mb-1.5 group-hover:text-sage-deep transition-colors">
                        不動産を買いたい
                      </p>
                      <p className="text-[13px] text-bark-2 leading-[1.85]">
                        相続不動産を検索し、入札できます。
                      </p>
                    </div>
                    <span aria-hidden className="text-sage-deep/70 text-[16px] pt-2 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </button>
              </div>

              <p className="text-center text-[12px] text-bark-3 mt-7 leading-[1.85]">
                士業・提携業者の方は
                <Link
                  href="/partners"
                  className="text-sage-deep font-semibold ml-1 underline-offset-[4px] hover:underline decoration-sage-deep/40"
                >
                  パートナーのご案内
                </Link>
                をご覧ください。
              </p>

              <p className="text-center text-[13px] text-bark-2 mt-4">
                すでにアカウントをお持ちの方は
                <Link
                  href="/login"
                  className="text-sage-deep font-bold ml-1 underline-offset-[4px] hover:underline decoration-sage-deep/40"
                >
                  ログイン
                </Link>
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-7">
                <button
                  type="button"
                  onClick={() => { setStep('role'); setError(null) }}
                  className="text-[12px] text-bark-3 hover:text-bark inline-flex items-center gap-1.5 mb-5"
                >
                  <span aria-hidden>←</span>
                  戻る
                </button>
                <div className="flex items-center gap-3 mb-4 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                  {selectedRole === 'seller' ? 'FOR SELLER' : 'FOR BUYER'}
                </div>
                <h1 className="font-bold text-[clamp(24px,3vw,30px)] leading-[1.3] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
                  {selectedRole === 'seller' ? '売主として登録' : '買い手として登録'}
                </h1>
                <p className="text-[13px] text-bark-2 leading-[1.9]">
                  ご入力いただいた情報は、アカウント管理以外の目的では使いません。
                </p>
              </div>

              <div className="surface-card rounded-[14px] p-7 md:p-8">
                {error && (
                  <div className="mb-5 p-4 bg-white border border-black/10 rounded-[10px] text-[13px] text-bark-2 leading-[1.7]">
                    <span className="font-bold text-bark">登録できませんでした</span>
                    <span className="block mt-1">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      {selectedRole === 'buyer' ? 'お名前 / 会社名' : 'お名前'} <span className="text-bark">＊</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === 'buyer' ? '山田 太郎 / 株式会社〇〇' : '山田 太郎'}
                      autoComplete="name"
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      メールアドレス <span className="text-bark">＊</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mail@example.com"
                      autoComplete="email"
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      パスワード <span className="text-bark">＊</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="8文字以上"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                    />
                    <p className="text-[11px] text-bark-4 mt-1.5 leading-[1.7]">
                      半角英数字で8文字以上にしてください。
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      パスワード（確認） <span className="text-bark">＊</span>
                    </label>
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="もう一度ご入力ください"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                    アカウントを作成する
                  </button>
                </form>

                <p className="mt-6 text-center text-[11px] text-bark-4 leading-[1.85]">
                  登録すると
                  <Link href="/terms" className="text-sage-deep underline underline-offset-[3px] decoration-sage-deep/30 mx-0.5">
                    利用規約
                  </Link>
                  と
                  <Link href="/privacy" className="text-sage-deep underline underline-offset-[3px] decoration-sage-deep/30 mx-0.5">
                    プライバシーポリシー
                  </Link>
                  に同意したことになります。
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
