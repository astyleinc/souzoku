import Link from 'next/link'

export default function NotFound() {
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
            NOT FOUND
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
          </div>

          <p className="price text-[clamp(84px,14vw,128px)] font-bold tracking-[-0.04em] leading-none text-sage-deep/25 mb-6">
            404
          </p>

          <h1 className="font-bold text-[clamp(26px,3.2vw,34px)] leading-[1.25] tracking-[-0.02em] text-bark mb-4 [word-break:keep-all]">
            お探しのページが
            <br />
            見つかりませんでした
          </h1>
          <p className="text-[14px] text-bark-2 leading-[1.95] mb-10">
            ページが移動されたか、URLが変更されている可能性があります。
            <br />
            トップページから、あらためてお探しください。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-7 py-3 bg-bark text-warm rounded-full text-[13px] font-bold tracking-[0.01em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px inline-flex items-center gap-2"
            >
              <span aria-hidden>←</span>
              トップへ戻る
            </Link>
            <Link
              href="/properties"
              className="px-7 py-3 bg-white border border-black/10 text-bark rounded-full text-[13px] font-bold transition-colors hover:border-black/20"
            >
              物件をさがす
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
