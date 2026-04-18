import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'アクセシビリティ方針｜Ouver',
  description:
    'Ouverのアクセシビリティ方針。年齢や障がいの有無、ご利用環境にかかわらず、多くの方にお使いいただけるサービスを目指しています。',
}

type Section = {
  no: string
  title: string
  body: React.ReactNode
}

const SECTIONS: Section[] = [
  {
    no: '01',
    title: '基本方針',
    body: (
      <p>
        株式会社Ouverが運営する「Ouver」では、年齢・障がいの有無・ご利用環境にかかわらず、多くの方にお使いいただけるサービスを目指しています。そのために、アクセシビリティの向上に継続して取り組んでいます。
      </p>
    ),
  },
  {
    no: '02',
    title: '対応している基準',
    body: (
      <p>
        「Web Content Accessibility Guidelines（WCAG）2.1」のレベルAA適合を目標にしています。すべての基準を一度に満たすことは難しく、段階的に改善を重ねています。
      </p>
    ),
  },
  {
    no: '03',
    title: '具体的な取り組み',
    body: (
      <ul>
        <li>画像や図に代替テキストを添え、スクリーンリーダーでも伝わるようにしています</li>
        <li>十分な色のコントラストを確保し、色覚の多様性に配慮しています</li>
        <li>マウスを使わず、キーボードだけでも操作できるようにしています</li>
        <li>フォームのラベルや、エラーメッセージをわかりやすく表示しています</li>
        <li>さまざまな画面サイズに対応するよう、レスポンシブで設計しています</li>
        <li>見出しの階層を整理し、ページの構造が伝わるようにしています</li>
        <li>リンクのテキストから、遷移先の内容がわかるようにしています</li>
      </ul>
    ),
  },
  {
    no: '04',
    title: '改善中の領域',
    body: (
      <>
        <p>
          一部のページや機能には、基準を完全には満たしていない箇所がある可能性があります。特に、次の領域について改善を進めています。
        </p>
        <ul>
          <li>複雑な表組みの、スクリーンリーダーでの読み上げ</li>
          <li>動的に更新されるコンテンツのライブリージョン対応</li>
          <li>PDFドキュメントのアクセシビリティ</li>
        </ul>
      </>
    ),
  },
  {
    no: '05',
    title: '継続的な改善のために',
    body: (
      <ul>
        <li>開発チームで、アクセシビリティの指針を共有しています</li>
        <li>定期的にアクセシビリティ監査を実施しています</li>
        <li>ご利用者さまからのお声をもとに、改善しています</li>
        <li>新機能のリリース前に、アクセシビリティのチェックを行っています</li>
      </ul>
    ),
  },
]

export default function AccessibilityPage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />
      <main>
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                LEGAL — ACCESSIBILITY
              </div>
              <h1 className="font-bold text-[clamp(34px,4.8vw,54px)] leading-[1.18] tracking-[-0.03em] text-bark mb-5 [word-break:keep-all]">
                アクセシビリティ方針
              </h1>
              <p className="price text-[12px] text-bark-4 tracking-[0.08em]">
                最終更新日｜2026-04-01
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[820px]">
              <ul className="space-y-5">
                {SECTIONS.map((s) => (
                  <li
                    key={s.no}
                    className="surface-card rounded-[14px] p-7 md:p-10 grid md:grid-cols-[96px_1fr] gap-5 md:gap-10"
                  >
                    <span className="price text-[28px] md:text-[32px] font-bold text-sage-deep tracking-[-0.02em] leading-none">
                      {s.no}
                    </span>
                    <div>
                      <h2 className="text-[18px] md:text-[20px] font-bold text-bark tracking-[-0.015em] mb-4">
                        {s.title}
                      </h2>
                      <div className="text-[14px] text-bark-2 leading-[1.95] space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mt-2">
                        {s.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-12 md:py-16">
            <div className="max-w-[820px] surface-card rounded-[14px] p-8 md:p-10">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-3">
                FEEDBACK
              </div>
              <h2 className="text-[20px] font-bold text-bark tracking-[-0.015em] mb-3">
                ご意見・ご要望をお寄せください
              </h2>
              <p className="text-[13px] text-bark-2 leading-[1.9] mb-4">
                お気づきの点がございましたら、下記までお気軽にご連絡ください。サービスの改善に役立てさせていただきます。
              </p>
              <dl className="grid grid-cols-[96px_1fr] gap-3 text-[13px] md:text-[14px]">
                <dt className="text-bark-4 text-[11px] tracking-[0.18em] font-semibold pt-1">
                  担当
                </dt>
                <dd className="text-bark font-medium">株式会社Ouver アクセシビリティ担当</dd>
                <dt className="text-bark-4 text-[11px] tracking-[0.18em] font-semibold pt-1">
                  メール
                </dt>
                <dd className="text-bark font-bold">accessibility@ouver.jp</dd>
              </dl>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
