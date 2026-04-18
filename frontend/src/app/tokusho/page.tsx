import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記｜Ouver',
  description:
    '株式会社Ouverが運営する相続不動産マッチング「Ouver」の、特定商取引法にもとづく表記です。販売業者・所在地・料金・お支払い方法などをご案内します。',
}

const COMPANY_ROWS: [string, React.ReactNode][] = [
  ['販売業者', '株式会社Ouver'],
  ['代表者', '代表取締役　〇〇　〇〇'],
  ['所在地', '東京都〇〇区〇〇　〇丁目〇番〇号'],
  ['電話番号', '050-XXXX-XXXX（平日10:00〜18:00）'],
  ['メールアドレス', 'info@ouver.jp'],
  ['URL', 'https://ouver.jp'],
]

type Section = {
  no: string
  title: string
  body: React.ReactNode
}

const SECTIONS: Section[] = [
  {
    no: '01',
    title: 'サービスの内容',
    body: (
      <p>
        相続不動産に特化した、入札型のマッチングプラットフォームです。売主さま（相続人の方）が物件を掲載し、入札を通じて買い手の方とつながっていただけます。
      </p>
    ),
  },
  {
    no: '02',
    title: 'ご利用料金',
    body: (
      <>
        <p>物件の掲載と入札は、無料でご利用いただけます。成約時に、次の手数料が発生します。</p>
        <ul>
          <li>
            仲介手数料：宅地建物取引業法にもとづく上限額（売買価格×3% ＋ 6万円＋税、400万円以下は別途定め）
          </li>
          <li>士業紹介料：仲介手数料の15%（士業パートナー経由の場合）</li>
        </ul>
        <p>
          その他の料金はかかりません。詳しくは
          <Link href="/pricing" className="text-sage-deep underline underline-offset-[3px] decoration-sage-deep/40 mx-0.5">
            料金のご案内
          </Link>
          をご覧ください。
        </p>
      </>
    ),
  },
  {
    no: '03',
    title: 'お支払い方法',
    body: (
      <p>
        仲介手数料は、成約時に提携宅建業者を通じてお支払いいただきます。お支払いは銀行振込です。
      </p>
    ),
  },
  {
    no: '04',
    title: 'サービスのご提供時期',
    body: (
      <p>
        ご登録完了後、すぐにサービスをご利用いただけます。掲載していただいた物件は、内容の確認が完了したのちに公開されます。
      </p>
    ),
  },
  {
    no: '05',
    title: 'キャンセルについて',
    body: (
      <>
        <p>
          入札期間中は、入札の取り下げをお受けいたします。売主さまが入札者をお選びになったあとの取り下げについては、提携宅建業者との契約条件にしたがいます。
        </p>
        <p>
          アカウントの退会は、いつでもお手続きいただけます。退会後30日間はデータを保持し、期間内であれば復元いただけます。
        </p>
      </>
    ),
  },
  {
    no: '06',
    title: '推奨環境',
    body: (
      <>
        <p>以下のブラウザ（最新版）を推奨しています。スマートフォンでもご利用いただけます。</p>
        <ul>
          <li>Google Chrome</li>
          <li>Safari</li>
          <li>Microsoft Edge</li>
          <li>Firefox</li>
        </ul>
      </>
    ),
  },
]

export default function TokushoPage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />
      <main>
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                LEGAL — COMMERCIAL
              </div>
              <h1 className="font-bold text-[clamp(32px,4.4vw,48px)] leading-[1.22] tracking-[-0.025em] text-bark mb-5 [word-break:keep-all]">
                特定商取引法に
                <br />
                もとづく表記
              </h1>
              <p className="price text-[12px] text-bark-4 tracking-[0.08em]">
                最終更新日｜2026-04-01
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[820px] surface-card rounded-[14px] p-8 md:p-10">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-5">
                COMPANY
              </div>
              <dl className="divide-y divide-black/8">
                {COMPANY_ROWS.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[110px_1fr] md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-4"
                  >
                    <dt className="text-[11px] tracking-[0.18em] font-semibold text-bark-4 uppercase pt-0.5">
                      {label}
                    </dt>
                    <dd className="text-[14px] text-bark font-medium leading-[1.7]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[820px]">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                SERVICE DETAILS
              </div>
              <h2 className="text-[clamp(24px,2.8vw,32px)] font-bold text-bark tracking-[-0.02em] leading-[1.3] mb-8">
                サービスの詳細
              </h2>
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
                      <h3 className="text-[18px] md:text-[20px] font-bold text-bark tracking-[-0.015em] mb-4">
                        {s.title}
                      </h3>
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
                CONTACT
              </div>
              <h2 className="text-[20px] font-bold text-bark tracking-[-0.015em] mb-3">
                お問い合わせ先
              </h2>
              <dl className="grid grid-cols-[96px_1fr] gap-3 text-[13px] md:text-[14px]">
                <dt className="text-bark-4 text-[11px] tracking-[0.18em] font-semibold pt-1">
                  担当
                </dt>
                <dd className="text-bark font-medium">株式会社Ouver カスタマーサポート</dd>
                <dt className="text-bark-4 text-[11px] tracking-[0.18em] font-semibold pt-1">
                  メール
                </dt>
                <dd className="text-bark font-bold">support@ouver.jp</dd>
                <dt className="text-bark-4 text-[11px] tracking-[0.18em] font-semibold pt-1">
                  電話
                </dt>
                <dd className="text-bark font-medium">050-XXXX-XXXX（平日10:00〜18:00）</dd>
              </dl>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
