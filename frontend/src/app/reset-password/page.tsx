'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checks = useMemo(() => ({
    length: password.length >= 8,
    alphanumeric: /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
  }), [password])

  const isValid = checks.length && checks.alphanumeric && password === confirm && confirm.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('リセットトークンが見つかりません。メールのリンクを再度クリックしてください。')
      return
    }

    if (!isValid) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
        credentials: 'include',
      })

      if (res.ok) {
        setDone(true)
      } else {
        const json = await res.json().catch(() => null)
        setError(json?.message ?? 'パスワードの変更に失敗しました。リンクの有効期限が切れている可能性があります。')
      }
    } catch {
      setError('通信エラーが発生しました。時間をおいて再度お試しください。')
    }
    setSubmitting(false)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-primary-500 tracking-tight">
              Ouver
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-warning-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">無効なリンクです</h1>
            <p className="text-sm text-neutral-400 mb-6">
              パスワードリセットのリンクが無効です。<br />
              もう一度パスワードリセットをお試しください。
            </p>
            <Link href="/forgot-password" className="text-sm text-primary-500 hover:underline">
              パスワードリセットに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-500 tracking-tight">
            Ouver
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {done ? (
            <div className="text-center">
              <CheckCircle className="w-10 h-10 text-success-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">パスワードを変更しました</h1>
              <p className="text-sm text-neutral-400 mb-6">
                新しいパスワードでログインできます。
              </p>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
              >
                ログインする
              </Link>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Lock className="w-6 h-6 text-primary-500" />
              </div>

              <h1 className="text-xl font-bold text-center mb-2">新しいパスワードを設定</h1>
              <p className="text-sm text-neutral-400 text-center mb-6">
                新しいパスワードを入力してください。
              </p>

              {error && (
                <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">新しいパスワード</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="8文字以上で入力"
                      className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">パスワード確認</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="もう一度入力"
                      className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-xs text-error-500 mt-1">パスワードが一致しません</p>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-neutral-400">
                  <p className="font-medium">パスワード要件:</p>
                  <div className="space-y-1 pl-1">
                    <p className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3.5 h-3.5 ${checks.length ? 'text-success-500' : 'text-neutral-300'}`} />
                      8文字以上
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3.5 h-3.5 ${checks.alphanumeric ? 'text-success-500' : 'text-neutral-300'}`} />
                      英字と数字を含む
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  className="w-full py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  パスワードを変更する
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-primary-500 hover:underline">
                  ログインページに戻る
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
