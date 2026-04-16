'use client'

import {
  Building2,
  Search,
  Briefcase,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const roleCards = [
  {
    icon: Building2,
    role: '売主（相続人）',
    color: 'primary' as const,
    price: '無料',
    priceNote: '※ 成約時に仲介手数料が発生します',
    features: [
      '物件登録は無料',
      '入札の受付は無料',
      '成約時: 仲介手数料（売買価格×3%＋6万円（税別））',
      '士業紹介の場合、紹介料は仲介手数料から控除',
    ],
  },
  {
    icon: Search,
    role: '買い手',
    color: 'info' as const,
    price: '無料',
    priceNote: '※ 成約時に仲介手数料が発生します',
    features: [
      '物件の閲覧・検索は無料',
      '入札は無料',
      '成約時: 仲介手数料（売買価格×3%＋6万円（税別））',
      '入札のキャンセルも無料',
    ],
  },
  {
    icon: Briefcase,
    role: '士業パートナー',
    color: 'secondary' as const,
    price: '無料',
    priceNote: '※ 成約時に紹介料を受け取れます',
    features: [
      'パートナー登録は無料',
      '紹介リンクの発行は無料',
      '成約時: 仲介手数料の15%を紹介料として受領',
      'NW経由の場合: NW手数料3%が別途控除',
    ],
  },
]

const colorMap = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-500', border: 'border-primary-200' },
  info: { bg: 'bg-info-50', text: 'text-info-500', border: 'border-info-200' },
  secondary: { bg: 'bg-secondary-50', text: 'text-secondary-500', border: 'border-secondary-200' },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* ヒーロー */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold mb-2">料金について</h1>
            <p className="text-base text-neutral-500">
              掲載・入札は<span className="font-semibold text-cta-500">すべて無料</span>。費用が発生するのは成約時のみです。
            </p>
          </div>

          {/* ロール別料金カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {roleCards.map((card) => {
              const c = colorMap[card.color]
              return (
                <div key={card.role} className={`bg-white rounded-2xl shadow-card p-6 border ${c.border}`}>
                  <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <h2 className="text-sm font-semibold mb-1">{card.role}</h2>
                  <p className="text-2xl font-bold mb-0.5">{card.price}</p>
                  <p className="text-xs text-neutral-400 mb-4">{card.priceNote}</p>
                  <ul className="space-y-2">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-neutral-600">
                        <CheckCircle className="w-3.5 h-3.5 text-success-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* 手数料の計算例 */}
          <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <h2 className="text-lg font-semibold mb-4">手数料の計算例</h2>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2.5 px-2 text-xs text-neutral-400 font-medium">売買価格</th>
                    <th className="text-right py-2.5 px-2 text-xs text-neutral-400 font-medium">仲介手数料（税別）</th>
                    <th className="text-right py-2.5 px-2 text-xs text-neutral-400 font-medium">士業紹介料（15%）</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    { price: 2000, fee: 66, referral: 9.9 },
                    { price: 3000, fee: 96, referral: 14.4 },
                    { price: 5000, fee: 156, referral: 23.4 },
                    { price: 8000, fee: 246, referral: 36.9 },
                  ].map((row) => (
                    <tr key={row.price}>
                      <td className="py-3 px-2 price font-medium">{row.price.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                      <td className="py-3 px-2 price text-right">{row.fee.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                      <td className="py-3 px-2 price text-right">{row.referral.toFixed(1)}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-neutral-400 mt-3">※ 仲介手数料は片手仲介（売買価格×3%＋6万円）の場合。両手仲介の場合は2倍となります。</p>
          </section>

          {/* 従来との比較 */}
          <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <h2 className="text-lg font-semibold mb-4">従来の売却方法との比較</h2>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2.5 px-2 text-xs text-neutral-400 font-medium" />
                    <th className="text-center py-2.5 px-2 text-xs text-neutral-400 font-medium">Ouver</th>
                    <th className="text-center py-2.5 px-2 text-xs text-neutral-400 font-medium">一般的な仲介</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ['掲載費用', '無料', '無料〜有料'],
                    ['価格決定', '入札（市場価格）', '査定（業者提示）'],
                    ['売却期間', '入札期間＋手続き', '3〜6ヶ月が一般的'],
                    ['仲介手数料', '法定上限内', '法定上限内'],
                    ['士業サポート', '提携NWから紹介', '自分で探す'],
                    ['取引の透明性', '入札件数を公開', '非公開が多い'],
                  ].map(([label, ouver, general]) => (
                    <tr key={label}>
                      <td className="py-3 px-2 font-medium text-neutral-700">{label}</td>
                      <td className="py-3 px-2 text-center text-neutral-600">{ouver}</td>
                      <td className="py-3 px-2 text-center text-neutral-500">{general}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">料金に関するよくある質問</h2>
            <div className="space-y-3">
              {[
                { q: '本当に掲載料はかかりませんか？', a: 'はい。物件の掲載、入札の受付・参加はすべて無料です。費用が発生するのは成約時の仲介手数料のみです。' },
                { q: '入札を途中でキャンセルした場合、費用はかかりますか？', a: 'いいえ。入札期間中のキャンセルには一切費用はかかりません。' },
                { q: '士業紹介料は売主が負担しますか？', a: 'いいえ。紹介料は仲介手数料の中から配分されるため、売主に追加の負担はありません。' },
                { q: '仲介手数料の支払いタイミングは？', a: '決済完了時に、提携宅建業者を通じてお支払いいただきます。前払いは不要です。' },
              ].map((faq) => (
                <details key={faq.q} className="bg-white rounded-2xl shadow-card group">
                  <summary className="px-5 py-4 text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <ArrowRight className="w-4 h-4 text-neutral-300 transition-transform group-open:rotate-90 shrink-0 ml-3" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
            >
              無料で始める
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
