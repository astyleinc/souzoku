import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '利用規約｜Ouver',
  description:
    '株式会社Ouverが運営する相続不動産マッチング「Ouver」の利用規約。ご登録いただくみなさまとの取り決めをまとめています。',
}

type Article = {
  no: string
  title: string
  body: React.ReactNode
}

const ARTICLES: Article[] = [
  {
    no: '01',
    title: '規約の適用について',
    body: (
      <p>
        本規約は、株式会社Ouver（以下「当社」）が提供する相続不動産マッチングサービス「Ouver」（以下「本サービス」）のご利用に関する取り決めです。ご登録いただくみなさまには、本規約にそってご利用いただきます。
      </p>
    ),
  },
  {
    no: '02',
    title: 'ご登録について',
    body: (
      <>
        <p>
          ご登録を希望される方が本規約にご同意のうえお申し込みをされ、当社がこれを承認した時点で、ご登録が完了します。次の場合には、ご登録をお断りすることがあります。
        </p>
        <ul>
          <li>お申し込みの内容に事実と異なる記載がある場合</li>
          <li>過去に本規約に違反された方である場合</li>
          <li>その他、ご登録が適切でないと当社が判断した場合</li>
        </ul>
      </>
    ),
  },
  {
    no: '03',
    title: 'アカウントの管理',
    body: (
      <p>
        ログイン用のメールアドレスとパスワードは、ご利用者さまご自身で管理してください。第三者による使用や、管理が十分でないことに起因する損害について、当社は責任を負いかねます。
      </p>
    ),
  },
  {
    no: '04',
    title: '禁止事項',
    body: (
      <>
        <p>本サービスのご利用にあたり、次の行為はお控えください。</p>
        <ul>
          <li>法令や公序良俗に反する行為</li>
          <li>犯罪につながる行為</li>
          <li>当社、他のご利用者、第三者の権利や利益を損なう行為</li>
          <li>本サービスの運営を妨げるおそれのある行為</li>
          <li>不正アクセス、またはそれを試みる行為</li>
          <li>他のご利用者の個人情報を収集・蓄積する行為</li>
          <li>本来の目的と異なる用途での利用</li>
          <li>その他、当社が不適切と判断する行為</li>
        </ul>
      </>
    ),
  },
  {
    no: '05',
    title: 'サービスの停止について',
    body: (
      <p>
        サーバーの保守や不可抗力などの事由により、事前のお知らせなく本サービスの全部または一部を停止・中断することがあります。停止・中断によって発生した不利益について、当社は責任を負いかねます。
      </p>
    ),
  },
  {
    no: '06',
    title: '免責について',
    body: (
      <p>
        本サービスに、事実上または法律上の瑕疵がないことを明示・黙示に保証するものではありません。本サービスに起因して生じた損害について、当社は責任を負いかねます。ただし、お客さまとの契約が消費者契約法上の消費者契約に該当する場合、この免責規定は適用されません。
      </p>
    ),
  },
  {
    no: '07',
    title: '準拠法と管轄',
    body: (
      <p>
        本規約は日本法を準拠法として解釈します。本サービスに関する紛争が生じた場合は、東京地方裁判所を専属的合意管轄裁判所といたします。
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />
      <main>
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                LEGAL — TERMS
              </div>
              <h1 className="font-bold text-[clamp(34px,4.8vw,54px)] leading-[1.18] tracking-[-0.03em] text-bark mb-5 [word-break:keep-all]">
                利用規約
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
                {ARTICLES.map((a) => (
                  <li
                    key={a.no}
                    className="surface-card rounded-[14px] p-7 md:p-10 grid md:grid-cols-[96px_1fr] gap-5 md:gap-10"
                  >
                    <span className="price text-[28px] md:text-[32px] font-bold text-sage-deep tracking-[-0.02em] leading-none">
                      {a.no}
                    </span>
                    <div>
                      <h2 className="text-[18px] md:text-[20px] font-bold text-bark tracking-[-0.015em] mb-4">
                        第{Number(a.no)}条　{a.title}
                      </h2>
                      <div className="text-[14px] text-bark-2 leading-[1.95] space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mt-2">
                        {a.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
