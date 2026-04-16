import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* ヘッダー（最小限） */}
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-sm font-semibold text-foreground">相続不動産マッチング</span>
          </Link>
        </div>
      </header>

      {/* メイン */}
      <main className="flex-1 flex items-center justify-center px-4 pb-24">
        <div className="text-center max-w-md">
          {/* 404を家のモチーフで表現 */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-neutral-100 rounded-2xl mb-6">
              <Home className="w-10 h-10 text-neutral-300" strokeWidth={1.5} />
            </div>
            <p className="price text-6xl text-neutral-200 mb-3">404</p>
            <h1 className="text-xl font-bold text-foreground">
              この物件は見つかりませんでした
            </h1>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
              お探しのページは移動または削除された可能性があります。<br />
              URLをご確認いただくか、物件一覧からお探しください。
            </p>
          </div>

          {/* アクション */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              トップに戻る
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-500 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <Search className="w-4 h-4" />
              物件を探す
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
