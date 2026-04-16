'use client'

import { useState } from 'react'
import {
  BookOpen,
  Building2,
  Gavel,
  FileText,
  CreditCard,
  ClipboardList,
  ArrowRight,
  MessageSquare,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const helpCategories = [
  { icon: BookOpen, label: 'はじめに', description: '登録方法やサービス概要', slug: 'getting-started', color: 'text-primary-500', bg: 'bg-primary-50' },
  { icon: Building2, label: '物件掲載', description: '物件の登録・編集・審査', slug: 'listing', color: 'text-info-500', bg: 'bg-info-50' },
  { icon: Gavel, label: '入札', description: '入札の仕方・金額変更・キャンセル', slug: 'bidding', color: 'text-cta-500', bg: 'bg-cta-50' },
  { icon: ClipboardList, label: '案件・取引', description: '案件進捗・契約・決済', slug: 'transactions', color: 'text-secondary-500', bg: 'bg-secondary-50' },
  { icon: FileText, label: '書類', description: 'アップロード・閲覧許可', slug: 'documents', color: 'text-warning-500', bg: 'bg-warning-50' },
  { icon: CreditCard, label: '支払い・手数料', description: '料金・仲介手数料・紹介料', slug: 'payment', color: 'text-success-500', bg: 'bg-success-50' },
]

const popularArticles = [
  { title: 'アカウントの登録方法', slug: 'how-to-register' },
  { title: '物件を掲載するには', slug: 'how-to-list-property' },
  { title: '入札の仕組みについて', slug: 'bidding-process' },
  { title: '仲介手数料の計算方法', slug: 'commission-calculation' },
  { title: '士業パートナーの紹介料について', slug: 'referral-fee' },
  { title: '書類の閲覧権限を設定するには', slug: 'document-permissions' },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">ヘルプセンター</h1>
            <p className="text-sm text-neutral-400">お困りのことはありませんか？</p>
          </div>

          {/* 検索 */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キーワードで検索..."
                className="w-full pl-10 pr-4 py-3 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
              />
            </div>
          </div>

          {/* カテゴリグリッド */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {helpCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/help/${cat.slug}`}
                className="bg-white rounded-2xl shadow-card p-5 hover:shadow-md transition-shadow group"
              >
                <div className={`w-10 h-10 ${cat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <cat.icon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <h3 className="text-sm font-semibold mb-0.5 group-hover:text-primary-500 transition-colors">{cat.label}</h3>
                <p className="text-xs text-neutral-400">{cat.description}</p>
              </Link>
            ))}
          </div>

          {/* 人気記事 */}
          <section className="bg-white rounded-2xl shadow-card p-6 mb-10">
            <h2 className="text-base font-semibold mb-4">人気の記事</h2>
            <div className="space-y-1">
              {popularArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/help/${article.slug}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                >
                  <span className="text-sm text-neutral-700 group-hover:text-primary-500 transition-colors">
                    {article.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          {/* お問い合わせCTA */}
          <div className="p-6 bg-white rounded-2xl shadow-card text-center">
            <MessageSquare className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">お探しの情報が見つかりませんか？</p>
            <p className="text-xs text-neutral-400 mb-4">サポートチームがお手伝いします。</p>
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
