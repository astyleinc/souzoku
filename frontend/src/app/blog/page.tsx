'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { api, toItems } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  thumbnailUrl: string | null
}

type CategoryKey = 'all' | 'news' | 'column' | 'case' | 'update'

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'news', label: 'お知らせ' },
  { key: 'column', label: '相続コラム' },
  { key: 'case', label: '活用事例' },
  { key: 'update', label: '更新情報' },
]

const CATEGORY_LABEL: Record<string, string> = {
  news: 'お知らせ',
  column: '相続コラム',
  case: '活用事例',
  update: '更新情報',
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')
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
    <div className="bg-warm min-h-screen">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-10 md:pb-14">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-8 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                JOURNAL
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                相続と不動産の、
                <br />
                ちょっと気になること。
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[620px] font-medium">
                相続不動産にまつわるトピックや、Ouverからのお知らせをお届けします。
                読み物として、ときどきのぞいてみてください。
              </p>
            </div>
          </div>
        </section>

        {/* CATEGORY TABS */}
        <section className="border-y border-black/5 bg-warm sticky top-16 z-10 backdrop-blur">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = activeCategory === c.key
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActiveCategory(c.key)}
                  className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                    active
                      ? 'bg-bark text-warm'
                      : 'bg-white text-bark-2 border border-black/8 hover:border-black/20'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* POSTS */}
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            {loading ? (
              <div className="py-20">
                <LoadingSpinner />
              </div>
            ) : posts.length === 0 ? (
              <div className="surface-card rounded-[14px] p-14 text-center">
                <p className="text-[15px] text-bark-2 mb-2 font-medium">
                  記事はまだありません
                </p>
                <p className="text-[13px] text-bark-3 leading-[1.85]">
                  公開され次第、こちらに掲載します。
                </p>
              </div>
            ) : (
              <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {posts.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="group block surface-card rounded-[14px] overflow-hidden transition-[transform,box-shadow] hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-[16/10] bg-sage-xlight overflow-hidden">
                        {article.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={article.thumbnailUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[11px] tracking-[0.3em] font-semibold text-sage-deep/60">
                            OUVER JOURNAL
                          </div>
                        )}
                      </div>
                      <div className="p-6 md:p-7">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[11px] tracking-[0.24em] font-semibold text-sage-deep">
                            {CATEGORY_LABEL[article.category] ?? article.category}
                          </span>
                          <span
                            aria-hidden
                            className="block w-4 h-px bg-sage-deep/30"
                          />
                          <time className="price text-[12px] text-bark-4">
                            {formatDate(article.publishedAt)}
                          </time>
                        </div>
                        <h2 className="text-[17px] font-bold text-bark leading-[1.5] tracking-[-0.01em] mb-3 group-hover:text-sage-deep transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-[13px] text-bark-2 leading-[1.9] line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
