import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'パートナー制度｜Ouver',
  description:
    '税理士・司法書士・宅建業者・全国ネットワークと手を組んで、相続不動産の売却を支えています。紹介料と案件配分の仕組みをご案内します。',
}

type Partner = {
  eyebrow: string
  title: string
  lead: string
  benefits: string[]
  mark: 'professional' | 'broker' | 'network'
}

const PARTNERS: Partner[] = [
  {
    eyebrow: 'PROFESSIONAL',
    title: '士業パートナー',
    lead: '税理士・司法書士・弁護士・行政書士の方へ。相続相談の延長で、不動産の売却もクライアントにご案内できます。',
    benefits: [
      '成約時に、仲介手数料の15%を紹介料として受け取れます',
      '紹介リンクでも代理登録でも、どちらからでも紹介できます',
      '案件の進捗やステータスは、ダッシュボードでいつでも確認できます',
    ],
    mark: 'professional',
  },
  {
    eyebrow: 'BROKER',
    title: '提携宅建業者',
    lead: '宅建業の免許をお持ちの業者さまへ。重説から決済まで、仲介実務だけに集中できます。集客はOuverが担います。',
    benefits: [
      '仲介手数料の50%以上を受け取れます（実績に応じて最大60%まで）',
      '集客・マッチング・書類の管理は、Ouverがまとめて担います',
      '案件は運営から割り当てるので、営業の手間がほとんどかかりません',
    ],
    mark: 'broker',
  },
  {
    eyebrow: 'NETWORK',
    title: 'NWパートナー',
    lead: '士業の全国ネットワーク・協会の方へ。所属する士業の方々に、Ouverへの紹介窓口を一括でご提供できます。',
    benefits: [
      'NW経由の成約で、紹介料3%を受け取れます',
      '会員向けの特典・付帯サービスとして展開することもできます',
      'NW専用ダッシュボードで、所属する士業の活動状況をまとめて確認できます',
    ],
    mark: 'network',
  },
]

type Share = {
  role: string
  percent: number
  note: string
  accent: 'bark' | 'sage' | 'sage-light' | 'sage-xlight'
}

const SHARES: Share[] = [
  { role: '提携宅建業者', percent: 50, note: '重説・契約・決済の実務を担当', accent: 'bark' },
  { role: 'Ouver', percent: 32, note: 'プラットフォーム運営・マッチング', accent: 'sage' },
  { role: '士業パートナー', percent: 15, note: '紹介・初期相談・書類支援', accent: 'sage-light' },
  { role: 'NWパートナー', percent: 3, note: 'NW経由の案件のみ', accent: 'sage-xlight' },
]

const FLOW = [
  { step: '01', title: 'お問い合わせ', body: 'フォームかメールでお気軽にご連絡ください。' },
  { step: '02', title: 'オンライン説明', body: 'サービスの概要と、提携条件をご案内します。' },
  { step: '03', title: '契約締結', body: 'パートナーシップ契約を締結します。' },
  { step: '04', title: '運用開始', body: 'アカウントを発行したら、その日から紹介・案件対応を始められます。' },
]

