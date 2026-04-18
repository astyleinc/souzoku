import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'ご利用者の声｜Ouver',
  description:
    '相続した不動産をOuverで売却された方、士業パートナーの方の声をご紹介します。入札方式でどのように成約したか、実際の事例をご覧ください。',
}

type Story = {
  quote: string
  name: string
  property: string
  result: string
  tag: string
}

const STORIES: Story[] = [
  {
    quote:
      '相続した実家をどうするか、ずっと悩んでいました。入札を受けてみたら、想定よりも高い金額で売却できました。士業の先生にも相談できて、心強かったです。',
    name: 'A.S.さん（50代）',
    property: '一戸建て／東京都練馬区',
    result: '査定額よりおよそ15%高い価格で成約',
    tag: '入札開始から2週間',
  },
  {
    quote:
      '遠方の土地を相続したので、管理に困っていました。Ouverに載せたところ、複数の不動産会社から入札が入って、すんなり売却できました。',
    name: 'K.T.さん（40代）',
    property: '土地／神奈川県横浜市',
    result: '3社から入札。条件の良かった1社と成約',
    tag: '複数社からの入札',
  },
  {
    quote:
      '相続人が複数いて、なかなか意見がまとまりませんでした。入札の結果という数字があったおかげで、スムーズに合意できました。',
    name: 'M.H.さん（60代）',
    property: 'マンション／東京都世田谷区',
    result: '5社から入札。相続人間の合意形成にも',
    tag: '相続人間の合意形成',
  },
]

type ProVoice = {
  quote: string
  name: string
  role: string
}

const PRO_VOICES: ProVoice[] = [
  {
    quote:
      '相続のご相談を受けたとき、不動産の売却先までご案内できるのは、本当にありがたいです。クライアントへのサービスにも、厚みが出てきました。',
    name: 'Y.M.先生',
    role: '税理士',
  },
  {
    quote:
      '紹介リンクをお渡しするだけで、あとはOuverにお任せできます。手間なく紹介料もいただけるので、積極的にお声かけしています。',
    name: 'S.K.先生',
    role: '司法書士',
  },
]

const STATS = [
  { value: '150', unit: '件以上', label: '成約件数' },
  { value: '3.2', unit: '週間', label: '平均成約期間' },
  { value: '94', unit: '%', label: 'ご満足度' },
] as const

export default function StoriesPage() {
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
                STORIES
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                Ouverを選んだ方の、
                <br />
                それぞれの物語。
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[560px] font-medium">
                相続した不動産をOuverで売却された方と、ご一緒した士業パートナーの方の声をご紹介します。
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
              <span className="absolute left-6 bottom-8 text-warm text-[10px] tracking-[0.3em] font-semibold">
                VOICES OF OUVER
              </span>
            </div>
          </div>
        </section>

        {/* STATEMENT + STATS */}
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
                BY THE NUMBERS
              </div>
              <p className="text-[clamp(22px,2.6vw,32px)] font-bold tracking-[-0.02em] leading-[1.6] text-warm">
                数字のうしろには、
                <br />
                <span className="text-warm-2/80">
                  ひとりひとりの相続と、その後のくらしがあります。
                </span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="border-l border-warm-2/20 pl-4 md:pl-5">
                  <div className="price text-[40px] md:text-[52px] font-bold text-warm leading-none">
                    {s.value}
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

        {/* SELLER STORIES */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-14">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                FROM SELLERS
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25]">
                売主さまの声
              </h2>
            </div>

            <ul className="space-y-5">
              {STORIES.map((s, i) => (
                <li
                  key={s.name}
                  className="surface-card rounded-[14px] p-7 md:p-10 grid md:grid-cols-[140px_1fr] gap-6 md:gap-12"
                >
                  <div>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="price text-[13px] tracking-[0.28em] font-bold text-bark-4">
                        CASE
                      </span>
                      <span className="price text-[40px] font-bold text-sage-deep leading-none tracking-[-0.03em]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="text-[11px] tracking-[0.14em] font-semibold text-sage-deep uppercase">
                      {s.tag}
                    </div>
                  </div>
                  <div>
                    <span
                      aria-hidden
                      className="block text-[32px] text-sage-deep/40 leading-none mb-3 font-serif"
                    >
                      &ldquo;
                    </span>
                    <p className="text-[16px] md:text-[17px] text-bark-2 leading-[2.05] mb-6">
                      {s.quote}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 pt-4 border-t border-black/8">
                      <span className="text-[15px] font-bold text-bark">{s.name}</span>
                      <span className="text-[12px] text-bark-3">{s.property}</span>
                      <span className="ml-auto text-[12px] text-sage-deep font-semibold">
                        {s.result}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PRO VOICES */}
        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-14">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                FROM PROFESSIONALS
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25]">
                士業パートナーの声
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {PRO_VOICES.map((v) => (
                <blockquote
                  key={v.name}
                  className="surface-card rounded-[14px] p-8 md:p-10"
                >
                  <span
                    aria-hidden
                    className="block text-[32px] text-sage-deep/40 leading-none mb-3 font-serif"
                  >
                    &ldquo;
                  </span>
                  <p className="text-[15px] text-bark-2 leading-[2] mb-6">{v.quote}</p>
                  <footer className="flex items-baseline gap-3 pt-4 border-t border-black/8">
                    <span className="text-[11px] tracking-[0.22em] font-semibold text-sage-deep">
                      {v.role}
                    </span>
                    <span className="text-[14px] font-bold text-bark">{v.name}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-10">
            <p className="text-[12px] text-bark-4 leading-[1.85] max-w-[720px]">
              ※
              掲載している声は、サービス開始前のイメージです。実際にご利用いただいた方の声は、サービス開始後にご本人の同意を得たうえで順次ご紹介します。
            </p>
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
                YOUR STORY
              </div>
              <h2 className="text-warm font-bold text-[clamp(22px,2.8vw,32px)] tracking-[-0.025em] leading-[1.3]">
                次のお話は、あなたの番です
              </h2>
              <p className="text-warm-2/80 text-[14px] mt-3 max-w-[520px] leading-[1.85]">
                登録も掲載も入札も無料です。迷っているときも、まずはお気軽にお問い合わせください。
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
