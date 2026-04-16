'use client'

import { useState } from 'react'
import { ArrowRight, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const categories = [
  { key: 'all', label: 'すべて' },
  { key: 'general', label: '全般' },
  { key: 'seller', label: '売主' },
  { key: 'buyer', label: '買い手' },
  { key: 'professional', label: '士業' },
  { key: 'broker', label: '業者' },
  { key: 'pricing', label: '料金' },
  { key: 'security', label: 'セキュリティ' },
]

const faqs = [
  { q: 'Ouverとはどんなサービスですか？', a: '相続不動産に特化した入札型マッチングプラットフォームです。売主（相続人）が物件を掲載し、入札方式で買い手とマッチングします。士業ネットワークを通じた紹介にも対応しています。', category: 'general' },
  { q: '利用登録に必要なものは何ですか？', a: 'メールアドレスがあれば登録できます。物件の掲載時には本人確認書類（運転免許証等）のアップロードが必要です。', category: 'general' },
  { q: '対応エリアはどこですか？', a: '現在は東京都・神奈川県を中心にサービスを提供しています。今後、首都圏全域に拡大予定です。', category: 'general' },
  { q: '相続登記が完了していなくても掲載できますか？', a: 'はい。登記手続き中の物件は「公開（登記中）」として条件付きで掲載できます。ただし2ヶ月以内に登記完了が必要です。', category: 'seller' },
  { q: '物件の審査にはどのくらいかかりますか？', a: '通常1〜3営業日で審査が完了します。書類に不備がある場合は差し戻しとなり、修正後に再審査となります。', category: 'seller' },
  { q: '入札期間は自分で設定できますか？', a: 'はい。物件登録時に入札期間を設定できます。一般的には7日〜14日が推奨されています。', category: 'seller' },
  { q: '最高額の入札者を選ばなくてもいいですか？', a: 'はい。売主は金額だけでなく、取引条件なども考慮して自由に入札者を選択できます。', category: 'seller' },
  { q: '入札した金額は他の入札者に見えますか？', a: 'いいえ。入札金額は売主のみに表示されます。入札件数は公開されますが、各入札者の金額は非公開です。', category: 'buyer' },
  { q: '入札金額は後から変更できますか？', a: 'はい。入札期間中であれば何度でも金額を更新できます。最新の金額が有効となります。', category: 'buyer' },
  { q: '入札をキャンセルできますか？', a: 'はい。入札期間中であればキャンセル可能です。ただし、売主が入札者を選択した後のキャンセルは、提携業者との契約条件に従います。', category: 'buyer' },
  { q: '士業パートナーの登録条件は何ですか？', a: '税理士、司法書士、弁護士、行政書士等の資格をお持ちの方が対象です。資格証明書のアップロードが必要です。', category: 'professional' },
  { q: '紹介料はいつ支払われますか？', a: '案件の決済完了後、翌月末までに指定の銀行口座にお振込みします。', category: 'professional' },
  { q: '紹介リンクの有効期限はありますか？', a: '紹介リンクに有効期限はありません。クライアントがリンクから登録した時点で紹介関係が記録されます。', category: 'professional' },
  { q: '案件の割り当て基準は何ですか？', a: 'エリア、過去の実績、対応可能な物件種別などを考慮して運営が割り当てます。', category: 'broker' },
  { q: '掲載料や入札に費用はかかりますか？', a: 'いいえ。物件の掲載、入札の受付・参加はすべて無料です。費用が発生するのは成約時の仲介手数料のみです。', category: 'pricing' },
  { q: '仲介手数料はいくらですか？', a: '宅地建物取引業法に基づく上限額です。売買価格が400万円を超える場合は「売買価格×3%＋6万円（税別）」となります。', category: 'pricing' },
  { q: '士業紹介料は売主が負担しますか？', a: 'いいえ。紹介料は仲介手数料の中から配分されるため、売主に追加の負担はありません。', category: 'pricing' },
  { q: '個人情報はどのように保護されていますか？', a: 'SSL/TLS暗号化通信、アクセス権限管理、定期的なセキュリティ監査を実施しています。詳しくはプライバシーポリシーをご確認ください。', category: 'security' },
  { q: '書類の閲覧権限は管理できますか？', a: 'はい。売主は書類ごとに士業パートナーへの閲覧権限を個別に設定できます。', category: 'security' },
]

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = faqs.filter((faq) => {
    const matchCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchSearch = searchQuery === '' || faq.q.includes(searchQuery) || faq.a.includes(searchQuery)
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">よくある質問</h1>
          <p className="text-sm text-neutral-400 mb-6">
            Ouverのサービスに関するよくある質問をまとめました。
          </p>

          {/* 検索 */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="質問を検索..."
              className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
            />
          </div>

          {/* カテゴリフィルタ */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ一覧 */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-neutral-400">該当する質問が見つかりませんでした。</p>
              </div>
            ) : (
              filtered.map((faq) => (
                <details key={faq.q} className="bg-white rounded-2xl shadow-card group">
                  <summary className="px-5 py-4 text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <ArrowRight className="w-4 h-4 text-neutral-300 transition-transform group-open:rotate-90 shrink-0 ml-3" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))
            )}
          </div>

          {/* お問い合わせCTA */}
          <div className="mt-10 p-6 bg-white rounded-2xl shadow-card text-center">
            <MessageSquare className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">お探しの回答が見つかりませんか？</p>
            <p className="text-xs text-neutral-400 mb-4">お気軽にお問い合わせください。</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
            >
              お問い合わせ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
