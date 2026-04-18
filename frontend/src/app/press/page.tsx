import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'プレス・メディア掲載｜Ouver',
  description:
    '株式会社Ouverのプレスリリース、メディア掲載情報、取材・広報のお問い合わせ先をまとめています。',
}

type Release = {
  date: string
  title: string
}

type Article = {
  date: string
  source: string
  title: string
  href?: string
}

const RELEASES: Release[] = [
  {
    date: '2026-04-15',
    title: '株式会社Ouver、相続不動産マッチングサービス「Ouver」を正式リリース',
  },
  {
    date: '2026-03-01',
    title: '株式会社Ouver、士業ネットワーク5団体との提携を開始',
  },
  {
    date: '2026-01-15',
    title: '株式会社Ouver、シードラウンドの資金調達を完了',
  },
]

const ARTICLES: Article[] = [
  {
    date: '2026-04-16',
    source: '不動産業界新聞',
    title: '相続不動産の入札型プラットフォーム「Ouver」がサービス開始',
  },
  {
    date: '2026-04-15',
    source: 'TechCrunch Japan',
    title: '相続×テック、士業ネットワークを活用した不動産マッチングの新しい形',
  },
]

export default function PressPage() {
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
                PRESS &amp; MEDIA
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                プレス・
                <br />
                メディア掲載情報
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[620px] font-medium">
                株式会社Ouverからのプレスリリースと、メディア掲載の実績をご紹介します。
                取材のご依頼や資料請求は、ページ下のお問い合わせ先までどうぞ。
              </p>
            </div>
          </div>
        </section>

        {/* PRESS KIT */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-12 md:py-16">
            <div className="surface-card rounded-[14px] p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-3">
                  PRESS KIT
                </div>
                <h2 className="text-[22px] md:text-[24px] font-bold text-bark tracking-[-0.015em] mb-3 leading-[1.4]">
                  プレスキット
                </h2>
                <p className="text-[14px] text-bark-2 leading-[1.9] max-w-[560px]">
                  ロゴデータ・サービス概要・代表者プロフィールなどをまとめたプレスキットをご用意しています。
                </p>
              </div>
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bark-4/10 text-bark-3 text-[13px] font-semibold whitespace-nowrap cursor-not-allowed">
                ただいま準備中
              </span>
            </div>
          </div>
        </section>

        {/* RELEASES */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[280px_1fr] gap-10 md:gap-20">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                RELEASES
              </div>
              <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold text-bark tracking-[-0.02em] leading-[1.3]">
                プレスリリース
              </h2>
            </div>
            <ul className="divide-y divide-black/8 border-y border-black/8">
              {RELEASES.map((r) => (
                <li key={r.date} className="py-5 md:py-6 grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr] gap-4 md:gap-8">
                  <time className="price text-[13px] text-bark-4 font-semibold pt-0.5">
                    {r.date}
                  </time>
                  <p className="text-[15px] md:text-[16px] font-bold text-bark leading-[1.7] tracking-[-0.01em]">
                    {r.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* MEDIA */}
        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[280px_1fr] gap-10 md:gap-20">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                MEDIA
              </div>
              <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold text-bark tracking-[-0.02em] leading-[1.3]">
                メディア掲載
              </h2>
            </div>
            <ul className="divide-y divide-black/8 border-y border-black/8">
              {ARTICLES.map((a) => (
                <li key={a.title} className="py-5 md:py-6 grid grid-cols-[110px_1fr] md:grid-cols-[160px_160px_1fr] gap-4 md:gap-8 items-baseline">
                  <time className="price text-[13px] text-bark-4 font-semibold">
                    {a.date}
                  </time>
                  <span className="text-[11px] tracking-[0.2em] font-semibold text-sage-deep uppercase col-span-1 md:col-span-1">
                    {a.source}
                  </span>
                  <p className="text-[15px] md:text-[16px] font-bold text-bark leading-[1.7] tracking-[-0.01em] col-span-2 md:col-span-1">
                    {a.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CONTACT */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="surface-card rounded-[16px] p-10 md:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                  PRESS CONTACT
                </div>
                <h2 className="font-bold text-[clamp(24px,2.8vw,32px)] leading-[1.3] tracking-[-0.02em] text-bark mb-5 [word-break:keep-all]">
                  取材・広報のお問い合わせ
                </h2>
                <p className="text-[14px] text-bark-2 leading-[1.95] mb-6 max-w-[520px]">
                  取材のご依頼、掲載許可、資料のご請求などは、下記の連絡先までお願いいたします。
                </p>
                <dl className="grid grid-cols-[120px_1fr] gap-3 text-[14px]">
                  <dt className="text-bark-4 text-[12px] tracking-[0.18em] font-semibold pt-0.5">
                    担当
                  </dt>
                  <dd className="text-bark font-medium">株式会社Ouver 広報担当</dd>
                  <dt className="text-bark-4 text-[12px] tracking-[0.18em] font-semibold pt-0.5">
                    メール
                  </dt>
                  <dd className="text-bark font-bold">press@ouver.jp</dd>
                </dl>
              </div>
              <Link
                href="mailto:press@ouver.jp"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-bark text-warm rounded-full text-[13px] font-bold whitespace-nowrap transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
              >
                メールを送る
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
