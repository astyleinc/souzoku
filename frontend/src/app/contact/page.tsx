'use client'

import { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function ContactPage() {
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [content, setContent] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email || !content.trim()) {
      setError('お名前、メールアドレス、お問い合わせ内容は必須です')
      return
    }
    if (!agreed) {
      setError('プライバシーポリシーに同意してください')
      return
    }

    setSending(true)
    const res = await api.post('/support/contact', {
      name: name.trim(),
      email,
      phone: phone || undefined,
      category: category || 'other',
      content: content.trim(),
    })

    if (res.success) {
      setSent(true)
    } else {
      setError('送信に失敗しました。時間をおいて再度お試しください。')
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-500 tracking-tight">
            Ouver
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-neutral-500 hover:text-neutral-700 transition-colors">
              ログイン
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">お問い合わせ</h1>
        <p className="text-sm text-neutral-400 mb-8">
          サービスに関するご質問・ご相談は、以下のフォームよりお問い合わせください。
        </p>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center">
            <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">送信が完了しました</h2>
            <p className="text-sm text-neutral-400 mb-6">
              通常2営業日以内にご返信いたします。<br />
              お急ぎの場合はお電話でご連絡ください。
            </p>
            <Link href="/" className="text-sm text-primary-500 hover:underline">
              トップページに戻る
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* フォーム */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white rounded-2xl shadow-card p-6">
              {error && (
                <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">お問い合わせ種別</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="">選択してください</option>
                    <option value="service">サービスについて</option>
                    <option value="account">アカウントについて</option>
                    <option value="property">物件掲載について</option>
                    <option value="bid">入札について</option>
                    <option value="professional">士業パートナー登録について</option>
                    <option value="broker">提携業者登録について</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">お名前 <span className="text-error-500">*</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="山田 太郎"
                      className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">メールアドレス <span className="text-error-500">*</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@example.com"
                      className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">電話番号（任意）</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03-1234-5678"
                    className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">お問い合わせ内容 <span className="text-error-500">*</span></label>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="お問い合わせ内容を詳しくご記入ください"
                    className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="privacy-agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 rounded border-neutral-300"
                  />
                  <label htmlFor="privacy-agree" className="text-xs text-neutral-500">
                    <Link href="/privacy" className="text-primary-500 hover:underline">プライバシーポリシー</Link>に同意の上、送信してください
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                  送信する
                </button>
              </div>
            </form>

            {/* 連絡先情報 */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">メール</p>
                    <p className="text-sm font-medium">support@ouver.co.jp</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">電話（平日 10:00-18:00）</p>
                    <p className="text-sm font-medium">お問い合わせフォームをご利用ください</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">所在地</p>
                    <p className="text-sm font-medium">株式会社Ouver</p>
                    <p className="text-xs text-neutral-400 mt-0.5">東京都渋谷区</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-100 rounded-xl text-xs text-neutral-500 leading-relaxed">
                <p>通常2営業日以内にご返信いたします。お急ぎの場合はお電話でご連絡ください。</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-neutral-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>&copy; 2026 株式会社Ouver</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-neutral-600 transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-neutral-600 transition-colors">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
