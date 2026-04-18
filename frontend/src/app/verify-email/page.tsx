'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm" />}>
      <VerifyEmailContent />
    </Suspense>
  )
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')

  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    if (!emailParam) return
    setResending(true)
    try {
      await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam, callbackURL: `${window.location.origin}/login` }),
        credentials: 'include',
      })
      setResent(true)
    } catch {
      // 失敗しても表示は変えない（メールアドレスの存在を漏らさない）
    }
    setResending(false)
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
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
              <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
              VERIFY EMAIL
              <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
            </div>
            <h1 className="font-bold text-[clamp(28px,3.6vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
              メールを
              <br />
              ご確認ください
            </h1>
            <p className="text-[13px] text-bark-2 leading-[1.95]">
              ご登録のメールアドレスに、確認のリンクをお送りしました。
              メール内のリンクを開いて、ご登録を完了してください。
            </p>
          </div>

          <div className="surface-card rounded-[16px] p-8 md:p-10">
            {emailParam && (
              <div className="mb-6 pb-6 border-b border-black/8">
                <p className="text-[11px] tracking-[0.18em] font-semibold text-bark-4 uppercase mb-2">
                  送信先
                </p>
                <p className="text-[15px] text-bark font-bold break-all">{emailParam}</p>
              </div>
            )}

            {resent ? (
              <div className="text-center py-2">
                <p className="text-[13px] text-sage-deep font-bold">
                  確認メールを再送しました
                </p>
                <p className="text-[12px] text-bark-3 mt-1">
                  届くまで、少しお時間をいただくことがあります。
                </p>
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending || !emailParam}
                className="w-full py-3.5 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
              >
                {resending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                確認メールを再送する
              </button>
            )}

            <div className="mt-7 pt-6 border-t border-black/8">
              <p className="text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-3">
                メールが届かないとき
              </p>
              <ul className="space-y-2 text-[13px] text-bark-2 leading-[1.8]">
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-sage-deep/60"
                  />
                  <span>迷惑メールフォルダをご確認ください</span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-sage-deep/60"
                  />
                  <span>ご入力のメールアドレスが正しいか、ご確認ください</span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-sage-deep/60"
                  />
                  <span>数分経っても届かないときは、再送ボタンをお試しください</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-[13px] text-bark-2 mt-7">
            <Link
              href="/login"
              className="text-sage-deep underline-offset-[4px] hover:underline decoration-sage-deep/40"
            >
              ログインに戻る
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
