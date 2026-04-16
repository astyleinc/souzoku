import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const sitemapSections = [
  {
    title: 'サービス',
    links: [
      { label: 'トップページ', href: '/' },
      { label: 'ご利用の流れ', href: '/guide' },
      { label: '料金について', href: '/pricing' },
      { label: '安全な取引の仕組み', href: '/escrow' },
      { label: '物件一覧', href: '/properties' },
      { label: '新規登録', href: '/register' },
      { label: 'ログイン', href: '/login' },
    ],
  },
  {
    title: 'サポート',
    links: [
      { label: 'ヘルプセンター', href: '/help' },
      { label: 'よくある質問', href: '/faq' },
      { label: 'お問い合わせ', href: '/contact' },
    ],
  },
  {
    title: '会社情報',
    links: [
      { label: '会社概要', href: '/about' },
      { label: '提携パートナー', href: '/partners' },
      { label: '成功事例', href: '/stories' },
      { label: 'お知らせ・コラム', href: '/blog' },
      { label: 'メディア掲載・プレス', href: '/press' },
    ],
  },
  {
    title: '法的情報',
    links: [
      { label: '利用規約', href: '/terms' },
      { label: 'プライバシーポリシー', href: '/privacy' },
      { label: '特定商取引法に基づく表記', href: '/tokusho' },
      { label: 'Cookieポリシー', href: '/cookie-policy' },
      { label: 'アクセシビリティ方針', href: '/accessibility' },
    ],
  },
  {
    title: '売主向け',
    links: [
      { label: 'ダッシュボード', href: '/seller' },
      { label: '出品物件', href: '/seller/properties' },
      { label: '入札一覧', href: '/seller/bids' },
      { label: '案件進捗', href: '/seller/cases' },
      { label: '書類管理', href: '/seller/documents' },
      { label: '取引履歴', href: '/seller/transactions' },
      { label: '設定', href: '/seller/settings' },
    ],
  },
  {
    title: '買い手向け',
    links: [
      { label: 'ダッシュボード', href: '/buyer' },
      { label: '入札履歴', href: '/buyer/bids' },
      { label: 'お気に入り', href: '/buyer/favorites' },
      { label: '案件進捗', href: '/buyer/cases' },
      { label: '取引履歴', href: '/buyer/transactions' },
      { label: '設定', href: '/buyer/settings' },
    ],
  },
  {
    title: '士業パートナー向け',
    links: [
      { label: 'ダッシュボード', href: '/professional' },
      { label: '紹介案件', href: '/professional/referrals' },
      { label: '紹介料実績', href: '/professional/earnings' },
      { label: '紹介リンク', href: '/professional/referral-link' },
      { label: '紹介クライアント', href: '/professional/clients' },
      { label: '設定', href: '/professional/settings' },
    ],
  },
  {
    title: '提携業者向け',
    links: [
      { label: 'ダッシュボード', href: '/broker' },
      { label: '案件管理', href: '/broker/cases' },
      { label: '請求書', href: '/broker/invoices' },
      { label: '設定', href: '/broker/settings' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-8">サイトマップ</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitemapSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold text-neutral-700 mb-3">{section.title}</h2>
                <ul className="space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-500 hover:text-primary-500 transition-colors"
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
      </main>
      <Footer />
    </div>
  )
}
