'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || submitting) return
    setSubmitting(true)
    await api.post('/subscribe', { email })
    setSubmitting(false)
    setSubmitted(true)
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

      <main className="flex-1 flex items-center justify-center px-5 md:px-9 pb-24">
        <div className="w-full max-w-[520px] text-center">
          <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
            COMING SOON
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
          </div>
          <h1 className="font-bold text-[clamp(30px,4vw,42px)] leading-[1.22] tracking-[-0.02em] text-bark mb-4 [word-break:keep-all]">
            この機能は、
            <br />
            もうすぐ公開します
          </h1>
          <p className="text-[14px] text-bark-2 leading-[1.95] mb-10">
            ただいま、準備を進めています。公開のお知らせを希望される方は、メールアドレスをご登録ください。
          </p>

          <div className="surface-card rounded-[16px] p-7 md:p-10 mb-10">
            {submitted ? (
              <div className="py-2">
                <p className="text-[14px] text-sage-deep font-bold mb-2">
                  ご登録ありがとうございます
                </p>
                <p className="text-[13px] text-bark-2 leading-[1.9]">
                  公開のタイミングで、ご入力いただいたメールアドレスにご連絡いたします。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@example.com"
                  autoComplete="email"
                  className="flex-1 px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-bark text-warm rounded-full text-[13px] font-bold tracking-[0.01em] whitespace-nowrap transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                  お知らせを受け取る
                </button>
              </form>
            )}
          </div>

          <Link
            href="/"
            className="text-[13px] text-bark-3 hover:text-bark transition-colors inline-flex items-center gap-1.5 underline-offset-[4px] hover:underline decoration-bark-3/40"
          >
            <span aria-hidden>←</span>
            トップへ戻る
          </Link>
        </div>
      </main>
    </div>
  )
}
