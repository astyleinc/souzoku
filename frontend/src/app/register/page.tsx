'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Building2, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

type RoleOption = 'seller' | 'buyer'

const roleDashboard: Record<string, string> = {
  seller: '/seller',
  buyer: '/buyer',
}

export default function RegisterPage() {
  const router = useRouter()
  const { user, login } = useAuth()
  const [step, setStep] = useState<'role' | 'form'>('role')
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null)
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

  if (user) return null

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('お名前を入力してください')
      return
    }
    if (!email) {
      setError('メールアドレスを入力してください')
      return
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上で設定してください')
      return
    }
    if (password !== passwordConfirm) {
      setError('パスワードが一致しません')
      return
    }

    setLoading(true)
    try {
      // BetterAuth でサインアップ
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
        setError(data?.message ?? '登録に失敗しました')
        setLoading(false)
        return
      }

      // 登録成功 → ログイン
      const loginResult = await login(email, password)
      setLoading(false)

      if (loginResult.success) {
        router.push(roleDashboard[selectedRole ?? 'buyer'] ?? '/')
      } else {
        // 登録は成功したがログイン失敗（稀）
        router.push('/login')
      }
    } catch {
      setError('ネットワークエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-sm font-semibold text-foreground">相続不動産マッチング</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          {step === 'role' ? (
            /* ステップ1: ロール選択 */
            <div>
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-foreground mb-2">新規登録</h1>
                <p className="text-sm text-neutral-400">
                  ご利用目的を選択してください
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelect('seller')}
                  className="w-full bg-white rounded-2xl shadow-card p-6 text-left hover:ring-2 hover:ring-primary-300 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                      <Building2 className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">不動産を売却したい</p>
                      <p className="text-sm text-neutral-400 mt-1">
                        相続した不動産を入札方式で売却できます
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('buyer')}
                  className="w-full bg-white rounded-2xl shadow-card p-6 text-left hover:ring-2 hover:ring-cta-300 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cta-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-cta-100 transition-colors">
                      <ShoppingCart className="w-6 h-6 text-cta-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">不動産を購入したい</p>
                      <p className="text-sm text-neutral-400 mt-1">
                        相続不動産を適正価格で購入・入札できます
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <p className="text-center text-xs text-neutral-400 mt-6">
                士業・提携業者の方は
                <Link href="/partners" className="text-primary-500 hover:underline ml-1">パートナー案内</Link>
                をご覧ください
              </p>

              <p className="text-center text-sm text-neutral-400 mt-4">
                すでにアカウントをお持ちの方は
                <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium ml-1">ログイン</Link>
              </p>
            </div>
          ) : (
            /* ステップ2: 入力フォーム */
            <div className="bg-white rounded-2xl shadow-card p-8">
              <div className="mb-6">
                <button
                  onClick={() => { setStep('role'); setError(null) }}
                  className="text-xs text-neutral-400 hover:text-neutral-600 mb-3 inline-block"
                >
                  ← 戻る
                </button>
                <h1 className="text-xl font-bold text-foreground mb-1">
                  {selectedRole === 'seller' ? '売主として登録' : '買い手として登録'}
                </h1>
                <p className="text-sm text-neutral-400">
                  基本情報を入力してください
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                    {selectedRole === 'buyer' ? 'お名前 / 会社名' : 'お名前'} <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'buyer' ? '山田 太郎 / 株式会社〇〇' : '山田 太郎'}
                    autoComplete="name"
                    className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                    メールアドレス <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                    パスワード <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8文字以上"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
                  />
                  <p className="text-xs text-neutral-400 mt-1.5">8文字以上で設定してください</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                    パスワード（確認） <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="もう一度入力"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  アカウントを作成
                </button>
              </form>

              <p className="mt-6 text-center text-[11px] text-neutral-400 leading-relaxed">
                登録することで、
                <Link href="/terms" className="text-primary-500 hover:underline">利用規約</Link>
                および
                <Link href="/privacy" className="text-primary-500 hover:underline">プライバシーポリシー</Link>
                に同意したものとみなされます。
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
