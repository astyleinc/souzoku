'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

type Category = 'all' | 'general' | 'seller' | 'buyer' | 'professional' | 'broker' | 'pricing' | 'security'

type Faq = {
  q: string
  a: string
  category: Exclude<Category, 'all'>
}

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'general', label: '全般' },
  { key: 'seller', label: '売主' },
  { key: 'buyer', label: '買い手' },
  { key: 'professional', label: '士業' },
  { key: 'broker', label: '提携業者' },
  { key: 'pricing', label: '料金' },
  { key: 'security', label: 'セキュリティ' },
]

const FAQS: Faq[] = [
  {
    q: 'Ouverはどんなサービスですか？',
    a: '相続した不動産を入札方式で売却するためのマッチングサービスです。売主が物件を掲載すると、複数の買い手から入札が届きます。税理士や司法書士など、士業パートナーからの紹介にも対応しています。',
    category: 'general',
  },
  {
    q: '登録に必要なものを教えてください',
    a: 'メールアドレスがあれば登録できます。物件を掲載するときだけ、本人確認書類（運転免許証など）のアップロードをお願いしています。',
    category: 'general',
  },
  {
    q: '対応エリアはどこですか？',
    a: 'いまは東京都・神奈川県を中心に提供しています。今後、首都圏全域へ広げていく予定です。',
    category: 'general',
  },
  {
    q: '相続登記が終わっていなくても掲載できますか？',
    a: 'はい。登記手続き中の物件は「公開（登記中）」という条件付きで掲載できます。ただし、2ヶ月以内の登記完了が必要です。',
    category: 'seller',
  },
  {
    q: '物件の審査はどのくらいで終わりますか？',
    a: '通常1〜3営業日で完了します。書類に不備があれば差し戻し、修正後に再審査となります。',
    category: 'seller',
  },
  {
    q: '入札期間は自分で決められますか？',
    a: 'はい、物件登録時にお決めいただけます。おすすめは7〜14日です。',
    category: 'seller',
  },
  {
    q: '最高額の入札者を選ばなくてもいいですか？',
    a: 'はい。金額だけでなく、取引条件なども見たうえで、自由に入札者を選んでいただけます。',
    category: 'seller',
  },
  {
    q: '入札した金額は、ほかの入札者に見えますか？',
    a: '見えません。入札額は売主だけに表示されます。入札の件数は公開されますが、それぞれの金額は非公開です。',
    category: 'buyer',
  },
  {
    q: '入札金額はあとから変更できますか？',
    a: 'はい。入札期間中なら、何度でも金額を更新できます。最新の金額が有効になります。',
    category: 'buyer',
  },
  {
    q: '入札をキャンセルできますか？',
    a: 'はい、入札期間中であればキャンセルできます。ただし、売主が入札者を選んだ後のキャンセルは、提携業者との契約条件にしたがいます。',
    category: 'buyer',
  },
  {
    q: '士業パートナーの登録条件を教えてください',
    a: '税理士・司法書士・弁護士・行政書士などの資格をお持ちの方が対象です。登録時に資格証明書のアップロードをお願いしています。',
    category: 'professional',
  },
  {
    q: '紹介料はいつ支払われますか？',
    a: '案件の決済が完了した翌月末までに、指定の銀行口座へお振り込みします。',
    category: 'professional',
  },
  {
    q: '紹介リンクに有効期限はありますか？',
    a: 'ありません。クライアントがリンクから登録した時点で、紹介関係が記録されます。',
    category: 'professional',
  },
  {
    q: '案件の割り当てはどう決まりますか？',
    a: 'エリア・過去の実績・対応できる物件種別などを見て、運営側で割り当てます。',
    category: 'broker',
  },
  {
    q: '掲載料や入札に費用はかかりますか？',
    a: 'かかりません。物件の掲載も入札の受付・参加もすべて無料です。費用が発生するのは成約時の仲介手数料だけです。',
    category: 'pricing',
  },
  {
    q: '仲介手数料はいくらですか？',
    a: '宅地建物取引業法の上限額です。売買価格が400万円を超える場合は「売買価格 × 3% + 6万円（税別）」となります。',
    category: 'pricing',
  },
  {
    q: '士業紹介料は売主の負担になりますか？',
    a: 'なりません。紹介料は仲介手数料の中から配分するので、売主・買い手への追加請求はありません。',
    category: 'pricing',
  },
  {
    q: '個人情報はどうやって守られていますか？',
    a: 'SSL/TLSによる暗号化通信、アクセス権限の管理、定期的なセキュリティ監査を行っています。詳しくはプライバシーポリシーをご覧ください。',
    category: 'security',
  },
  {
    q: '書類の閲覧権限は管理できますか？',
    a: 'はい。売主は、どの士業パートナーに書類を見せるかを、書類ごとに個別に設定できます。',
    category: 'security',
  },
]

