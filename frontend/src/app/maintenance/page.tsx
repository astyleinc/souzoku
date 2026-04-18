import Link from 'next/link'

export default function MaintenancePage() {
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
            MAINTENANCE
            <span aria-hidden className="block w-6 h-px bg-sage-deep/50" />
          </div>
          <h1 className="font-bold text-[clamp(30px,4vw,42px)] leading-[1.22] tracking-[-0.02em] text-bark mb-4 [word-break:keep-all]">
            ただいま、
            <br />
            メンテナンス中です
          </h1>
          <p className="text-[14px] text-bark-2 leading-[1.95] mb-10">
            サービスの改善のため、一時的にご利用を停止しています。
            <br />
            ご不便をおかけして、申し訳ございません。
          </p>

          <div className="surface-card rounded-[14px] p-6 md:p-8 text-left mb-10">
            <div className="text-[11px] tracking-[0.22em] font-semibold text-sage-deep mb-4">
              STATUS
            </div>
            <dl className="divide-y divide-black/8">
              <div className="grid grid-cols-[120px_1fr] gap-4 py-3">
                <dt className="text-[11px] tracking-[0.16em] font-semibold text-bark-4 uppercase pt-0.5">
                  再開予定
                </dt>
                <dd className="price text-[14px] text-bark font-bold tracking-[-0.01em]">
                  2026-04-17　06:00
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 py-3">
                <dt className="text-[11px] tracking-[0.16em] font-semibold text-bark-4 uppercase pt-0.5">
                  対象範囲
                </dt>
                <dd className="text-[14px] text-bark font-medium">すべてのサービス</dd>
              </div>
            </dl>
          </div>

          <p className="text-[12px] text-bark-4 leading-[1.85]">
            お急ぎの場合は
            <a
              href="mailto:support@ouver.jp"
              className="text-sage-deep font-bold mx-1 underline-offset-[4px] hover:underline decoration-sage-deep/40"
            >
              support@ouver.jp
            </a>
            までご連絡ください。
          </p>
        </div>
      </main>
    </div>
  )
}
