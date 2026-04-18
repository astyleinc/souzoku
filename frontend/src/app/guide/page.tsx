'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

type Role = 'seller' | 'buyer' | 'professional'

type Step = { title: string; body: string; mark: 'upload' | 'review' | 'gavel' | 'handshake' | 'check' | 'search' | 'link' | 'watch' }

type RoleFlow = {
  key: Role
  label: string
  eyebrow: string
  lead: string
  cta: { label: string; href: string }
  steps: Step[]
}

const FLOWS: RoleFlow[] = [
  {
    key: 'seller',
    label: '売主（相続人）',
    eyebrow: 'SELLER',
    lead: '相続した不動産を入札で売る流れをご案内します。書類の準備から成約まで、ダッシュボードで進捗を確認できます。',
    cta: { label: '売主として登録する', href: '/register' },
    steps: [
      {
        title: '物件を登録する',
        body: '相続した不動産の情報と必要書類をアップロードします。士業パートナーに代理で登録してもらうこともできます。',
        mark: 'upload',
      },
      {
        title: '審査と公開',
        body: '運営が情報を確認し、問題なければ公開されます。登記手続き中の物件も、条件付きで公開できます。',
        mark: 'review',
      },
      {
        title: '入札を受ける',
        body: '設定した期間中、不動産会社や個人から入札が届きます。進捗はダッシュボードでいつでも確認できます。',
        mark: 'gavel',
      },
      {
        title: '入札者を選ぶ',
        body: '入札が終わったら、金額だけでなく条件も見たうえで、気に入った買い手を自由に選べます。',
        mark: 'handshake',
      },
      {
        title: '成約・決済',
        body: '提携の宅建業者が仲介実務を進めます。契約から決済完了まで、進捗はダッシュボードで追えます。',
        mark: 'check',
      },
    ],
  },
  {
    key: 'buyer',
    label: '買い手',
    eyebrow: 'BUYER',
    lead: '入札で物件を購入する流れをご案内します。金額は何度でも更新でき、入札期間中のキャンセルも無料です。',
    cta: { label: '買い手として登録する', href: '/register' },
    steps: [
      {
        title: '物件を探す',
        body: 'エリア・価格・種別から、相続不動産を検索。お気に入り登録で、新着の物件通知も届きます。',
        mark: 'search',
      },
      {
        title: '入札する',
        body: '気になる物件に希望金額で入札します。入札期間中なら、何度でも金額を更新できます。',
        mark: 'gavel',
      },
      {
        title: '成約へ',
        body: '売主に選ばれると、提携業者を通じて売買手続きが進みます。進捗はダッシュボードで追えます。',
        mark: 'handshake',
      },
    ],
  },
  {
    key: 'professional',
    label: '士業パートナー',
    eyebrow: 'PROFESSIONAL',
    lead: '相続相談の延長で、不動産の売却もご案内できます。紹介料は成約時にお振り込みします。',
    cta: { label: 'パートナー登録の相談', href: '/contact' },
    steps: [
      {
        title: '紹介リンクを発行',
        body: '相続相談を受けたクライアントに、専用の紹介リンクを共有します。代理での登録も可能です。',
        mark: 'link',
      },
      {
        title: '案件を見守る',
        body: '紹介したクライアントの物件ステータスを、ダッシュボードでいつでも確認できます。',
        mark: 'watch',
      },
      {
        title: '紹介料を受け取る',
        body: '成約時に、仲介手数料の15%が紹介料としてお振り込みされます。',
        mark: 'check',
      },
    ],
  },
]

const StepMark = ({ type }: { type: Step['mark'] }) => {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: 'w-7 h-7 text-sage-deep',
  }
  if (type === 'upload') {
    return (
      <svg {...common}>
        <path d="M12 32 V38 A2 2 0 0 0 14 40 H34 A2 2 0 0 0 36 38 V32" />
        <path d="M24 28 V10" />
        <path d="M16 18 L24 10 L32 18" />
      </svg>
    )
  }
  if (type === 'review') {
    return (
      <svg {...common}>
        <rect x="10" y="8" width="28" height="32" rx="2" />
        <path d="M16 18 H32" />
        <path d="M16 24 H28" />
        <path d="M16 30 H26" />
      </svg>
    )
  }
  if (type === 'gavel') {
    return (
      <svg {...common}>
        <path d="M12 36 H36" />
        <path d="M14 30 L26 18" />
        <rect x="22" y="12" width="14" height="6" rx="1" transform="rotate(45 29 15)" />
      </svg>
    )
  }
  if (type === 'handshake') {
    return (
      <svg {...common}>
        <path d="M8 22 L14 16 L22 22 L18 28 L10 28 L8 22 Z" />
        <path d="M40 22 L34 16 L26 22 L30 28 L38 28 L40 22 Z" />
        <path d="M18 28 L22 32 H26 L30 28" />
      </svg>
    )
  }
  if (type === 'check') {
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="16" />
        <path d="M17 24 L22 29 L32 19" />
      </svg>
    )
  }
  if (type === 'search') {
    return (
      <svg {...common}>
        <circle cx="21" cy="21" r="10" />
        <path d="M29 29 L38 38" />
      </svg>
    )
  }
  if (type === 'link') {
    return (
      <svg {...common}>
        <path d="M20 28 L28 20" />
        <path d="M14 26 L10 22 A4 4 0 0 1 10 16 L16 10 A4 4 0 0 1 22 10 L26 14" />
        <path d="M22 34 L26 38 A4 4 0 0 0 32 38 L38 32 A4 4 0 0 0 38 26 L34 22" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="24" cy="24" r="4" />
      <path d="M8 24 Q16 14 24 14 Q32 14 40 24 Q32 34 24 34 Q16 34 8 24 Z" />
    </svg>
  )
}

