'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

type CategoryKey =
  | 'getting-started'
  | 'listing'
  | 'bidding'
  | 'transactions'
  | 'documents'
  | 'payment'

type Category = {
  key: CategoryKey
  label: string
  lead: string
  topics: string[]
  mark: MarkKey
}

type MarkKey = 'book' | 'house' | 'gavel' | 'doc' | 'coin' | 'handshake'

type Article = {
  title: string
  summary: string
  category: CategoryKey
  minutes: number
  slug: string
}

const CATEGORIES: Category[] = [
  {
    key: 'getting-started',
    label: 'はじめに',
    lead: '登録してから、物件を掲載するまで。',
    topics: ['登録方法', '本人確認', 'プロフィール設定'],
    mark: 'book',
  },
  {
    key: 'listing',
    label: '物件掲載',
    lead: '物件を載せる流れと、差戻しになったときの対応。',
    topics: ['物件の登録', '写真・書類の追加', '審査・差戻し'],
    mark: 'house',
  },
  {
    key: 'bidding',
    label: '入札',
    lead: '入札のやり方、金額の変更、キャンセル。',
    topics: ['入札の仕方', '金額の更新', '入札のキャンセル'],
    mark: 'gavel',
  },
  {
    key: 'transactions',
    label: '案件・取引',
    lead: '入札が終わったあと、契約から決済までの流れ。',
    topics: ['案件の進捗', '契約・重説', '決済の流れ'],
    mark: 'handshake',
  },
  {
    key: 'documents',
    label: '書類',
    lead: '書類の提出と、だれに見せるかの設定。',
    topics: ['書類の提出', '閲覧許可', 'ダウンロード'],
    mark: 'doc',
  },
  {
    key: 'payment',
    label: '料金・手数料',
    lead: '掲載は無料です。成約したときの仲介手数料と、その配分について。',
    topics: ['仲介手数料', '配分の内訳', '紹介料の仕組み'],
    mark: 'coin',
  },
]

const ARTICLES: Article[] = [
  {
    title: 'アカウントの登録方法',
    summary: 'メールアドレスだけで登録できます。本人確認は、物件を掲載するときにお願いしています。',
    category: 'getting-started',
    minutes: 3,
    slug: 'how-to-register',
  },
  {
    title: '物件を掲載するまでの流れ',
    summary: '物件情報と写真・書類をご登録いただくと、1〜3営業日で審査が終わります。',
    category: 'listing',
    minutes: 5,
    slug: 'how-to-list-property',
  },
  {
    title: '入札の仕組み',
    summary: '複数の買い手から、金額と条件が届きます。いちばん高い入札を選ばなくても大丈夫です。',
    category: 'bidding',
    minutes: 4,
    slug: 'bidding-process',
  },
  {
    title: '仲介手数料の計算',
    summary: '法定の上限は「売買価格 × 3% + 6万円（税別）」です。この範囲の中で、関係者に配分します。',
    category: 'payment',
    minutes: 4,
    slug: 'commission-calculation',
  },
  {
    title: '士業パートナーの紹介料',
    summary: '士業からのご紹介には、仲介手数料の中から15%をお支払いしています。別にいただく費用はありません。',
    category: 'payment',
    minutes: 3,
    slug: 'referral-fee',
  },
  {
    title: '書類の閲覧許可',
    summary: '入札者ごとに、どの書類までお見せするかを選べます。',
    category: 'documents',
    minutes: 3,
    slug: 'document-permissions',
  },
  {
    title: '審査で差戻しになったとき',
    summary: '直していただきたい点をお伝えします。修正して再提出いただければ、もう一度審査します。',
    category: 'listing',
    minutes: 3,
    slug: 'how-to-handle-rejection',
  },
  {
    title: '相続登記が終わっていないとき',
    summary: '「公開（登記中）」として、条件付きで掲載できます。2ヶ月以内に登記が済んでいることが条件です。',
    category: 'listing',
    minutes: 4,
    slug: 'pending-registration',
  },
]

function Mark({ kind }: { kind: MarkKey }) {
  const stroke = 'stroke-sage-deep/80'
  const common = `w-5 h-5 ${stroke}`
  switch (kind) {
    case 'book':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={common} aria-hidden>
          <path d="M4 5.5C4 4.7 4.6 4 5.4 4H11v15H5.4A1.4 1.4 0 0 1 4 17.6V5.5Z" />
          <path d="M20 5.5c0-.8-.6-1.5-1.4-1.5H13v15h5.6a1.4 1.4 0 0 0 1.4-1.4V5.5Z" />
        </svg>
      )
    case 'house':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={common} aria-hidden>
          <path d="M4 11 12 5l8 6v8.5A.5.5 0 0 1 19.5 20H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5V11Z" />
        </svg>
      )
    case 'gavel':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={common} aria-hidden>
          <path d="m7 14 7-7M11 3l6 6M14 6l4 4M5 20h10" />
          <path d="m9 16 3-3" />
        </svg>
      )
    case 'doc':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={common} aria-hidden>
          <path d="M7 3h8l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
          <path d="M14 3v5h5M9 13h7M9 17h5" />
        </svg>
      )
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={common} aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M9.5 10.5c0-1 1-1.8 2.5-1.8s2.5.8 2.5 1.8-1 1.6-2.5 1.8-2.5.8-2.5 1.8 1 1.8 2.5 1.8 2.5-.8 2.5-1.8" />
        </svg>
      )
    case 'handshake':
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={common} aria-hidden>
          <path d="m3 12 3-3 4 4-3 3a1.4 1.4 0 0 1-2 0l-2-2a1.4 1.4 0 0 1 0-2Z" />
          <path d="m21 12-3-3-4 4 3 3a1.4 1.4 0 0 0 2 0l2-2a1.4 1.4 0 0 0 0-2Z" />
          <path d="m10 13 2 2 2-2 2 2" />
        </svg>
      )
  }
}