export default function FaqPage() {
  const [category, setCategory] = useState<Category>('all')
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return FAQS.filter((f) => {
      const matchCategory = category === 'all' || f.category === category
      const matchQuery = query === '' || f.q.includes(query) || f.a.includes(query)
      return matchCategory && matchQuery
    })
  }, [category, query])

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      all: FAQS.length,
      general: 0,
      seller: 0,
      buyer: 0,
      professional: 0,
      broker: 0,
      pricing: 0,
      security: 0,
    }
    FAQS.forEach((f) => {
      counts[f.category] += 1
    })
    return counts
  }, [])

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
                FAQ
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                よくある質問
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[620px] font-medium">
                サービス・料金・登録方法など、よくいただく質問をまとめました。
                ここで解決しないときは、そのままお問い合わせください。
              </p>
            </div>

            {/* 検索フォーム */}
            <form
              className="mt-10 flex items-stretch gap-3 max-w-[680px]"
              onSubmit={(e) => {
                e.preventDefault()
                setQuery(queryInput.trim())
              }}
            >
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="キーワードで検索（例: 掲載料、入札、紹介料）"
                className="flex-1 px-5 py-3.5 text-[14px] bg-white border border-black/10 rounded-full focus:outline-none focus:border-sage-deep/40 transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-bark text-warm rounded-full text-[13px] font-semibold whitespace-nowrap transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
              >
                検索
              </button>
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQueryInput('')
                    setQuery('')
                  }}
                  className="text-[13px] text-bark-3 underline-offset-[4px] hover:underline decoration-bark-3/40 px-2"
                >
                  クリア
                </button>
              )}
            </form>
          </div>
        </section>

        {/* CATEGORIES + LIST */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-12 md:py-16 grid md:grid-cols-[240px_1fr] gap-10 md:gap-16">
            {/* 左: カテゴリ */}
            <aside className="md:sticky md:top-24 md:self-start">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-5">
                CATEGORY
              </div>
              <ul className="flex md:flex-col flex-wrap gap-2 md:gap-0 md:border-t md:border-black/8">
                {CATEGORIES.map((c) => {
                  const active = category === c.key
                  return (
                    <li key={c.key} className="md:border-b md:border-black/8">
                      <button
                        type="button"
                        onClick={() => setCategory(c.key)}
                        className={`w-full flex items-center justify-between gap-3 px-4 md:px-0 md:py-3.5 py-2 rounded-full md:rounded-none text-[13px] font-medium transition-colors ${
                          active
                            ? 'md:text-bark text-warm bg-bark md:bg-transparent'
                            : 'text-bark-3 md:hover:text-bark bg-white md:bg-transparent border md:border-0 border-black/8'
                        }`}
                      >
                        <span className={`${active ? 'md:font-bold' : ''}`}>
                          {c.label}
                        </span>
                        <span
                          className={`price text-[12px] ${
                            active ? 'md:text-sage-deep text-warm-2/70' : 'text-bark-4'
                          }`}
                        >
                          {categoryCounts[c.key]}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </aside>

            {/* 右: リスト */}
            <div>
              <div className="flex items-baseline justify-between mb-6">
                <p className="text-[13px] text-bark-3">
                  <span className="price text-bark font-bold text-[16px]">{filtered.length}</span>
                  <span className="ml-1">件の質問</span>
                  {query && (
                    <span className="ml-3 text-[12px] text-bark-4">
                      「{query}」の検索結果
                    </span>
                  )}
                </p>
              </div>

              {filtered.length === 0 ? (
                <div className="surface-card rounded-[14px] p-10 text-center">
                  <p className="text-[15px] text-bark-2 mb-2 font-medium">
                    該当する質問が見つかりませんでした
                  </p>
                  <p className="text-[13px] text-bark-3 leading-[1.8]">
                    キーワードを変えるか、カテゴリを「すべて」に戻してお試しください。
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-black/8 border-y border-black/8">
                  {filtered.map((f) => (
                    <details key={f.q} className="group">
                      <summary className="flex items-start justify-between gap-4 py-6 cursor-pointer list-none text-[17px] font-bold text-bark leading-[1.55] tracking-[-0.01em]">
                        <span>{f.q}</span>
                        <span
                          aria-hidden
                          className="shrink-0 text-sage-deep text-[20px] mt-0 transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="pb-6 text-[14px] text-bark-2 leading-[1.95] max-w-[720px]">
                        {f.a}
                      </p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-16 flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                STILL HAVE QUESTIONS?
              </div>
              <h2 className="text-bark font-bold text-[clamp(22px,2.6vw,30px)] tracking-[-0.025em] leading-[1.3]">
                解決しない場合は、お気軽にどうぞ
              </h2>
              <p className="text-bark-2 text-[14px] mt-3 max-w-[520px] leading-[1.85]">
                個別のご相談はお問い合わせフォームからどうぞ。通常2営業日以内にご返信します。
              </p>
            </div>
            <div className="flex items-center gap-5">
              <Link
                href="/help"
                className="text-[13px] text-bark-2 font-medium underline-offset-[6px] hover:underline decoration-sage-deep/40"
              >
                ヘルプセンター
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-bark text-warm rounded-full text-[13px] font-bold whitespace-nowrap transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
              >
                お問い合わせ
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
