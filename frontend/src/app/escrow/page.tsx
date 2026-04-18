import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '安全な取引のしくみ｜Ouver',
  description:
    '事前審査・入札方式・宅建業者の仲介。この三つを組み合わせて、売主も買い手も安心して進められる取引の場をつくっています。',
}

type FlowStep = {
  step: string
  title: string
  body: string
  mark: 'review' | 'gavel' | 'brief' | 'handshake'
}

const FLOW: FlowStep[] = [
  {
    step: '01',
    title: '物件の登録と審査',
    body: '運営が物件情報と書類を確認します。問題がなければ公開となり、入札の募集がはじまります。',
    mark: 'review',
  },
  {
    step: '02',
    title: '入札と選定',
    body: '複数の買い手から入札が届きます。売主は金額と条件を見比べて、好きな相手を選べます。',
    mark: 'gavel',
  },
  {
    step: '03',
    title: '宅建業者の仲介',
    body: '重要事項説明から契約までは、提携の宅建業者が担当します。免許を持つ専門家があいだに入ります。',
    mark: 'brief',
  },
  {
    step: '04',
    title: '決済と引き渡し',
    body: '提携業者の立ち会いのもと、決済と物件のお引き渡しを行います。売主と買い手が直接お金をやり取りすることはありません。',
    mark: 'handshake',
  },
]

type SafetyGroup = {
  eyebrow: string
  role: string
  items: string[]
}

const SAFETY: SafetyGroup[] = [
  {
    eyebrow: 'FOR SELLER',
    role: '売主の方へ',
    items: [
      '入札方式なので、価格が適正かどうかを市場で確かめられます',
      '候補を並べて、金額だけでなく条件まで含めて選べます',
      '相続のお手続きは、士業パートナーがそばで支えます',
    ],
  },
  {
    eyebrow: 'FOR BUYER',
    role: '買い手の方へ',
    items: [
      '物件の情報は、運営が事前にすべて確認しています',
      '重要事項説明は、免許を持つ宅建業者が行います',
      'ご自身の入札金額は、ほかの入札者には見えません',
    ],
  },
  {
    eyebrow: 'FOR PROFESSIONAL',
    role: '士業の方へ',
    items: [
      'クライアントの取引状況は、ダッシュボードでご確認いただけます',
      '売買の実務は、提携業者がそのまま引き継ぎます',
      '成約したときは、仲介手数料の15%を紹介料としてお支払いします',
    ],
  },
]

const PILLARS = [
  {
    step: '01',
    title: '運営による事前審査',
    body: '物件情報と本人確認書類を、公開する前にすべて確認します。形式の不備だけでなく、相続関係の書類まで目を通します。',
  },
  {
    step: '02',
    title: '宅建業者による実務',
    body: '契約や決済の実務は、提携の宅建業者が担当します。Ouverだけでは行いません。だれが何に責任を持つかを、はっきり分けています。',
  },
  {
    step: '03',
    title: 'ひらけた入札方式',
    body: '業者の査定だけで価格を決めません。入札で市場に問うので、売主も買い手も納得して進められます。',
  },
]

const FAQS = [
  {
    q: '取引相手の身元は確認されていますか？',
    a: 'はい。物件を掲載するときに、売主の本人確認を行っています。買い手も、入札するときにアカウント認証をお願いしています。',
  },
  {
    q: 'トラブルが起きたときはどうなりますか？',
    a: '提携の宅建業者があいだに入り、解決までサポートします。運営のサポートチームにも、いつでも直接ご連絡いただけます。',
  },
  {
    q: '入金の安全性はどう守られていますか？',
    a: '決済は、提携宅建業者の立ち会いのもとで行います。売主と買い手のあいだで、直接お金のやり取りをすることはありません。',
  },
  {
    q: '提携の宅建業者はどう選ばれていますか？',
    a: '宅地建物取引業の免許を持ち、相続不動産の取り扱いに実績のある業者だけと提携しています。案件ごとに運営が割り当てます。',
  },
]

