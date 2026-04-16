import {
  Building2,
  Users,
  Handshake,
  ArrowRight,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">会社概要</h1>
          <p className="text-sm text-neutral-400 mb-10">
            相続不動産の売却を、もっと透明で効率的に。
          </p>

          {/* ミッション */}
          <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <h2 className="text-lg font-semibold mb-3">私たちのミッション</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              相続をきっかけに不動産の売却を検討される方は、時間的・心理的な負担を抱えながら、不慣れな不動産取引に向き合うことになります。Ouverは、入札方式による透明な価格形成と、士業ネットワークを活かした信頼性の高いマッチングで、相続不動産の売却をサポートします。
            </p>
          </section>

          {/* なぜ相続不動産か */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">なぜ相続不動産に特化するのか</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">増加する空き家問題</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  高齢化に伴い相続不動産は年々増加。早期売却が社会課題の解決にもつながります。
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-secondary-500" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">専門家の力が必要</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  登記、税務、遺産分割。相続不動産の売却には士業の支援が不可欠です。
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="w-10 h-10 bg-info-50 rounded-xl flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-info-500" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">透明性への期待</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  入札方式で適正価格を実現。売主も買い手も納得できる公平な取引を提供します。
                </p>
              </div>
            </div>
          </section>

          {/* 会社情報 */}
          <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <h2 className="text-lg font-semibold mb-4">会社情報</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-neutral-100">
                {[
                  ['会社名', '株式会社Ouver'],
                  ['設立', '2025年'],
                  ['代表者', '代表取締役 ○○ ○○'],
                  ['所在地', '東京都○○区○○ ○丁目○番○号'],
                  ['事業内容', '相続不動産マッチングプラットフォームの企画・開発・運営'],
                  ['URL', 'https://ouver.jp'],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <th className="py-3 pr-6 text-left text-neutral-500 font-medium align-top whitespace-nowrap w-32">
                      {label}
                    </th>
                    <td className="py-3 text-neutral-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* ネットワーク */}
          <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Handshake className="w-5 h-5 text-secondary-500" />
              <h2 className="text-lg font-semibold">提携ネットワーク</h2>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="price text-2xl font-bold text-primary-500">50<span className="text-sm font-normal text-neutral-400">名以上</span></p>
                <p className="text-xs text-neutral-400 mt-1">士業パートナー</p>
              </div>
              <div>
                <p className="price text-2xl font-bold text-primary-500">30<span className="text-sm font-normal text-neutral-400">社以上</span></p>
                <p className="text-xs text-neutral-400 mt-1">提携宅建業者</p>
              </div>
              <div>
                <p className="price text-2xl font-bold text-primary-500">5<span className="text-sm font-normal text-neutral-400">団体</span></p>
                <p className="text-xs text-neutral-400 mt-1">士業NW</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-4 text-center">※ 目標数値を含みます</p>
          </section>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
            >
              無料で登録する
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