export default function HelpPage() {
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        CATEGORIES.find((c) => c.key === a.category)?.label.toLowerCase().includes(q),
    )
  }, [query])

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
                HELP CENTER
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                よくあるご質問と、
                <br />
                使い方のご案内。
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[640px] font-medium">
                お問い合わせの多い内容をまとめました。
                記事で解決しないときは、そのままサポートまでご連絡ください。
              </p>
            </div>

            {/* 検索 */}
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
                placeholder="キーワードで検索（例: 登録、入札、手数料）"
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

        {/* 検索結果 */}
        {query && (
          <section className="border-t border-black/5">
            <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-12 md:py-16">
              <div className="flex items-baseline justify-between mb-6">
                <div className="flex items-baseline gap-3">
                  <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                    SEARCH
                  </div>
                  <p className="text-[13px] text-bark-3">
                    <span className="price text-bark font-bold text-[16px]">{filtered.length}</span>
                    <span className="ml-1">件の記事</span>
                    <span className="ml-3 text-[12px] text-bark-4">「{query}」</span>
                  </p>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="surface-card rounded-[14px] p-10 text-center">
                  <p className="text-[15px] text-bark-2 mb-2 font-medium">
                    該当する記事が見つかりませんでした
                  </p>
                  <p className="text-[13px] text-bark-3 leading-[1.8]">
                    言葉を変えて検索するか、下のカテゴリから探してみてください。
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-black/8 border-y border-black/8">
                  {filtered.map((a) => {
                    const cat = CATEGORIES.find((c) => c.key === a.category)
                    return (
                      <li key={a.slug}>
                        <Link
                          href={`/help/${a.slug}`}
                          className="grid md:grid-cols-[160px_1fr_auto] gap-4 md:gap-8 py-6 group"
                        >
                          <span className="text-[11px] tracking-[0.24em] font-semibold text-sage-deep self-start pt-1">
                            {cat?.label}
                          </span>
                          <div>
                            <h3 className="text-[17px] font-bold text-bark leading-[1.55] tracking-[-0.01em] mb-1 group-hover:text-sage-deep transition-colors">
                              {a.title}
                            </h3>
                            <p className="text-[14px] text-bark-2 leading-[1.9] max-w-[680px]">
                              {a.summary}
                            </p>
                          </div>
                          <span className="self-start pt-1 text-[12px] text-bark-4 price whitespace-nowrap">
                            {a.minutes} min
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* STATEMENT STRIP */}
        {!query && (
          <section
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'var(--color-bark)',
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '22px 22px',
            }}
          >
            <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
              <div className="max-w-[820px]">
                <div className="flex items-center gap-3 mb-6 text-[12px] tracking-[0.32em] font-semibold text-sage-light/80">
                  <span aria-hidden className="block w-8 h-px bg-sage-light/50" />
                  OUR APPROACH
                </div>
                <p className="text-[clamp(22px,2.6vw,30px)] leading-[1.6] tracking-[-0.01em] text-warm font-medium [word-break:keep-all]">
                  相続のお手続きは、はじめての方がほとんどです。
                  だからこそ、売主・買い手・士業のそれぞれに、
                  <span className="text-sage-light font-bold">必要なところだけ</span>
                  を短くまとめました。
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CATEGORIES */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="flex items-end justify-between mb-10 md:mb-14 gap-8 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-5 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                  <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                  CATEGORIES
                </div>
                <h2 className="font-bold text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-0.02em] text-bark [word-break:keep-all]">
                  用途から探す
                </h2>
              </div>
              <p className="text-[13px] text-bark-3 max-w-[320px] leading-[1.9]">
                やりたいことから、記事を探せます。はじめての方は「はじめに」からどうぞ。
              </p>
            </div>

            <ul className="grid md:grid-cols-2 gap-px bg-black/8 border border-black/8 rounded-[12px] overflow-hidden">
              {CATEGORIES.map((c) => (
                <li key={c.key} className="bg-warm">
                  <Link
                    href={`/help/${c.key}`}
                    className="group flex items-start gap-5 p-7 md:p-9 h-full transition-colors hover:bg-sage-xlight/50"
                  >
                    <span className="shrink-0 w-10 h-10 rounded-[10px] bg-sage-xlight flex items-center justify-center mt-1">
                      <Mark kind={c.mark} />
                    </span>
                    <div className="flex-1">
                      <h3 className="text-[19px] font-bold text-bark leading-[1.4] tracking-[-0.01em] mb-2 group-hover:text-sage-deep transition-colors">
                        {c.label}
                      </h3>
                      <p className="text-[14px] text-bark-2 leading-[1.9] mb-4">{c.lead}</p>
                      <ul className="flex flex-wrap gap-2">
                        {c.topics.map((t) => (
                          <li
                            key={t}
                            className="text-[12px] text-bark-3 px-2.5 py-1 rounded-full border border-black/10"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span
                      aria-hidden
                      className="shrink-0 text-sage-deep/70 text-[18px] group-hover:translate-x-1 transition-transform"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* POPULAR ARTICLES */}
        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-20">
            <div>
              <div className="flex items-center gap-3 mb-5 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                POPULAR
              </div>
              <h2 className="font-bold text-[clamp(28px,3.6vw,40px)] leading-[1.2] tracking-[-0.02em] text-bark mb-6 [word-break:keep-all]">
                よく見られている記事
              </h2>
              <p className="text-[14px] text-bark-2 leading-[1.95] max-w-[380px]">
                お問い合わせの多い内容から、順に並べています。
              </p>
            </div>

            <ul className="divide-y divide-black/8 border-y border-black/8">
              {ARTICLES.slice(0, 6).map((a, i) => {
                const cat = CATEGORIES.find((c) => c.key === a.category)
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/help/${a.slug}`}
                      className="grid grid-cols-[48px_1fr_auto] gap-4 py-5 group items-start"
                    >
                      <span className="price text-[13px] text-bark-4 pt-1">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="text-[11px] tracking-[0.24em] font-semibold text-sage-deep mb-1.5">
                          {cat?.label}
                        </div>
                        <h3 className="text-[16px] font-bold text-bark leading-[1.55] tracking-[-0.01em] mb-1 group-hover:text-sage-deep transition-colors">
                          {a.title}
                        </h3>
                        <p className="text-[13px] text-bark-2 leading-[1.85] max-w-[540px]">
                          {a.summary}
                        </p>
                      </div>
                      <span className="price text-[11px] text-bark-4 self-start pt-1.5 whitespace-nowrap">
                        {a.minutes} min
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* RELATED */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="flex items-center gap-3 mb-10 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
              <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
              RELATED
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  href: '/faq',
                  eyebrow: 'FAQ',
                  title: 'よくある質問',
                  body: '料金・登録・書類など、短くお答えできる質問を集めました。',
                },
                {
                  href: '/guide',
                  eyebrow: 'GUIDE',
                  title: '使い方ガイド',
                  body: '売主・買い手・士業それぞれの使い方を、順を追ってご案内します。',
                },
                {
                  href: '/escrow',
                  eyebrow: 'ESCROW',
                  title: '取引の安全について',
                  body: '書類の扱い方、決済のしくみ、士業がどう関わるか。',
                },
              ].map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="surface-card rounded-[14px] p-7 group transition-[transform,box-shadow] hover:-translate-y-0.5"
                >
                  <div className="text-[11px] tracking-[0.28em] font-semibold text-sage-deep mb-4">
                    {r.eyebrow}
                  </div>
                  <h3 className="text-[18px] font-bold text-bark leading-[1.4] tracking-[-0.01em] mb-3 group-hover:text-sage-deep transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-[13px] text-bark-2 leading-[1.9] mb-5">{r.body}</p>
                  <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-sage-deep">
                    <span>詳しく見る</span>
                    <span aria-hidden className="group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="relative overflow-hidden">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16 items-stretch">
              <div className="surface-card rounded-[16px] p-10 md:p-14 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-5 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                  <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                  CONTACT
                </div>
                <h2 className="font-bold text-[clamp(26px,3.2vw,36px)] leading-[1.25] tracking-[-0.02em] text-bark mb-5 [word-break:keep-all]">
                  記事で解決しないときは、
                  <br />
                  お気軽にご連絡ください。
                </h2>
                <p className="text-[14px] text-bark-2 leading-[1.95] mb-8 max-w-[480px]">
                  相続や書類のことで迷われている方も、どうぞお問い合わせください。
                  担当者がお話をうかがいます。
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-bark text-warm text-[13px] font-semibold hover:opacity-90 hover:-translate-y-px transition-[transform,opacity]"
                  >
                    <span>お問い合わせフォーム</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href="mailto:support@ouver.jp"
                    className="text-[13px] font-semibold text-sage-deep underline-offset-[6px] hover:underline decoration-sage-deep/40"
                  >
                    support@ouver.jp
                  </a>
                </div>
              </div>

              <div className="relative rounded-[16px] overflow-hidden min-h-[260px]">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(46,56,48,0.55) 0%, rgba(46,56,48,0.2) 60%, rgba(46,56,48,0) 100%)',
                  }}
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="text-[13px] tracking-[0.24em] font-semibold text-warm/80 mb-2">
                    SUPPORT HOURS
                  </p>
                  <p className="text-warm text-[16px] font-bold leading-[1.6]">
                    平日 10:00 – 18:00
                    <br />
                    （土日祝を除く）
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