export default function GuidePage() {
  const [role, setRole] = useState<Role>('seller')
  const current = FLOWS.find((f) => f.key === role)!

  return (
    <div className="bg-warm min-h-screen">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14 grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                GUIDE
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                ご利用の流れ
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[560px] font-medium">
                Ouverは、相続不動産の売却を入札で進めるマッチングサービスです。
                売主・買い手・士業パートナー、それぞれの使い方をまとめました。
              </p>
            </div>
            <div className="relative aspect-[5/4] md:aspect-[4/5] rounded-[18px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format"
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover object-[center_35%]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-bark/30 via-transparent to-transparent"
              />
              <span className="absolute left-6 bottom-8 text-warm text-[10px] tracking-[0.3em] font-semibold">
                HOW IT WORKS
              </span>
            </div>
          </div>
        </section>

        {/* ROLE TABS */}
        <section className="sticky top-16 z-10 bg-warm/95 backdrop-blur border-y border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-4 flex gap-3 overflow-x-auto">
            {FLOWS.map((f) => {
              const active = role === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setRole(f.key)}
                  className={`shrink-0 inline-flex items-center gap-3 px-5 md:px-6 py-2.5 rounded-full text-[13px] font-bold tracking-[0.01em] transition-colors ${
                    active
                      ? 'bg-bark text-warm'
                      : 'bg-white text-bark-2 border border-black/8 hover:border-black/20'
                  }`}
                >
                  <span
                    className={`text-[10px] tracking-[0.24em] font-semibold ${
                      active ? 'text-sage' : 'text-bark-4'
                    }`}
                  >
                    {f.eyebrow}
                  </span>
                  <span>{f.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* FLOW */}
        <section className="border-b border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-14">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                {current.eyebrow} FLOW
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                {current.label}の使い方
              </h2>
              <p className="text-[15px] text-bark-2 leading-[1.9]">{current.lead}</p>
            </div>

            <ol className="relative space-y-5">
              {current.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="surface-card rounded-[14px] p-7 md:p-10 grid md:grid-cols-[140px_80px_1fr] gap-5 md:gap-10 items-start"
                >
                  <div className="flex items-baseline gap-3 md:block">
                    <span className="price text-[13px] tracking-[0.28em] font-bold text-bark-4">
                      STEP
                    </span>
                    <span className="price text-[48px] md:text-[64px] font-bold text-sage-deep leading-none tracking-[-0.03em]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-[12px] bg-sage-xlight flex items-center justify-center shrink-0">
                    <StepMark type={s.mark} />
                  </div>
                  <div>
                    <h3 className="text-[20px] md:text-[22px] font-bold text-bark tracking-[-0.015em] mb-3 leading-[1.35]">
                      {s.title}
                    </h3>
                    <p className="text-[14px] text-bark-2 leading-[1.95]">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href={current.cta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-bark text-warm rounded-full text-[13px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
              >
                {current.cta.label}
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/faq"
                className="text-[13px] text-bark-2 font-medium underline-offset-[6px] hover:underline decoration-sage-deep/40"
              >
                よくある質問を見る
              </Link>
            </div>
          </div>
        </section>

        {/* CROSS LINKS */}
        <section className="bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                LEARN MORE
              </div>
              <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold text-bark tracking-[-0.025em] leading-[1.25]">
                もっと詳しく知りたい方へ
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  href: '/pricing',
                  label: '料金について',
                  body: '掲載・入札は無料。成約時の手数料と配分の仕組み。',
                },
                {
                  href: '/faq',
                  label: 'よくある質問',
                  body: 'サービス・登録・料金など、19の質問と回答。',
                },
                {
                  href: '/partners',
                  label: 'パートナー制度',
                  body: '士業・宅建業者・NWパートナーの役割と配分。',
                },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="surface-card rounded-[14px] p-7 md:p-8 transition-all hover:-translate-y-0.5 hover:shadow-md group"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <h3 className="text-[17px] font-bold text-bark tracking-[-0.01em]">
                      {c.label}
                    </h3>
                    <span
                      aria-hidden
                      className="text-sage-deep text-[16px] transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                  <p className="text-[13px] text-bark-3 leading-[1.85]">{c.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80&auto=format"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_55%]"
            />
            <div className="absolute inset-0 cta-gradient" />
          </div>
          <div className="relative z-[1] max-w-[1260px] mx-auto px-5 md:px-9 py-16 md:py-20 flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage mb-4">
                GET STARTED
              </div>
              <h2 className="text-warm font-bold text-[clamp(22px,2.8vw,32px)] tracking-[-0.025em] leading-[1.3]">
                まずは登録だけ、でも大丈夫です
              </h2>
              <p className="text-warm-2/80 text-[14px] mt-3 max-w-[520px] leading-[1.85]">
                登録は数分で終わります。わからないことがあれば、いつでもお問い合わせください。
              </p>
            </div>
            <div className="flex items-center gap-5">
              <Link
                href="/contact"
                className="text-[13px] text-warm font-medium underline-offset-[6px] hover:underline decoration-warm/40"
              >
                お問い合わせ
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-bark rounded-full text-[14px] font-bold whitespace-nowrap transition-[transform,opacity] hover:opacity-95 hover:-translate-y-px"
              >
                無料で登録する
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