const PartnerMark = ({ type }: { type: Partner['mark'] }) => {
  if (type === 'professional') {
    return (
      <svg
        viewBox="0 0 120 120"
        aria-hidden
        className="w-20 h-20 text-sage-deep/70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="30" y="16" width="60" height="88" rx="2" />
        <line x1="40" y1="36" x2="80" y2="36" />
        <line x1="40" y1="48" x2="76" y2="48" />
        <line x1="40" y1="60" x2="72" y2="60" />
        <circle cx="72" cy="84" r="10" />
        <line x1="67" y1="84" x2="77" y2="84" />
      </svg>
    )
  }
  if (type === 'broker') {
    return (
      <svg
        viewBox="0 0 120 120"
        aria-hidden
        className="w-20 h-20 text-sage-deep/70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M30 102 V46 L60 20 L90 46 V102" />
        <line x1="24" y1="102" x2="96" y2="102" />
        <rect x="48" y="70" width="24" height="32" />
        <line x1="60" y1="80" x2="60" y2="90" />
        <rect x="44" y="52" width="10" height="10" />
        <rect x="66" y="52" width="10" height="10" />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden
      className="w-20 h-20 text-sage-deep/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="60" y1="30" x2="30" y2="70" />
      <line x1="60" y1="30" x2="90" y2="70" />
      <line x1="30" y1="70" x2="60" y2="95" />
      <line x1="90" y1="70" x2="60" y2="95" />
      <line x1="36" y1="70" x2="84" y2="70" strokeDasharray="2 4" />
      <circle cx="60" cy="30" r="5" fill="currentColor" />
      <circle cx="30" cy="70" r="5" fill="currentColor" />
      <circle cx="90" cy="70" r="5" fill="currentColor" />
      <circle cx="60" cy="95" r="5" fill="currentColor" />
    </svg>
  )
}

const accentBg = (a: Share['accent']) => {
  if (a === 'bark') return 'bg-bark'
  if (a === 'sage') return 'bg-sage-deep'
  if (a === 'sage-light') return 'bg-sage'
  return 'bg-sage-xlight border border-sage-deep/20'
}

const accentText = (a: Share['accent']) => {
  if (a === 'sage-xlight') return 'text-bark'
  return 'text-warm'
}

export default function PartnersPage() {
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
                FOR PARTNERS
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                相続不動産の売却を、
                <br />
                一緒に支えるパートナーへ。
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[560px] font-medium">
                税理士・司法書士・宅建業者・全国ネットワークと組んで、相続不動産の売却をまとめてサポートしています。
                紹介料と案件配分のしくみも、すべてこのページで公開しています。
              </p>
            </div>
            <div className="relative aspect-[4/5] md:aspect-[4/5] rounded-[18px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80&auto=format"
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
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
                OUVER PARTNERS
              </span>
            </div>
          </div>
        </section>

        {/* STATEMENT STRIP */}
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
          <div className="relative max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-14 items-center">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage mb-5">
                PHILOSOPHY
              </div>
              <p className="text-[clamp(22px,2.6vw,32px)] font-bold tracking-[-0.02em] leading-[1.6] text-warm">
                一社ではなく、専門家のチームで。
                <br />
                <span className="text-warm-2/80">
                  相続には、税務・登記・売却、それぞれの専門家の力が必要です。
                </span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {[
                { n: '3', unit: '種', label: 'パートナー' },
                { n: '4', unit: '者', label: '配分の透明性' },
                { n: '0', unit: '円', label: '提携の初期費用' },
              ].map((s) => (
                <div key={s.label} className="border-l border-warm-2/20 pl-4 md:pl-5">
                  <div className="price text-[44px] md:text-[56px] font-bold text-warm leading-none">
                    {s.n}
                    <span className="text-[16px] font-medium text-warm-2/80 ml-1">{s.unit}</span>
                  </div>
                  <div className="text-[12px] text-warm-2/70 mt-2 tracking-[0.08em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNER TYPES */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                PARTNER TYPES
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25]">
                3つのパートナー
              </h2>
            </div>
            <div className="space-y-5">
              {PARTNERS.map((p) => (
                <article
                  key={p.title}
                  className="surface-card rounded-[14px] p-7 md:p-10 grid md:grid-cols-[240px_1fr] gap-6 md:gap-12"
                >
                  <div className="flex md:flex-col items-start gap-5">
                    <div className="shrink-0 w-20 h-20 rounded-[12px] bg-sage-xlight flex items-center justify-center">
                      <PartnerMark type={p.mark} />
                    </div>
                    <div>
                      <div className="text-[11px] tracking-[0.32em] font-semibold text-sage-deep mb-2">
                        {p.eyebrow}
                      </div>
                      <h3 className="text-[22px] md:text-[26px] font-bold text-bark tracking-[-0.02em] leading-[1.3]">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                  <div>
                    <p className="text-[15px] text-bark-2 leading-[1.95] mb-6">{p.lead}</p>
                    <ul className="space-y-3">
                      {p.benefits.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 text-[14px] text-bark-2 leading-[1.75]"
                        >
                          <span
                            aria-hidden
                            className="mt-[10px] block w-3 h-px bg-sage-deep/60 shrink-0"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* REWARD SHARE */}
        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-12">
              <div className="max-w-[640px]">
                <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                  REWARD SHARE
                </div>
                <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                  仲介手数料の配分
                </h2>
                <p className="text-[15px] text-bark-2 leading-[1.9]">
                  成約したとき、仲介手数料は4者で分けます。売主・買い手への追加費用はありません。
                </p>
              </div>
              <p className="text-[12px] text-bark-4 leading-[1.8] max-w-[280px]">
                ※ NW経由の場合の例です。直接紹介（NWなし）では、Ouverの割合が35%になります。
              </p>
            </div>

            {/* 配分バー */}
            <div className="surface-card rounded-[14px] p-6 md:p-8 mb-6">
              <div className="flex h-14 rounded-[8px] overflow-hidden">
                {SHARES.map((s) => (
                  <div
                    key={s.role}
                    className={`flex items-center justify-center ${accentBg(s.accent)} ${accentText(s.accent)}`}
                    style={{ width: `${s.percent}%` }}
                  >
                    <span className="price text-[15px] font-bold">{s.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 配分表 */}
            <div className="grid md:grid-cols-4 gap-4">
              {SHARES.map((s) => (
                <div key={s.role} className="surface-card rounded-[14px] p-6">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="price text-[40px] font-bold text-bark leading-none">
                      {s.percent}
                    </span>
                    <span className="text-[14px] text-bark-3 font-medium">%</span>
                  </div>
                  <div className="text-[15px] font-bold text-bark mb-2">{s.role}</div>
                  <div className="text-[12px] text-bark-3 leading-[1.7]">{s.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FLOW */}
        <section className="relative border-t border-black/5 overflow-hidden">
          <svg
            aria-hidden
            className="absolute -right-10 top-8 w-[420px] h-[420px] text-sage-deep/10 pointer-events-none"
            viewBox="0 0 400 400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <line x1="0" y1="40" x2="400" y2="0" />
            <line x1="0" y1="100" x2="400" y2="60" />
            <line x1="0" y1="160" x2="400" y2="120" />
            <line x1="0" y1="220" x2="400" y2="180" />
            <line x1="0" y1="280" x2="400" y2="240" />
            <line x1="0" y1="340" x2="400" y2="300" />
          </svg>
          <div className="relative max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                FLOW
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25]">
                提携までの流れ
              </h2>
            </div>
            <ol className="grid gap-6 md:gap-10 md:grid-cols-4">
              {FLOW.map((f, i) => (
                <li key={f.step} className="relative">
                  <div className="text-[12px] tracking-[0.24em] font-bold text-sage-deep mb-4">
                    {f.step}
                  </div>
                  <div className="border-t border-bark/15 pt-5">
                    <p className="text-[17px] font-bold text-bark mb-2 tracking-[-0.01em]">
                      {f.title}
                    </p>
                    <p className="text-[14px] text-bark-3 leading-[1.85]">{f.body}</p>
                  </div>
                  {i < FLOW.length - 1 && (
                    <span
                      aria-hidden
                      className="hidden md:block absolute top-[40px] -right-5 w-4 h-px bg-bark/15"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
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
          <div className="relative z-[1] max-w-[1260px] mx-auto px-5 md:px-9 py-16 md:py-20 flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage mb-4">
                GET IN TOUCH
              </div>
              <h2 className="text-warm font-bold text-[clamp(22px,2.8vw,32px)] tracking-[-0.025em] leading-[1.3]">
                提携に関心をお持ちですか？
              </h2>
              <p className="text-warm-2/80 text-[14px] mt-3 max-w-[520px] leading-[1.85]">
                個別のご説明や条件のご相談は、お問い合わせフォームからお気軽にどうぞ。
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-bark rounded-full text-[14px] font-bold whitespace-nowrap transition-[transform,opacity] hover:-translate-y-px hover:opacity-95"
            >
              問い合わせる
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
