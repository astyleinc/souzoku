'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('メールアドレスを入力してください')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo: `${window.location.origin}/reset-password` }),
        credentials: 'include',
      })

      // 成功・失敗に関わらず送信完了表示（メールアドレスの存在を漏らさない）
      setSent(true)
    } catch {
      setError('送信に失敗しました。時間をおいて再度お試しください。')
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* ヘッダー */}
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

      {/* メイン */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-card p-8">
            {sent ? (
              <div className="text-center">
                <CheckCircle className="w-10 h-10 text-success-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-foreground mb-2">メールを送信しました</h1>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  入力されたメールアドレスにパスワード再設定用のリンクをお送りしました。
                  メールが届かない場合は、迷惑メールフォルダをご確認ください。
                </p>
                <Link
                  href="/login"
                  className="text-sm text-primary-500 hover:underline"
                >
                  ログインに戻る
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-xl font-bold text-foreground mb-2">パスワードをリセット</h1>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    登録済みのメールアドレスを入力してください。<br />
                    パスワード再設定用のリンクをお送りします。
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
                      メールアドレス
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
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                    リセットリンクを送信
                  </button>
                </form>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 mt-6 text-sm text-neutral-400 hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  ログインに戻る
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
