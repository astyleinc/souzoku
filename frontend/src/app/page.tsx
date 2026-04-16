import Link from 'next/link'
import {
  Gavel,
  Shield,
  Clock,
  UserCheck,
  FileText,
  Handshake,
  ArrowRight,
  ChevronRight,
  CheckCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/property/PropertyCard'
import { mockProperties } from '@/data/mock'

export default function HomePage() {
  const featuredProperties = mockProperties
    .filter((p) => p.status === 'bidding')
    .slice(0, 4)

  return (
    <>
      <Header />

      <main>
        {/* ヒーロー — グラデーションではなく、左テキスト＋右に具体的な数字で信頼感 */}
        <section className="bg-primary-600 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 lg:py-24">
              <div className="flex flex-col justify-center">
                <p className="text-primary-200 text-sm font-medium tracking-wide mb-3">
                  相続不動産の入札売却プラットフォーム
                </p>
                <h1 className="text-[2.5rem] leading-[1.15] font-bold">
                  相続した不動産、
                  <br />
                  買い叩かれていませんか？
                </h1>
                <p className="mt-5 text-primary-100 leading-relaxed max-w-lg">
                  本サービスは複数の買い手による入札で価格が決まる仕組みです。
                  一般的な買取業者の提示額（市場価格の50〜70%）ではなく、
                  競争原理で適正価格での売却を実現します。
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center px-6 py-3 text-base font-medium bg-cta-500 text-white rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all"
                  >
                    無料で物件を掲載する
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <Link
                    href="/properties"
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-primary-100 hover:text-white transition-colors"
                  >
                    入札中の物件を見る
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 右側: 具体的な実績数字（汎用イラストではなく事実で語る） */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-sm">
                  <p className="text-sm text-primary-200 mb-6">直近の実績</p>
                  <div className="space-y-5">
                    <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                      <span className="text-sm text-primary-100">平均売却日数</span>
                      <span className="price text-[2rem] text-white">21<span className="text-sm font-normal text-primary-200 ml-1">日</span></span>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                      <span className="text-sm text-primary-100">平均入札数/物件</span>
                      <span className="price text-[2rem] text-white">4.2<span className="text-sm font-normal text-primary-200 ml-1">件</span></span>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                      <span className="text-sm text-primary-100">希望価格達成率</span>
                      <span className="price text-[2rem] text-white">92<span className="text-sm font-normal text-primary-200 ml-1">%</span></span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-primary-100">掲載中の物件</span>
                      <span className="price text-[2rem] text-white">29<span className="text-sm font-normal text-primary-200 ml-1">件</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 課題提起 — 3カラム均等ではなく、左に大きなメッセージ＋右にチェックリスト */}
        <section className="bg-white py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
              <div className="lg:col-span-2">
                <p className="text-sm font-medium text-secondary-600 mb-2">相続不動産の売却で</p>
                <h2 className="text-2xl font-bold text-foreground leading-snug">
                  こんなことで
                  <br />
                  困っていませんか？
                </h2>
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {[
                    '不動産の適正価格がわからない',
                    '相続登記がまだ終わっていない',
                    '相続税の申告期限（10ヶ月）が迫っている',
                    '買取業者に市場価格の半額を提示された',
                    '兄弟で意見が割れていて進まない',
                    '税理士に相談したいが知り合いがいない',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* サービスの仕組み — 均等3カラムではなく、大きな1つ＋小さな2つのレイアウト */}
        <section id="features" className="bg-neutral-50 py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-secondary-600 mb-2">サービスの仕組み</p>
            <h2 className="text-2xl font-bold text-foreground mb-10">
              入札 × 士業連携で、相続不動産の売却を変える
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* メイン特長: 大きく */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cta-50 flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-cta-600" />
                  </div>
                  <h3 className="text-lg font-semibold">入札方式で売主が価格の主導権を持つ</h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  従来の不動産売却では、仲介業者の査定額をベースに価格が決まります。
                  当サービスでは売主が希望価格を設定し、複数の買い手が入札。
                  競争原理で価格が上がるので、買い叩かれることがありません。
                </p>
                <div className="bg-neutral-50 rounded-xl p-5">
                  <p className="text-xs text-neutral-400 mb-3">例: 1,500万円の物件の場合</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-400">一般的な買取業者</p>
                      <p className="price text-lg text-error-700 line-through">750〜1,050万円</p>
                      <p className="text-xs text-neutral-400">（市場価格の50〜70%）</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">当サービスの入札方式</p>
                      <p className="price text-lg text-success-700">1,380〜1,650万円</p>
                      <p className="text-xs text-neutral-400">（市場価格の92%〜110%）</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* サブ特長: 縦2つ */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-base font-semibold">士業が入口だから安心</h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    税理士・司法書士からの紹介で始まるので、
                    相続登記や税申告も並行して進められます。
                    「売却だけ」じゃない、ワンストップの安心感。
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-secondary-600" />
                    </div>
                    <h3 className="text-base font-semibold">平均21日で売却完了</h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    通常の仲介では3〜6ヶ月かかる売却が、
                    入札期限を設定することで短期間に決着。
                    相続税申告の10ヶ月期限にも間に合います。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 入札中の物件 */}
        <section className="bg-white py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-medium text-cta-600 mb-1">現在入札受付中</p>
                <h2 className="text-2xl font-bold text-foreground">
                  {featuredProperties.length}件の物件に入札できます
                </h2>
              </div>
              <Link
                href="/properties?status=bidding"
                className="hidden sm:inline-flex items-center text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                すべての物件を見る
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/properties?status=bidding"
                className="inline-flex items-center text-sm text-primary-500 font-medium"
              >
                すべての物件を見る
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ご利用の流れ — 均等4カラムではなく、番号付きの縦ステップ（大画面では交互レイアウト） */}
        <section id="how-it-works" className="bg-neutral-50 py-14 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-secondary-600 mb-2">ご利用の流れ</p>
            <h2 className="text-2xl font-bold text-foreground mb-10">
              4ステップで売却完了
            </h2>

            <div className="space-y-0">
              {[
                {
                  step: '1',
                  icon: UserCheck,
                  title: '物件情報を登録する',
                  description: '所在地・面積・希望価格を入力。士業の紹介リンクから来た場合は、紹介者が自動で紐づきます。所要時間は約5分。',
                },
                {
                  step: '2',
                  icon: FileText,
                  title: '必要書類をアップロード',
                  description: '登記簿謄本・本人確認書類をアップロード。相続登記が未了でも「登記手続き中」として出品できます。運営が書類の過不足を確認し、揃っていれば公開。',
                },
                {
                  step: '3',
                  icon: Gavel,
                  title: '買い手が入札',
                  description: '希望価格以上の金額で買い手が入札します。入札内容は他の買い手には見えない「sealed bid」方式。即決価格を設定すれば、到達時点で即成約も可能です。',
                },
                {
                  step: '4',
                  icon: Handshake,
                  title: '成約・決済',
                  description: '入札終了後、売主が入札者を選択。提携宅建業者が重要事項説明から契約・決済まで仲介実務を担当します。営業電話は一切ありません。',
                },
              ].map((item, i) => (
                <div key={item.step} className="flex gap-5">
                  {/* 左: 番号とライン */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">{item.step}</span>
                    </div>
                    {i < 3 && <div className="w-px flex-1 bg-primary-200 my-2" />}
                  </div>
                  {/* 右: コンテンツ */}
                  <div className="pb-10">
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed max-w-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — ベタ塗りではなく、ボーダー+余白で軽くする */}
        <section className="bg-white py-14 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-2 border-primary-200 rounded-2xl p-8 lg:p-12 text-center">
              <h2 className="text-2xl font-bold text-foreground">
                まずは物件情報を登録してみませんか？
              </h2>
              <p className="mt-3 text-sm text-neutral-400 max-w-md mx-auto">
                登録は無料です。入札がなければ費用は一切かかりません。
                掲載前に担当者が書類を確認するので、安心して始められます。
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-3 text-base font-medium bg-cta-500 text-white rounded-xl hover:bg-cta-600 transition-colors"
                >
                  無料で物件を掲載する
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <p className="mt-4 text-xs text-neutral-400">
                士業の方は
                <Link href="/register?role=professional" className="text-primary-500 hover:underline mx-1">
                  パートナー登録
                </Link>
                からどうぞ
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
