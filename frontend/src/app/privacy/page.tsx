import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'プライバシーポリシー｜Ouver',
  description:
    '株式会社Ouverが運営する相続不動産マッチング「Ouver」のプライバシーポリシー。個人情報の収集・利用目的・第三者提供・安全管理についてご案内します。',
}

type Section = {
  no: string
  title: string
  body: React.ReactNode
}

const SECTIONS: Section[] = [
  {
    no: '01',
    title: '個人情報の収集について',
    body: (
      <>
        <p>
          株式会社Ouver（以下「当社」）は、本サービスをご提供するにあたり、次のような情報をお預かりする場合があります。
        </p>
        <ul>
          <li>お名前・メールアドレス・電話番号・ご住所</li>
          <li>本人確認書類（運転免許証など）の画像</li>
          <li>物件に関する情報（住所・面積・価格など）</li>
          <li>入札・取引の履歴</li>
          <li>資格情報（士業パートナーの方の場合）</li>
          <li>Cookie・IPアドレス・ブラウザ情報などのアクセスログ</li>
        </ul>
      </>
    ),
  },
  {
    no: '02',
    title: '個人情報の利用目的',
    body: (
      <>
        <p>お預かりした情報は、次の目的のために利用させていただきます。</p>
        <ul>
          <li>本サービスのご提供と運営</li>
          <li>ご利用者さまの本人確認</li>
          <li>物件情報の掲載、入札の運営</li>
          <li>仲介業者・士業パートナーとの、業務上必要な情報共有</li>
          <li>サービス改善のための統計分析</li>
          <li>大切なお知らせのご案内</li>
          <li>お問い合わせへのご対応</li>
          <li>利用規約に違反する行為への対応</li>
        </ul>
      </>
    ),
  },
  {
    no: '03',
    title: '第三者への提供について',
    body: (
      <>
        <p>
          次の場合を除き、あらかじめご本人の同意なく第三者に個人情報を提供することはいたしません。
        </p>
        <ul>
          <li>法令にもとづく場合</li>
          <li>人の生命・身体・財産の保護のために必要なとき</li>
          <li>取引の成立に必要な範囲で、仲介業者・士業パートナーに共有する場合</li>
          <li>業務委託先に、必要な範囲で提供する場合</li>
        </ul>
      </>
    ),
  },
  {
    no: '04',
    title: '安全管理について',
    body: (
      <p>
        個人情報の漏えい・紛失・改ざんを防ぐため、必要かつ適切な対策を講じています。通信はSSL/TLSで暗号化し、アクセス権限の管理と定期的なセキュリティ監査を行っています。
      </p>
    ),
  },
  {
    no: '05',
    title: 'Cookieの利用について',
    body: (
      <p>
        ご利用体験の向上とサービス改善のため、Cookieを使用しています。ブラウザの設定でCookieの受け入れを拒否することもできますが、一部の機能が正常に動作しない場合があります。
      </p>
    ),
  },
  {
    no: '06',
    title: '開示・訂正・削除のご請求',
    body: (
      <p>
        ご自身に関する個人情報の開示・訂正・追加・削除・利用停止をご請求いただけます。ご請求の際は、本人確認のうえご対応いたします。
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />
      <main>
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                LEGAL — PRIVACY
              </div>
              <h1 className="font-bold text-[clamp(34px,4.8vw,54px)] leading-[1.18] tracking-[-0.03em] text-bark mb-5 [word-break:keep-all]">
                プライバシーポリシー
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
                      <div className="legal-body text-[14px] text-bark-2 leading-[1.95] space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mt-2">
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
