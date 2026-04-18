'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[AppError]', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <header className="py-7">
        <div className="max-w-[1260px] mx-auto px-5 md:px-9">
          <Link href="/" className="inline-flex items-center gap-3 w-fit">
            <div className="w-8 h-8 bg-bark rounded-[8px] flex items-center justify-center">
              <span className="text-warm font-bold text-[13px]">O</span>
            </div>
            <span className="text-[14px] font-bold text-bark tracking-[-0.01em]">Ouver</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 md:px-9 pb-24">
        <div className="w-full max-w-[520px] text-center">
          <div className="flex items-center justify-center gap-3 mb-6 text-[11px] tracking-[0.32em] font-semibold text-sage-deep">
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
            ERROR
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
          </div>
          <h1 className="font-bold text-[clamp(30px,4vw,42px)] leading-[1.22] tracking-[-0.02em] text-bark mb-4 [word-break:keep-all]">
            うまく表示できませんでした
          </h1>
          <p className="text-[14px] text-bark-2 leading-[1.95] mb-10">
            一時的な問題が起きているようです。
            <br />
            少し時間をおいて、もう一度お試しください。
          </p>

          {error?.digest && (
            <div className="surface-card rounded-[12px] p-5 mb-10 text-left">
              <p className="text-[11px] tracking-[0.18em] font-semibold text-bark-4 uppercase mb-2">
                エラーコード
              </p>
              <p className="price text-[13px] text-bark font-bold break-all">
                {error.digest}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="px-7 py-3 bg-bark text-warm rounded-full text-[13px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px inline-flex items-center gap-2"
            >
              もう一度試す
              <span aria-hidden>↻</span>
            </button>
            <Link
              href="/"
              className="px-7 py-3 bg-white border border-black/10 text-bark rounded-full text-[13px] font-bold transition-colors hover:border-black/20"
            >
              トップへ戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
