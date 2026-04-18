'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}

const Shell = ({ children }: { children: React.ReactNode }) => (
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
      <div className="w-full max-w-[440px]">{children}</div>
    </main>
  </div>
)

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
      setError('再設定用のトークンが見つかりませんでした。メールに届いたリンクをもう一度開いてください。')
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
        setError(json?.message ?? 'パスワードを変更できませんでした。リンクの有効期限が切れている可能性があります。')
      }
    } catch {
      setError('通信エラーが発生しました。少し時間をおいて、もう一度お試しください。')
    }
    setSubmitting(false)
  }

  if (!token) {
    return (
      <Shell>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
            INVALID LINK
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
          </div>
          <h1 className="font-bold text-[clamp(28px,3.6vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
            リンクが
            <br />
            無効になっています
          </h1>
          <p className="text-[13px] text-bark-2 leading-[1.9]">
            お手数ですが、もう一度パスワードの再設定を行ってください。
          </p>
        </div>
        <div className="surface-card rounded-[16px] p-8 md:p-10 text-center">
          <p className="text-[13px] text-bark-2 leading-[1.9] mb-6">
            リンクの有効期限が切れているか、一度使用された可能性があります。
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center w-full py-3.5 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
          >
            再設定をやり直す
          </Link>
        </div>
      </Shell>
    )
  }

  if (done) {
    return (
      <Shell>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
            COMPLETED
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
          </div>
          <h1 className="font-bold text-[clamp(28px,3.6vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
            パスワードを
            <br />
            変更しました
          </h1>
          <p className="text-[13px] text-bark-2 leading-[1.9]">
            新しいパスワードで、ログインいただけます。
          </p>
        </div>
        <div className="surface-card rounded-[16px] p-8 md:p-10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full py-3.5 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
          >
            ログインに進む
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
          <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
          NEW PASSWORD
          <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
        </div>
        <h1 className="font-bold text-[clamp(28px,3.6vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
          新しいパスワードを
          <br />
          ご入力ください
        </h1>
        <p className="text-[13px] text-bark-2 leading-[1.9]">
          これから使うパスワードを、2回ご入力ください。
        </p>
      </div>

      <div className="surface-card rounded-[16px] p-8 md:p-10">
        {error && (
          <div className="mb-5 p-4 bg-white border border-black/10 rounded-[10px] text-[13px] text-bark-2 leading-[1.7]">
            <span className="font-bold text-bark">変更できませんでした</span>
            <span className="block mt-1">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
              新しいパスワード
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上でご入力ください"
                className="w-full px-4 py-3 pr-16 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold tracking-[0.08em] text-sage-deep hover:text-bark transition-colors px-2 py-1"
              >
                {showPassword ? '非表示' : '表示'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
              確認のためもう一度
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="同じパスワードをご入力ください"
                className="w-full px-4 py-3 pr-16 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold tracking-[0.08em] text-sage-deep hover:text-bark transition-colors px-2 py-1"
              >
                {showConfirm ? '非表示' : '表示'}
              </button>
            </div>
            {confirm && password !== confirm && (
              <p className="text-[12px] text-bark-3 mt-2">パスワードが一致していません。</p>
            )}
          </div>

          <ul className="text-[12px] text-bark-3 leading-[1.85] space-y-1.5 pt-1">
            <li className="flex items-center gap-2">
              <span
                aria-hidden
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  checks.length ? 'bg-sage-deep' : 'bg-bark-4/30'
                }`}
              />
              <span className={checks.length ? 'text-bark-2' : 'text-bark-4'}>8文字以上</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  checks.alphanumeric ? 'bg-sage-deep' : 'bg-bark-4/30'
                }`}
              />
              <span className={checks.alphanumeric ? 'text-bark-2' : 'text-bark-4'}>
                英字と数字を両方含む
              </span>
            </li>
          </ul>

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full py-3.5 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
            パスワードを変更する
          </button>
        </form>
      </div>

      <p className="text-center text-[13px] text-bark-2 mt-7">
        <Link
          href="/login"
          className="text-sage-deep underline-offset-[4px] hover:underline decoration-sage-deep/40"
        >
          ログインに戻る
        </Link>
      </p>
    </Shell>
  )
}
