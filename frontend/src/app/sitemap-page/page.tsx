import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'サイトマップ｜Ouver',
  description:
    'Ouverのサイトマップ。サービス・サポート・会社情報・法的情報・ロール別の各ページへ、ここから移動いただけます。',
}

type SitemapSection = {
  label: string
  eyebrow: string
  links: { label: string; href: string }[]
}

const SECTIONS: SitemapSection[] = [
  {
    label: 'サービス',
    eyebrow: 'SERVICE',
    links: [
      { label: 'トップページ', href: '/' },
      { label: 'ご利用の流れ', href: '/guide' },
      { label: '料金のご案内', href: '/pricing' },
      { label: '安全な取引のしくみ', href: '/escrow' },
      { label: '物件をさがす', href: '/properties' },
      { label: '新規ご登録', href: '/register' },
      { label: 'ログイン', href: '/login' },
    ],
  },
  {
    label: 'サポート',
    eyebrow: 'SUPPORT',
    links: [
      { label: 'ヘルプセンター', href: '/help' },
      { label: 'よくあるご質問', href: '/faq' },
      { label: 'お問い合わせ', href: '/contact' },
    ],
  },
  {
    label: '会社情報',
    eyebrow: 'COMPANY',
    links: [
      { label: '会社概要', href: '/about' },
      { label: '提携パートナー', href: '/partners' },
      { label: 'ご利用者の声', href: '/stories' },
      { label: 'お知らせ・コラム', href: '/blog' },
      { label: 'プレス・メディア', href: '/press' },
    ],
  },
  {
    label: '法的情報',
    eyebrow: 'LEGAL',
    links: [
      { label: '利用規約', href: '/terms' },
      { label: 'プライバシーポリシー', href: '/privacy' },
      { label: '特定商取引法にもとづく表記', href: '/tokusho' },
      { label: 'Cookieポリシー', href: '/cookie-policy' },
      { label: 'アクセシビリティ方針', href: '/accessibility' },
    ],
  },
  {
    label: '売主さま向け',
    eyebrow: 'FOR SELLERS',
    links: [
      { label: 'ダッシュボード', href: '/seller' },
      { label: '出品物件', href: '/seller/properties' },
      { label: '入札一覧', href: '/seller/bids' },
      { label: '案件の進捗', href: '/seller/cases' },
      { label: '書類の管理', href: '/seller/documents' },
      { label: '取引の履歴', href: '/seller/transactions' },
      { label: '各種設定', href: '/seller/settings' },
    ],
  },
  {
    label: '買い手さま向け',
    eyebrow: 'FOR BUYERS',
    links: [
      { label: 'ダッシュボード', href: '/buyer' },
      { label: '入札の履歴', href: '/buyer/bids' },
      { label: 'お気に入り', href: '/buyer/favorites' },
      { label: '案件の進捗', href: '/buyer/cases' },
      { label: '取引の履歴', href: '/buyer/transactions' },
      { label: '各種設定', href: '/buyer/settings' },
    ],
  },
  {
    label: '士業パートナー向け',
    eyebrow: 'FOR PROFESSIONALS',
    links: [
      { label: 'ダッシュボード', href: '/professional' },
      { label: '紹介案件', href: '/professional/referrals' },
      { label: '紹介料の実績', href: '/professional/earnings' },
      { label: '紹介リンク', href: '/professional/referral-link' },
      { label: '紹介クライアント', href: '/professional/clients' },
      { label: '各種設定', href: '/professional/settings' },
    ],
  },
  {
    label: '提携業者さま向け',
    eyebrow: 'FOR BROKERS',
    links: [
      { label: 'ダッシュボード', href: '/broker' },
      { label: '案件の管理', href: '/broker/cases' },
      { label: 'ご請求書', href: '/broker/invoices' },
      { label: '各種設定', href: '/broker/settings' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />
      <main>
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                SITE MAP
              </div>
              <h1 className="font-bold text-[clamp(34px,4.8vw,54px)] leading-[1.18] tracking-[-0.03em] text-bark mb-5 [word-break:keep-all]">
                サイトマップ
              </h1>
              <p className="text-[14px] text-bark-2 leading-[1.95] max-w-[620px]">
                Ouverのすべてのページを、こちらからご覧いただけます。
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {SECTIONS.map((section) => (
                <div
                  key={section.label}
                  className="surface-card rounded-[14px] p-7 md:p-8"
                >
                  <div className="text-[11px] tracking-[0.28em] font-semibold text-sage-deep mb-3">
                    {section.eyebrow}
                  </div>
                  <h2 className="text-[16px] font-bold text-bark tracking-[-0.01em] mb-5">
                    {section.label}
                  </h2>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[13px] text-bark-2 leading-[1.7] underline-offset-[4px] hover:underline decoration-sage-deep/30 hover:text-sage-deep transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
