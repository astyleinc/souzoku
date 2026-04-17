'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type BlogPost = {
  id: string
  title: string
  slug: string
  category: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

type HelpArticle = {
  id: string
  title: string
  slug: string
  category: string
  status: 'draft' | 'published'
  createdAt: string
}

type Tab = 'blog' | 'help'

export default function AdminContentPage() {
  const [tab, setTab] = useState<Tab>('blog')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const load = async () => {
      const [blogRes, helpRes] = await Promise.all([
        api.get<unknown>('/blog/posts?limit=100'),
        api.get<unknown>('/help/articles?limit=100'),
      ])
      if (blogRes.success) setBlogPosts(toItems<BlogPost>(blogRes.data))
      if (helpRes.success) setHelpArticles(toItems<HelpArticle>(helpRes.data))
      setLoading(false)
    }
    load()
  }, [])

  const handleDeleteBlog = async (id: string) => {
    const res = await api.delete(`/blog/posts/${id}`)
    if (res.success) setBlogPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleDeleteHelp = async (id: string) => {
    const res = await api.delete(`/help/articles/${id}`)
    if (res.success) setHelpArticles((prev) => prev.filter((a) => a.id !== id))
  }

  const filteredBlog = blogPosts.filter((p) =>
    !keyword || p.title.toLowerCase().includes(keyword.toLowerCase())
  )
  const filteredHelp = helpArticles.filter((a) =>
    !keyword || a.title.toLowerCase().includes(keyword.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardShell title="コンテンツ管理" roleLabel="管理画面" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="コンテンツ管理" roleLabel="管理画面" navItems={adminNav}>
      {/* タブ */}
      <div className="flex items-center gap-1 mb-6 bg-neutral-100 rounded-xl p-1 w-fit">
        {[
          { key: 'blog' as Tab, label: 'ブログ記事', icon: FileText, count: blogPosts.length },
          { key: 'help' as Tab, label: 'ヘルプ記事', icon: HelpCircle, count: helpArticles.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t.key ? 'bg-white shadow-sm text-foreground' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            <span className="text-xs text-neutral-400 ml-1">({t.count})</span>
          </button>
        ))}
      </div>

      {/* 検索 + 新規作成 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="タイトルで検索..."
            className="pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl w-full sm:w-72 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
          />
        </div>
        <Link
          href={tab === 'blog' ? '/admin/content/blog/new' : '/admin/content/help/new'}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </Link>
      </div>

      {/* ブログ記事一覧 */}
      {tab === 'blog' && (
        filteredBlog.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-10 text-center">
            <FileText className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">ブログ記事がありません</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">タイトル</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">カテゴリ</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">更新日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlog.map((post) => (
                    <tr key={post.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <p className="font-medium truncate max-w-[280px]">{post.title}</p>
                        <p className="text-xs text-neutral-400">/{post.slug}</p>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">{post.category}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          post.status === 'published' ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {post.status === 'published' ? '公開中' : '下書き'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-400">{post.updatedAt?.slice(0, 10)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <Link href={`/blog/${post.slug}`} className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/content/blog/${post.id}/edit`} className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(post.id)}
                            className="p-1.5 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ヘルプ記事一覧 */}
      {tab === 'help' && (
        filteredHelp.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-10 text-center">
            <HelpCircle className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">ヘルプ記事がありません</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">タイトル</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">カテゴリ</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">作成日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHelp.map((article) => (
                    <tr key={article.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <p className="font-medium truncate max-w-[280px]">{article.title}</p>
                        <p className="text-xs text-neutral-400">/{article.slug}</p>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">{article.category}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          article.status === 'published' ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {article.status === 'published' ? '公開中' : '下書き'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-400">{article.createdAt?.slice(0, 10)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <Link href={`/help/${article.slug}`} className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/content/help/${article.id}/edit`} className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteHelp(article.id)}
                            className="p-1.5 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </DashboardShell>
  )
}
