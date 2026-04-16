'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HelpArticlePage() {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null)

  const article = {
    title: '入札の仕組みについて',
    category: '入札',
    updatedAt: '2026年4月1日',
    content: [
      {
        heading: '入札方式とは',
        body: 'Ouverでは、相続不動産の売却に入札方式を採用しています。売主が設定した入札期間中に、買い手候補が希望金額を提示し、入札期間終了後に売主が入札者を選択する仕組みです。',
      },
      {
        heading: '入札の流れ',
        body: '1. 物件詳細ページから「入札する」ボタンをクリックします。\n2. 希望金額と取引条件（任意）を入力します。\n3. 入力内容を確認して入札を確定します。\n4. 入札期間中であれば、金額の更新やキャンセルが可能です。\n5. 入札期間終了後、売主が入札者を選択します。',
      },
      {
        heading: '入札金額について',
        body: '入札金額は売主のみに表示されます。他の入札者の金額は非公開です。入札件数は物件詳細ページに表示されますが、各入札者の金額は公開されません。',
      },
      {
        heading: '入札の更新・キャンセル',
        body: '入札期間中であれば、金額の更新は何度でも可能です。更新すると、最新の金額が有効な入札として扱われます。キャンセルも入札期間中であれば可能で、費用は一切かかりません。',
      },
    ],
  }

  const relatedArticles = [
    { title: '入札金額の決め方のポイント', slug: 'bid-amount-tips' },
    { title: '入札をキャンセルするには', slug: 'cancel-bid' },
    { title: '売主が入札者を選ぶ基準', slug: 'bid-selection-criteria' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* パンくずリスト */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6">
            <Link href="/help" className="hover:text-neutral-600 transition-colors">ヘルプセンター</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{article.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-600">{article.title}</span>
          </nav>

          <Link href="/help" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
            <ArrowLeft className="w-4 h-4" />
            ヘルプセンターに戻る
          </Link>

          {/* 記事本文 */}
          <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
            <h1 className="text-xl font-bold mb-2">{article.title}</h1>
            <p className="text-xs text-neutral-400 mb-8">最終更新: {article.updatedAt}</p>

            <div className="space-y-6">
              {article.content.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-base font-semibold mb-2">{section.heading}</h2>
                  <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* フィードバック */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6 text-center">
            <p className="text-sm font-medium mb-3">この記事は役に立ちましたか？</p>
            {feedback === null ? (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setFeedback('yes')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  はい
                </button>
                <button
                  onClick={() => setFeedback('no')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  いいえ
                </button>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">
                フィードバックありがとうございます。
                {feedback === 'no' && (
                  <span>改善のため、<Link href="/contact" className="text-primary-500 hover:underline">お問い合わせ</Link>からご意見をお寄せください。</span>
                )}
              </p>
            )}
          </div>

          {/* 関連記事 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-3">関連する記事</h3>
            <div className="space-y-1">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/help/${a.slug}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                >
                  <span className="text-sm text-neutral-700 group-hover:text-primary-500 transition-colors">
                    {a.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
