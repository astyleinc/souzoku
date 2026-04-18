import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '会社概要｜Ouver',
  description:
    '相続不動産の売却を、もっと透明で、もっと納得のいく形へ。株式会社Ouverの事業と提携ネットワークをご紹介します。',
}

type Reason = {
  eyebrow: string
  title: string
  body: string
  mark: 'growth' | 'expertise' | 'transparency'
}

const REASONS: Reason[] = [
  {
    eyebrow: 'SOCIAL ISSUE',
    title: '増え続ける空き家',
    body: '高齢化が進むにつれて、相続で受け継がれる不動産が増え続けています。早めに売却できる仕組みをつくることが、空き家問題の解消にもつながると考えています。',
    mark: 'growth',
  },
  {
    eyebrow: 'EXPERTISE',
    title: '専門家の力が必要',
    body: '登記、税務、遺産分割。相続した不動産の売却には、士業の支えが欠かせません。私たちはその連携を前提に設計しています。',
    mark: 'expertise',
  },
  {
    eyebrow: 'TRANSPARENCY',
    title: '透明さへの期待',
    body: '業者の査定だけでは、その値段が本当に適正なのか分かりません。入札で価格をつくることで、売主も買い手も納得できる場になります。',
    mark: 'transparency',
  },
]

const COMPANY = [
  ['会社名', '株式会社Ouver'],
  ['設立', '2025年'],
  ['代表者', '代表取締役 ○○ ○○'],
  ['所在地', '東京都○○区○○ ○丁目○番○号'],
  ['事業内容', '相続不動産マッチングプラットフォームの企画・開発・運営'],
  ['URL', 'https://ouver.jp'],
] as const

const STATS = [
  { value: '50', unit: '名以上', label: '士業パートナー' },
  { value: '30', unit: '社以上', label: '提携宅建業者' },
  { value: '5', unit: '団体', label: '士業ネットワーク' },
] as const

const PRINCIPLES = [
  {
    step: '01',
    title: '売主の負担を、小さく',
    body: '相続は、時間も気持ちも余裕のない状況で起こります。手続きと窓口をひとつにまとめ、売主が抱える負担を最小限に。',
  },
  {
    step: '02',
    title: '価格の決まり方を、透明に',
    body: '査定ではなく入札で価格をつくる。どこからいくらの金額が集まったかを見える形にし、納得のいく判断をしやすくします。',
  },
  {
    step: '03',
    title: '専門家の支えを、身近に',
    body: '税理士・司法書士・宅建業者の連携を前提に設計しています。一人で抱え込まず、必要なときに必要な専門家に相談できる仕組みです。',
  },
]

