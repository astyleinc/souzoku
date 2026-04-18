import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Cookieポリシー｜Ouver',
  description:
    'Ouverで利用しているCookieの種類・目的・保存期間・サードパーティCookie・無効化の方法をご案内します。',
}

type CookieRow = {
  kind: string
  purpose: string
  retention: string
  required: boolean
}

const COOKIE_ROWS: CookieRow[] = [
  {
    kind: '必須Cookie',
    purpose: 'ログイン状態の維持やセキュリティ機能など、サービスの基本動作に欠かせないCookieです。',
    retention: 'セッション〜1年',
    required: true,
  },
  {
    kind: '分析Cookie',
    purpose:
      'サイトの利用状況をまとめて分析し、サービスの改善に役立てるためのCookieです。内容は匿名で取得します。',
    retention: '最大2年',
    required: false,
  },
  {
    kind: '機能Cookie',
    purpose:
      '表示言語や地域などの設定を覚えて、より快適にご利用いただくためのCookieです。',
    retention: '最大1年',
    required: false,
  },
]

type Section = {
  no: string
  title: string
  body: React.ReactNode
}

const SECTIONS: Section[] = [
  {
    no: '01',
    title: 'Cookieとはなにか',
    body: (
      <p>
        Cookieとは、ウェブサイトがブラウザに送る小さなテキストファイルです。次にご訪問いただいたときに、サイトがご利用者さまを識別するために使われます。Ouverでは、サービスのご提供と改善のためにCookieを活用しています。
      </p>
    ),
  },
  {
    no: '02',
    title: 'サードパーティCookieについて',
    body: (
      <>
        <p>次のサードパーティサービスのCookieを利用することがあります。</p>
        <ul>
          <li>Google Analytics（アクセス解析）</li>
          <li>Vercel Analytics（パフォーマンス計測）</li>
        </ul>
        <p>各サービスのCookieの扱いについては、それぞれのプライバシーポリシーをご確認ください。</p>
      </>
    ),
  },
  {
    no: '03',
    title: 'Cookieの管理と無効化',
    body: (
      <>
        <p>ブラウザの設定で、Cookieの受け入れを切り替えていただけます。多くのブラウザでは、次のような操作が可能です。</p>
        <ul>
          <li>すべてのCookieを受け入れる</li>
          <li>Cookieが設定されるときに通知を受ける</li>
          <li>すべてのCookieを拒否する</li>
        </ul>
        <p>なお、必須Cookieを無効にすると、ログインなど一部の機能が正常に動作しない場合があります。</p>
      </>
    ),
  },
  {
    no: '04',
    title: '本ポリシーの変更について',
    body: (
      <p>
        法令の変更やサービスの改善にともない、本ポリシーを変更することがあります。重要な変更は、サービス上でご案内いたします。
      </p>
    ),
  },
]

export default function CookiePolicyPage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />
      <main>
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                LEGAL — COOKIES
              </div>
              <h1 className="font-bold text-[clamp(34px,4.8vw,54px)] leading-[1.18] tracking-[-0.03em] text-bark mb-5 [word-break:keep-all]">
                Cookieポリシー
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
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                COOKIE TYPES
              </div>
              <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold text-bark tracking-[-0.02em] leading-[1.35] mb-6">
                使用しているCookieの種類
              </h2>
              <div className="surface-card rounded-[14px] p-6 md:p-8 overflow-x-auto">
                <table className="w-full text-left min-w-[560px]">
                  <thead>
                    <tr className="border-b border-black/8">
                      <th className="pb-4 pr-4 text-[11px] tracking-[0.18em] font-semibold text-bark-4 uppercase">
                        種類
                      </th>
                      <th className="pb-4 px-4 text-[11px] tracking-[0.18em] font-semibold text-bark-4 uppercase">
                        目的
                      </th>
                      <th className="pb-4 px-4 text-[11px] tracking-[0.18em] font-semibold text-bark-4 uppercase whitespace-nowrap">
                        保存期間
                      </th>
                      <th className="pb-4 pl-4 text-[11px] tracking-[0.18em] font-semibold text-bark-4 uppercase text-center">
                        必須
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/8">
                    {COOKIE_ROWS.map((row) => (
                      <tr key={row.kind}>
                        <td className="py-4 pr-4 text-[14px] font-bold text-bark whitespace-nowrap align-top">
                          {row.kind}
                        </td>
                        <td className="py-4 px-4 text-[13px] text-bark-2 leading-[1.85] align-top">
                          {row.purpose}
                        </td>
                        <td className="py-4 px-4 text-[13px] text-bark-3 whitespace-nowrap align-top">
                          {row.retention}
                        </td>
                        <td className="py-4 pl-4 text-[12px] align-top text-center">
                          {row.required ? (
                            <span className="inline-block px-2.5 py-1 rounded-full bg-bark text-warm text-[10px] tracking-[0.12em] font-bold">
                              必要
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full bg-bark-4/10 text-bark-3 text-[10px] tracking-[0.12em] font-semibold">
                              任意
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-black/5 bg-sage-xlight/40">
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
                CONTACT
              </div>
              <h2 className="text-[20px] font-bold text-bark tracking-[-0.015em] mb-3">
                本ポリシーへのお問い合わせ
              </h2>
              <p className="text-[13px] text-bark-2 leading-[1.9] mb-4">
                ご質問・ご相談は、下記の窓口までお気軽にお寄せください。
              </p>
              <dl className="grid grid-cols-[96px_1fr] gap-3 text-[13px] md:text-[14px]">
                <dt className="text-bark-4 text-[11px] tracking-[0.18em] font-semibold pt-1">
                  担当
                </dt>
                <dd className="text-bark font-medium">株式会社Ouver プライバシー担当</dd>
                <dt className="text-bark-4 text-[11px] tracking-[0.18em] font-semibold pt-1">
                  メール
                </dt>
                <dd className="text-bark font-bold">privacy@ouver.jp</dd>
              </dl>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