const FlowMark = ({ type }: { type: FlowStep['mark'] }) => {
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
  if (type === 'review') {
    return (
      <svg {...common}>
        <rect x="10" y="8" width="28" height="32" rx="2" />
        <path d="M16 18 H32" />
        <path d="M16 24 H28" />
        <path d="M16 30 L20 34 L28 26" />
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
  if (type === 'brief') {
    return (
      <svg {...common}>
        <rect x="10" y="14" width="28" height="24" rx="2" />
        <path d="M18 14 V10 A2 2 0 0 1 20 8 H28 A2 2 0 0 1 30 10 V14" />
        <path d="M10 24 H38" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M8 22 L14 16 L22 22 L18 28 L10 28 L8 22 Z" />
      <path d="M40 22 L34 16 L26 22 L30 28 L38 28 L40 22 Z" />
      <path d="M18 28 L22 32 H26 L30 28" />
    </svg>
  )
}

export default function EscrowPage() {
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
                SAFE TRANSACTION
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                安心して進められる、
                <br />
                取引のしくみ。
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[560px] font-medium">
                事前審査、入札方式、宅建業者の仲介。
                この三つを組み合わせて、売主も買い手も安心して進められる場をつくっています。
              </p>
            </div>
            <div className="relative aspect-[4/5] md:aspect-[4/5] rounded-[18px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80&auto=format"
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-[center_50%]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-bark/30 via-transparent to-transparent"
              />
              <span className="absolute left-6 bottom-8 text-warm text-[10px] tracking-[0.3em] font-semibold">
                OUVER SAFETY
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
                PRINCIPLE
              </div>
              <p className="text-[clamp(22px,2.6vw,32px)] font-bold tracking-[-0.02em] leading-[1.6] text-warm">
                運営だけでは、安全にはなれない。
                <br />
                <span className="text-warm-2/80">
                  だからOuverでは、免許を持つ業者と士業の方々と組んで、だれが何に責任を持つかをはっきりさせています。
                </span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {[
                { n: '100', unit: '%', label: '免許保持業者' },
                { n: '4', unit: 'ステップ', label: '取引フロー' },
                { n: '0', unit: '件', label: '個人間送金' },
              ].map((s) => (
                <div key={s.label} className="border-l border-warm-2/20 pl-4 md:pl-5">
                  <div className="price text-[40px] md:text-[52px] font-bold text-warm leading-none">
                    {s.n}
                    <span className="text-[14px] font-medium text-warm-2/80 ml-1">{s.unit}</span>
                  </div>
                  <div className="text-[12px] text-warm-2/70 mt-2 tracking-[0.08em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FLOW */}
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                TRANSACTION FLOW
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                取引の流れ
              </h2>
              <p className="text-[15px] text-bark-2 leading-[1.9]">
                登録から決済まで、どの段階でだれが何を担当するかを、はっきり分けています。
              </p>
            </div>
            <ol className="grid gap-5 md:grid-cols-2">
              {FLOW.map((f) => (
                <li
                  key={f.step}
                  className="surface-card rounded-[14px] p-7 md:p-10 grid grid-cols-[auto_1fr] gap-5 md:gap-8"
                >
                  <div className="flex flex-col items-start gap-5">
                    <span className="price text-[13px] tracking-[0.28em] font-bold text-bark-4">
                      STEP
                    </span>
                    <span className="price text-[56px] font-bold text-sage-deep leading-none tracking-[-0.03em]">
                      {f.step}
                    </span>
                    <div className="w-14 h-14 rounded-[12px] bg-sage-xlight flex items-center justify-center">
                      <FlowMark type={f.mark} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[22px] font-bold text-bark tracking-[-0.015em] mb-3 leading-[1.35]">
                      {f.title}
                    </h3>
                    <p className="text-[14px] text-bark-2 leading-[1.95]">{f.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SAFETY POINTS */}
        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                SAFETY POINTS
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                立場別の安心ポイント
              </h2>
              <p className="text-[15px] text-bark-2 leading-[1.9]">
                売主・買い手・士業の方、それぞれの立場から気になるポイントをまとめました。
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {SAFETY.map((g) => (
                <div key={g.role} className="surface-card rounded-[14px] p-8 md:p-10">
                  <div className="text-[11px] tracking-[0.28em] font-semibold text-sage-deep mb-4">
                    {g.eyebrow}
                  </div>
                  <h3 className="text-[19px] font-bold text-bark tracking-[-0.015em] mb-5 leading-[1.4]">
                    {g.role}
                  </h3>
                  <ul className="space-y-3">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[13px] text-bark-2 leading-[1.8]"
                      >
                        <span
                          aria-hidden
                          className="mt-[9px] block w-3 h-px bg-sage-deep/60 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 PILLARS */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                HOW IT WORKS
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25]">
                安全を支える3つの仕組み
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {PILLARS.map((p) => (
                <article key={p.step} className="surface-card rounded-[14px] p-8 md:p-10">
                  <div className="text-[13px] tracking-[0.24em] font-bold text-sage-deep mb-5">
                    {p.step}
                  </div>
                  <h3 className="text-[20px] font-bold text-bark tracking-[-0.015em] mb-4 leading-[1.4]">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-bark-2 leading-[1.95]">{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-black/5 bg-warm">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[300px_1fr] gap-10 md:gap-16">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                FAQ
              </div>
              <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold text-bark tracking-[-0.025em] leading-[1.3] mb-4">
                安全性に関する
                <br />
                よくある質問
              </h2>
              <p className="text-[14px] text-bark-3 leading-[1.9]">
                ほかの質問は
                <Link
                  href="/faq"
                  className="text-sage-deep underline underline-offset-[4px] decoration-sage-deep/30 ml-1"
                >
                  よくある質問
                </Link>
                でも確認できます。
              </p>
            </div>
            <div className="divide-y divide-black/8 border-y border-black/8">
              {FAQS.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex items-start justify-between gap-4 py-6 cursor-pointer list-none text-[17px] font-bold text-bark leading-[1.55] tracking-[-0.01em]">
                    <span>{f.q}</span>
                    <span
                      aria-hidden
                      className="shrink-0 text-sage-deep text-[20px] mt-0 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-6 text-[14px] text-bark-2 leading-[1.95] max-w-[720px]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
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
                START SAFELY
              </div>
              <h2 className="text-warm font-bold text-[clamp(22px,2.8vw,32px)] tracking-[-0.025em] leading-[1.3]">
                安心して、始めてみてください
              </h2>
              <p className="text-warm-2/80 text-[14px] mt-3 max-w-[520px] leading-[1.85]">
                登録は数分で終わります。気になることがあれば、いつでもお問い合わせください。
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
