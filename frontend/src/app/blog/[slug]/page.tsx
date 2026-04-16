import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function BlogArticlePage() {
  const article = {
    title: '相続不動産の税金、基礎から解説',
    category: '相続コラム',
    date: '2026年4月12日',
    readTime: '5分',
    author: 'Ouver編集部',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
            <ArrowLeft className="w-4 h-4" />
            記事一覧に戻る
          </Link>

          {/* 記事ヘッダー */}
          <div className="mb-8">
            <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-secondary-50 text-secondary-700 rounded-full mb-3">
              {article.category}
            </span>
            <h1 className="text-2xl font-bold mb-3">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                読了時間 {article.readTime}
              </span>
            </div>
          </div>

          {/* サムネイル */}
          <div className="h-56 bg-neutral-100 rounded-2xl flex items-center justify-center mb-8">
            <span className="text-sm text-neutral-400">記事画像</span>
          </div>

          {/* 本文 */}
          <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <div className="prose prose-sm max-w-none text-neutral-600 leading-relaxed space-y-4">
              <p>
                相続をきっかけに不動産を取得した場合、さまざまな税金が発生します。この記事では、相続不動産に関する税金の基礎知識と、活用できる控除制度について解説します。
              </p>

              <h2 className="text-base font-semibold text-foreground mt-6 mb-2">1. 相続税</h2>
              <p>
                相続で取得した財産の総額が基礎控除額（3,000万円＋600万円×法定相続人数）を超える場合、相続税が課税されます。不動産の場合、相続税評価額は路線価方式または倍率方式で算出されます。
              </p>

              <h2 className="text-base font-semibold text-foreground mt-6 mb-2">2. 譲渡所得税</h2>
              <p>
                相続した不動産を売却する場合、譲渡所得に対して所得税・住民税が課税されます。取得費は被相続人の取得費を引き継ぎますが、相続税額の取得費加算の特例が適用できる場合があります。
              </p>

              <h2 className="text-base font-semibold text-foreground mt-6 mb-2">3. 活用できる特例・控除</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>小規模宅地等の特例（最大80%評価減）</li>
                <li>相続税の取得費加算の特例</li>
                <li>空き家の3,000万円特別控除</li>
                <li>居住用財産の3,000万円特別控除</li>
              </ul>

              <h2 className="text-base font-semibold text-foreground mt-6 mb-2">まとめ</h2>
              <p>
                相続不動産の売却には複数の税制が絡み合います。適用できる特例を見逃さないためにも、税理士など専門家への相談をお勧めします。Ouverでは士業パートナーのネットワークを通じて、税務相談のサポートも行っています。
              </p>
            </div>
          </div>

          {/* 著者カード */}
          <div className="bg-white rounded-2xl shadow-card p-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{article.author}</p>
                <p className="text-xs text-neutral-400">相続不動産に関する情報をわかりやすくお届けします。</p>
              </div>
            </div>
          </div>

          {/* 関連記事 */}
          <section className="mb-8">
            <h2 className="text-base font-semibold mb-4">関連する記事</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: '相続登記が未完了でも掲載OK。条件付き掲載の仕組み', slug: 'registration-free-guide', category: '相続コラム' },
                { title: '練馬区のマンションが入札開始2週間で成約', slug: 'nerima-apartment-case', category: '活用事例' },
              ].map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="bg-white rounded-2xl shadow-card p-4 hover:shadow-md transition-shadow group"
                >
                  <span className="text-xs text-neutral-400">{related.category}</span>
                  <p className="text-sm font-medium mt-1 group-hover:text-primary-500 transition-colors">
                    {related.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* 登録CTA */}
          <div className="text-center p-6 bg-white rounded-2xl shadow-card">
            <p className="text-sm font-medium mb-1">相続不動産の売却をお考えですか？</p>
            <p className="text-xs text-neutral-400 mb-4">掲載は無料。入札方式で適正価格を実現します。</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
            >
              無料で登録する
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
