'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 本番ではエラー監視サービスに送信する想定
    // 開発環境ではコンソールに出力
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[AppError]', error)
    }
  }, [error])

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
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-error-50 rounded-2xl mb-6">
              <Home className="w-10 h-10 text-error-300" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              問題が発生しました
            </h1>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
              一時的なエラーが発生しました。<br />
              しばらく経ってからもう一度お試しください。
            </p>
          </div>

          {/* アクション */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              もう一度試す
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-500 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
