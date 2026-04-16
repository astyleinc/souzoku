'use client'

import { useState } from 'react'
import { Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const categories = [
  { key: 'all', label: 'すべて' },
  { key: 'news', label: 'お知らせ' },
  { key: 'column', label: '相続コラム' },
  { key: 'case', label: '活用事例' },
  { key: 'update', label: '更新情報' },
]

const mockArticles = [
  { slug: 'service-launch', title: 'Ouverサービス開始のお知らせ', excerpt: '相続不動産に特化した入札型マッチングプラットフォーム「Ouver」が正式にサービスを開始しました。', category: 'news', date: '2026-04-15', thumbnail: null },
  { slug: 'inheritance-tax-basics', title: '相続不動産の税金、基礎から解説', excerpt: '相続で取得した不動産にかかる税金の種類と、知っておくべき控除制度について、わかりやすく解説します。', category: 'column', date: '2026-04-12', thumbnail: null },
  { slug: 'nerima-apartment-case', title: '練馬区のマンションが入札開始2週間で成約', excerpt: '相続で取得したマンションを、入札方式でスピーディーに売却できた事例をご紹介します。', category: 'case', date: '2026-04-10', thumbnail: null },
  { slug: 'bid-system-update', title: '入札機能のアップデートについて', excerpt: '入札金額の更新機能、入札履歴の表示など、入札に関する機能を改善しました。', category: 'update', date: '2026-04-08', thumbnail: null },
  { slug: 'registration-free-guide', title: '相続登記が未完了でも掲載OK。条件付き掲載の仕組み', excerpt: '2024年に義務化された相続登記。手続き中でもOuverに掲載できる「条件付き掲載」について解説します。', category: 'column', date: '2026-04-05', thumbnail: null },
  { slug: 'professional-network', title: '士業ネットワークとの連携を強化しました', excerpt: '税理士・司法書士・弁護士との提携を拡大し、より多くの相続相談にお応えできるようになりました。', category: 'news', date: '2026-04-01', thumbnail: null },
]

const categoryLabel: Record<string, string> = {
  news: 'お知らせ',
  column: '相続コラム',
  case: '活用事例',
  update: '更新情報',
}

const categoryColor: Record<string, string> = {
  news: 'bg-primary-50 text-primary-700',
  column: 'bg-secondary-50 text-secondary-700',
  case: 'bg-cta-50 text-cta-700',
  update: 'bg-info-50 text-info-700',
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? mockArticles
    : mockArticles.filter((a) => a.category === activeCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">お知らせ・コラム</h1>
          <p className="text-sm text-neutral-400 mb-6">
            相続不動産に関する情報やサービスの最新情報をお届けします。
          </p>

          {/* カテゴリタブ */}
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

          {/* 記事グリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-40 bg-neutral-100 flex items-center justify-center">
                  <span className="text-xs text-neutral-400">サムネイル画像</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor[article.category]}`}>
                      {categoryLabel[article.category]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                  </div>
                  <h2 className="text-sm font-semibold mb-1.5 group-hover:text-primary-500 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* ページネーション */}
          <div className="flex items-center justify-center gap-2">
            <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 text-sm font-medium text-white bg-primary-500 rounded-lg">1</button>
            <button className="w-8 h-8 text-sm font-medium text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors">2</button>
            <button className="w-8 h-8 text-sm font-medium text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors">3</button>
            <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
