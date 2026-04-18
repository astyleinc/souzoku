'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { api } from '@/lib/api'

type Topic = {
  key: string
  label: string
  body: string
}

const TOPICS: Topic[] = [
  {
    key: 'service',
    label: 'サービスについて',
    body: '入札のしくみや対応エリアなど、サービス全般のご質問',
  },
  {
    key: 'property',
    label: '物件の掲載',
    body: '相続した不動産の掲載や、審査の流れについて',
  },
  {
    key: 'bid',
    label: '入札について',
    body: '入札の仕方、期間、金額の変更など',
  },
  {
    key: 'professional',
    label: '士業の方のご登録',
    body: '税理士・司法書士・弁護士・行政書士の方からのご相談',
  },
  {
    key: 'broker',
    label: '提携宅建業者の募集',
    body: '宅建業の免許をお持ちの業者さまからのご相談',
  },
  {
    key: 'account',
    label: 'アカウント・その他',
    body: 'アカウントや請求、プライバシーに関すること',
  },
]

export default function ContactPage() {
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [content, setContent] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email || !content.trim()) {
      setError('お名前・メールアドレス・お問い合わせ内容をご入力ください。')
      return
    }
    if (!agreed) {
      setError('プライバシーポリシーにご同意のうえ、送信してください。')
      return
    }

    setSending(true)
    const res = await api.post('/support/contact', {
      name: name.trim(),
      email,
      phone: phone || undefined,
      category: category || 'other',
      content: content.trim(),
    })

    if (res.success) {
      setSent(true)
    } else {
      setError('うまく送信できませんでした。少し時間をおいてから、もう一度お試しください。')
    }
    setSending(false)
  }

  return (
    <div className="bg-warm min-h-screen">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                CONTACT
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                お問い合わせ
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[620px] font-medium">
                サービスや料金のこと、登録のことなど、なんでもお聞きください。
                通常2営業日以内にご返信します。
              </p>
            </div>
          </div>
        </section>

        {sent ? (
          <section className="border-t border-black/5">
            <div className="max-w-[720px] mx-auto px-5 md:px-9 py-20 md:py-28 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-xlight mb-8">
                <svg
                  viewBox="0 0 48 48"
                  aria-hidden
                  className="w-10 h-10 text-sage-deep"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="24" cy="24" r="18" />
                  <path d="M15 24 L22 31 L34 17" />
                </svg>
              </div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                SENT
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-5">
                送信が完了しました
              </h2>
              <p className="text-[15px] text-bark-2 leading-[1.95] mb-10">
                お問い合わせ、ありがとうございます。
                <br />
                通常2営業日以内に、ご入力いただいたメールアドレス宛にご返信します。
              </p>
              <div className="flex items-center justify-center gap-5">
                <Link
                  href="/"
                  className="text-[13px] text-bark-2 font-medium underline-offset-[6px] hover:underline decoration-sage-deep/40"
                >
                  トップへ戻る
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-bark text-warm rounded-full text-[13px] font-bold transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
                >
                  よくある質問を見る
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* FORM + CHANNELS */}
            <section className="border-t border-black/5">
              <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-12 md:py-16 grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-14">
                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="surface-card rounded-[14px] p-7 md:p-10 space-y-6"
                >
                  <div>
                    <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-3">
                      FORM
                    </div>
                    <h2 className="text-[24px] md:text-[28px] font-bold text-bark tracking-[-0.02em] leading-[1.3]">
                      お問い合わせフォーム
                    </h2>
                  </div>

                  {error && (
                    <div className="p-4 bg-white border border-black/10 rounded-[10px] text-[13px] text-bark-2 leading-[1.7]">
                      <span className="font-bold text-bark">送信できませんでした</span>
                      <span className="block mt-1">{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[12px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      お問い合わせ種別
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                    >
                      <option value="">選択してください</option>
                      {TOPICS.map((t) => (
                        <option key={t.key} value={t.key}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                        お名前 <span className="text-bark">＊</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="山田 太郎"
                        className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                        メールアドレス <span className="text-bark">＊</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@example.com"
                        className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      電話番号（任意）
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
                    <label className="block text-[12px] tracking-[0.14em] font-semibold text-bark-3 uppercase mb-2">
                      お問い合わせ内容 <span className="text-bark">＊</span>
                    </label>
                    <textarea
                      rows={7}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="できるだけ具体的にお書きいただけると、スムーズにお返事できます。"
                      className="w-full px-4 py-3 text-[14px] bg-white border border-black/10 rounded-[10px] focus:outline-none focus:border-sage-deep/40 transition-colors resize-y min-h-[160px]"
                    />
                  </div>

                  <label className="flex items-start gap-3 text-[13px] text-bark-2 leading-[1.85] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-[5px] accent-bark"
                    />
                    <span>
                      <Link
                        href="/privacy"
                        className="text-sage-deep underline underline-offset-[4px] decoration-sage-deep/30"
                      >
                        プライバシーポリシー
                      </Link>
                      に同意して送信します
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 bg-bark text-warm rounded-full text-[14px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {sending ? '送信中…' : '送信する'}
                  </button>
                </form>

                {/* SIDEBAR */}
                <aside className="space-y-8">
                  <div>
                    <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                      DIRECT
                    </div>
                    <h3 className="text-[20px] font-bold text-bark tracking-[-0.015em] mb-5 leading-[1.4]">
                      直接のご連絡先
                    </h3>
                    <dl className="divide-y divide-black/8 border-y border-black/8">
                      <div className="py-4">
                        <dt className="text-[11px] tracking-[0.2em] text-bark-4 font-semibold uppercase mb-1.5">
                          メール
                        </dt>
                        <dd className="text-[15px] text-bark font-bold">
                          support@ouver.co.jp
                        </dd>
                      </div>
                      <div className="py-4">
                        <dt className="text-[11px] tracking-[0.2em] text-bark-4 font-semibold uppercase mb-1.5">
                          お電話
                        </dt>
                        <dd className="text-[13px] text-bark-2 leading-[1.7]">
                          電話窓口はただいま準備中です。お急ぎの場合も、フォームからご連絡ください。
                        </dd>
                      </div>
                      <div className="py-4">
                        <dt className="text-[11px] tracking-[0.2em] text-bark-4 font-semibold uppercase mb-1.5">
                          対応時間
                        </dt>
                        <dd className="text-[13px] text-bark-2 leading-[1.7]">
                          平日 10:00 – 18:00（土日祝を除く）
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                      TOPICS
                    </div>
                    <h3 className="text-[20px] font-bold text-bark tracking-[-0.015em] mb-5 leading-[1.4]">
                      よくある相談
                    </h3>
                    <ul className="space-y-2.5">
                      {TOPICS.map((t) => (
                        <li key={t.key}>
                          <button
                            type="button"
                            onClick={() => setCategory(t.key)}
                            className="w-full text-left px-4 py-3 rounded-[10px] border border-black/8 bg-white hover:border-sage-deep/30 transition-colors"
                          >
                            <div className="text-[13px] font-bold text-bark mb-0.5">
                              {t.label}
                            </div>
                            <div className="text-[12px] text-bark-3 leading-[1.65]">
                              {t.body}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 bg-sage-xlight/60 rounded-[12px] text-[13px] text-bark-2 leading-[1.85]">
                    先に
                    <Link
                      href="/faq"
                      className="text-sage-deep font-semibold underline underline-offset-[4px] decoration-sage-deep/30 mx-1"
                    >
                      よくある質問
                    </Link>
                    をご覧いただくと、その場で解決することもあります。
                  </div>
                </aside>
              </div>
            </section>

            {/* CTA BAND */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format"
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover object-[center_40%]"
                />
                <div className="absolute inset-0 cta-gradient" />
              </div>
              <div className="relative z-[1] max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-16 flex flex-wrap items-center justify-between gap-8">
                <div>
                  <div className="text-[12px] tracking-[0.32em] font-semibold text-sage mb-3">
                    GET STARTED
                  </div>
                  <h2 className="text-warm font-bold text-[clamp(20px,2.4vw,26px)] tracking-[-0.02em] leading-[1.3]">
                    まずは登録だけ、という方も大歓迎です
                  </h2>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-bark rounded-full text-[13px] font-bold whitespace-nowrap transition-[transform,opacity] hover:opacity-95 hover:-translate-y-px"
                >
                  無料で登録する
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
