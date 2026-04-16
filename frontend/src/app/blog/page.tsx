'use client'

import { useState, useEffect } from 'react'
import { Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { api, toItems } from '@/lib/api'

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  thumbnailUrl: string | null
}

const categories = [
  { key: 'all', label: 'すべて' },
  { key: 'news', label: 'お知らせ' },
  { key: 'column', label: '相続コラム' },
  { key: 'case', label: '活用事例' },
  { key: 'update', label: '更新情報' },
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
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const params = activeCategory !== 'all' ? `?category=${activeCategory}` : ''
      const res = await api.get<unknown>(`/blog/posts${params}`)
      if (res.success) {
        setPosts(toItems<BlogPost>(res.data))
      }
      setLoading(false)
    }
    setLoading(true)
    load()
  }, [activeCategory])

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

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-20">記事がありません</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {posts.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-40 bg-neutral-100 flex items-center justify-center">
                    {article.thumbnailUrl ? (
                      <img src={article.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-neutral-400">サムネイル画像</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor[article.category] ?? 'bg-neutral-100 text-neutral-600'}`}>
                        {categoryLabel[article.category] ?? article.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Calendar className="w-3 h-3" />
                        {article.publishedAt?.slice(0, 10)}
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
