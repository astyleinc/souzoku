import {
  Quote,
  ArrowRight,
  Building2,
  Clock,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const stats = [
  { label: '成約件数', value: '150', unit: '件以上' },
  { label: '平均売却期間', value: '3.2', unit: '週間' },
  { label: '利用者満足度', value: '94', unit: '%' },
]

const stories = [
  {
    quote: '相続した実家の処分に悩んでいましたが、入札方式のおかげで想定以上の価格で売却できました。士業の先生にも相談できて安心でした。',
    name: 'A.S.さん（50代）',
    type: '一戸建て（東京都練馬区）',
    result: '入札開始から2週間で成約。査定額より約15%高い価格で売却。',
  },
  {
    quote: '遠方の土地を相続し、管理に困っていました。Ouverに掲載したところ、複数の不動産会社から入札があり、スムーズに売却できました。',
    name: 'K.T.さん（40代）',
    type: '土地（神奈川県横浜市）',
    result: '3社から入札。入札期間終了後、条件の良い買い手を選択。',
  },
  {
    quote: '相続人が複数いて意見がまとまらなかったのですが、入札結果という客観的な数字があったことで、スムーズに合意できました。',
    name: 'M.H.さん（60代）',
    type: 'マンション（東京都世田谷区）',
    result: '5社から入札。相続人間の合意形成にも役立った。',
  },
]

const professionalVoices = [
  {
    quote: '相続相談を受けた際に、不動産の売却先を紹介できるのは非常にありがたい。クライアントへのサービス向上につながっています。',
    name: '税理士 Y.M.先生',
  },
  {
    quote: '紹介リンクを共有するだけで、あとはプラットフォームが対応してくれる。手間なく紹介料も受け取れるので、積極的に活用しています。',
    name: '司法書士 S.K.先生',
  },
]

export default function StoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">成功事例・ご利用者の声</h1>
          <p className="text-sm text-neutral-400 mb-8">
            Ouverで相続不動産を売却された方の声をご紹介します。
          </p>

          {/* 数値バー */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl shadow-card p-5 text-center">
                <p className="price text-2xl font-bold text-primary-500">
                  {stat.value}<span className="text-sm font-normal text-neutral-400 ml-0.5">{stat.unit}</span>
                </p>
                <p className="text-xs text-neutral-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* 売主事例 */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">売主の声</h2>
            <div className="space-y-4">
              {stories.map((story) => (
                <div key={story.name} className="bg-white rounded-2xl shadow-card p-6">
                  <Quote className="w-5 h-5 text-neutral-200 mb-3" />
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    {story.quote}
                  </p>
                  <div className="flex items-start justify-between gap-4 pt-3 border-t border-neutral-100">
                    <div>
                      <p className="text-sm font-medium">{story.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {story.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-success-600 font-medium">{story.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 士業パートナーの声 */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">士業パートナーの声</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {professionalVoices.map((voice) => (
                <div key={voice.name} className="bg-white rounded-2xl shadow-card p-5">
                  <Quote className="w-4 h-4 text-neutral-200 mb-2" />
                  <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                    {voice.quote}
                  </p>
                  <p className="text-xs font-medium text-secondary-600">{voice.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 免責 */}
          <p className="text-xs text-neutral-400 text-center mb-8">
            ※ サービス開始前のイメージです。実際のご利用者の声は、サービス開始後に随時掲載予定です。
          </p>

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
