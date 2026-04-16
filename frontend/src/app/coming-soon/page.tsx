'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    await api.post('/subscribe', { email })
    setSubmitted(true)
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

      <main className="flex-1 flex items-center justify-center px-4 pb-24">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-cta-50 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-cta-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            この機能は準備中です
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed mb-6">
            現在開発中の機能です。リリース時にお知らせをご希望の場合は、<br />
            メールアドレスをご登録ください。
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-sm text-success-600 mb-6">
              <CheckCircle className="w-4 h-4" />
              登録ありがとうございます。リリース時にお知らせします。
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto mb-6">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレス"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors shrink-0"
              >
                通知を受け取る
              </button>
            </form>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            トップに戻る
          </Link>
        </div>
      </main>
    </div>
  )
}