const ReasonMark = ({ type }: { type: Reason['mark'] }) => {
  if (type === 'growth') {
    return (
      <svg
        viewBox="0 0 80 80"
        aria-hidden
        className="w-14 h-14 text-sage-deep/75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 60 L30 42 L42 52 L66 22" />
        <path d="M54 22 L66 22 L66 34" />
        <line x1="12" y1="70" x2="68" y2="70" />
      </svg>
    )
  }
  if (type === 'expertise') {
    return (
      <svg
        viewBox="0 0 80 80"
        aria-hidden
        className="w-14 h-14 text-sage-deep/75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="28" cy="28" r="9" />
        <circle cx="52" cy="28" r="9" />
        <path d="M14 60 Q28 46 42 60" />
        <path d="M38 60 Q52 46 66 60" />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className="w-14 h-14 text-sage-deep/75"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="40" cy="40" r="22" />
      <path d="M40 18 V62" strokeDasharray="2 4" />
      <path d="M18 40 H62" strokeDasharray="2 4" />
      <circle cx="40" cy="40" r="4" fill="currentColor" />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-14 md:pb-20 grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                ABOUT OUVER
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                相続不動産の売却を、
                <br />
                もっと納得のいく形へ。
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[560px] font-medium">
                入札で価格をつくり、士業ネットワークで信頼できる人をつなぐ。
                Ouverは、相続不動産の売却を支えるプラットフォームです。
              </p>
            </div>
            <div className="relative aspect-[4/5] md:aspect-[4/5] rounded-[18px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format"
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-[center_40%]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-bark/30 via-transparent to-transparent"
              />
              <div
                aria-hidden
                className="absolute left-0 bottom-0 w-20 h-px bg-warm/80 ml-6 mb-6"
              />
              <span className="absolute left-6 bottom-8 text-warm text-[10px] tracking-[0.3em] font-semibold">
                EST. 2025 — TOKYO
              </span>
            </div>
          </div>
        </section>

        {/* STATEMENT STRIP — ダーク bark */}
        <section className="relative overflow-hidden bg-bark text-warm">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(247,245,239,0.9) 1px, transparent 1.4px)',
              backgroundSize: '18px 18px',
            }}
          />
          <div className="relative max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[820px]">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage mb-5">
                OUR ROLE
              </div>
              <p className="text-[clamp(22px,2.6vw,32px)] font-bold tracking-[-0.02em] leading-[1.6] text-warm">
                私たちの役割は、取引の「場」をつくること。
                <br />
                <span className="text-warm-2/80">
                  売主・買い手・専門家の三者が、同じ情報を見て、同じ目線で判断できる場を。
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* MISSION */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[280px_1fr] gap-10 md:gap-20">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                MISSION
              </div>
              <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold text-bark tracking-[-0.02em] leading-[1.3]">
                私たちが
                <br />
                目指すこと
              </h2>
            </div>
            <div className="max-w-[720px] space-y-5 text-[16px] text-bark-2 leading-[2]">
              <p>
                相続で不動産を受け継いだ方の多くは、時間も気持ちも余裕のない状況に置かれています。
                その上、不慣れな売却手続きに向き合わなければなりません。
              </p>
              <p>
                Ouverは、入札で透明な価格をつくり、士業ネットワークで信頼できる人をつなぐ仕組みです。
                売主・買い手・専門家の三者が、同じ情報を見て納得のいく判断ができる場を目指しています。
              </p>
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                PRINCIPLES
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25]">
                大事にしていること
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {PRINCIPLES.map((p) => (
                <article
                  key={p.step}
                  className="surface-card rounded-[14px] p-8 md:p-10"
                >
                  <div className="text-[13px] tracking-[0.24em] font-bold text-sage-deep mb-5">
                    {p.step}
                  </div>
                  <h3 className="text-[20px] font-bold text-bark tracking-[-0.015em] mb-3 leading-[1.4]">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-bark-2 leading-[1.95]">{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHY — 相続に特化する理由 */}
        <section className="relative border-t border-black/5 overflow-hidden">
          <svg
            aria-hidden
            className="absolute -left-16 top-0 w-[360px] h-[360px] text-sage-deep/10 pointer-events-none"
            viewBox="0 0 360 360"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="180" cy="180" r="160" />
            <circle cx="180" cy="180" r="110" />
            <circle cx="180" cy="180" r="60" />
          </svg>
          <div className="relative max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                WHY INHERITANCE
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25]">
                なぜ相続不動産に特化するのか
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {REASONS.map((r, i) => (
                <article
                  key={r.title}
                  className="surface-card rounded-[14px] p-8 md:p-10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[12px] tracking-[0.24em] font-bold text-sage-deep">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="block w-6 h-px bg-sage-deep/40" />
                    <span className="text-[10px] tracking-[0.28em] font-semibold text-bark-4">
                      {r.eyebrow}
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-[10px] bg-sage-xlight flex items-center justify-center mb-5">
                    <ReasonMark type={r.mark} />
                  </div>
                  <h3 className="text-[19px] font-bold text-bark tracking-[-0.015em] mb-3 leading-[1.4]">
                    {r.title}
                  </h3>
                  <p className="text-[14px] text-bark-2 leading-[1.95]">{r.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 会社情報 */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[280px_1fr] gap-10 md:gap-20">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                COMPANY
              </div>
              <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold text-bark tracking-[-0.02em] leading-[1.3]">
                会社情報
              </h2>
            </div>
            <dl className="divide-y divide-black/5 border-y border-black/5">
              {COMPANY.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[120px_1fr] md:grid-cols-[200px_1fr] gap-4 py-5"
                >
                  <dt className="text-[11px] tracking-[0.18em] text-bark-4 font-semibold uppercase pt-1">
                    {label}
                  </dt>
                  <dd className="text-[15px] text-bark leading-[1.8] font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* NETWORK STATS */}
        <section className="border-t border-black/5 bg-warm">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                NETWORK
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-3">
                提携ネットワーク
              </h2>
              <p className="text-[13px] text-bark-3">※ 立ち上げ時点での目標数値を含みます</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="relative py-6 md:py-2 md:px-8 border-t md:border-t-0 md:border-l border-sage-deep/20 first:border-t-0 md:first:border-l-0"
                >
                  <div className="text-[12px] tracking-[0.24em] font-bold text-sage-deep mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="price text-sage-deep text-[64px] md:text-[80px] font-bold leading-none tracking-[-0.03em]">
                      {s.value}
                    </span>
                    <span className="text-[14px] text-bark-3 font-medium">{s.unit}</span>
                  </div>
                  <div className="text-[14px] text-bark-2 mt-3 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — フォト背景 */}
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
                まずは、使ってみてください
              </h2>
              <p className="text-warm-2/80 text-[14px] mt-3 max-w-[520px] leading-[1.85]">
                登録も掲載も入札も無料です。気になることがあれば、いつでもお問い合わせください。
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
