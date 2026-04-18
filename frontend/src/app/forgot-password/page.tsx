'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('メールアドレスをご入力ください。')
      return
    }

    setSending(true)
    try {
      await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo: `${window.location.origin}/reset-password` }),
        credentials: 'include',
      })
      // メールアドレスの存在を漏らさないため、結果に関わらず送信完了として扱う
      setSent(true)
    } catch {
      setError('送信できませんでした。少し時間をおいて、もう一度お試しください。')
    }
    setSending(false)
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
        <div className="w-full max-w-[440px]">
          {sent ? (
            <>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                  EMAIL SENT
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                </div>
                <h1 className="font-bold text-[clamp(28px,3.6vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
                  メールをお送りしました
                </h1>
                <p className="text-[13px] text-bark-2 leading-[1.95]">
                  ご入力のメールアドレスに、パスワード再設定のリンクをお送りしました。
                  <br />
                  届かない場合は、迷惑メールフォルダもご確認ください。
                </p>
              </div>

              <div className="surface-card rounded-[16px] p-8 md:p-10 text-center">
                <p className="text-[13px] text-bark-2 leading-[1.9] mb-6">
                  リンクの有効期限は1時間です。
                  <br />
                  お心当たりのないメールが届いた場合は、お手数ですが破棄してください。
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full py-3.5 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
                >
                  ログインに戻る
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                  RESET PASSWORD
                  <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
                </div>
                <h1 className="font-bold text-[clamp(28px,3.6vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-3 [word-break:keep-all]">
                  パスワードを
                  <br />
                  再設定します
                </h1>
                <p className="text-[13px] text-bark-2 leading-[1.9]">
                  ご登録のメールアドレスをご入力ください。再設定用のリンクをお送りします。
                </p>
              </div>

              <div className="surface-card rounded-[16px] p-8 md:p-10">
                {error && (
                  <div className="mb-5 p-4 bg-white border border-black/10 rounded-[10px] text-[13px] text-bark-2 leading-[1.7]">
                    <span className="font-bold text-bark">送信できませんでした</span>
                    <span className="block mt-1">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      メールアドレス
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
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
                  >
                    {sending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                    再設定リンクを送る
                  </button>
                </form>
              </div>

              <p className="text-center text-[13px] text-bark-2 mt-7">
                パスワードを思い出した方は
                <Link
                  href="/login"
                  className="text-sage-deep font-bold ml-1 underline-offset-[4px] hover:underline decoration-sage-deep/40"
                >
                  ログイン
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
