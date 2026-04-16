import Link from 'next/link'
import { Wrench, Mail } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
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

      <main className="flex-1 flex items-center justify-center px-4 pb-24">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-warning-50 rounded-2xl mb-6">
            <Wrench className="w-10 h-10 text-warning-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            メンテナンス中です
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed mb-6">
            現在、サービスの改善のためメンテナンスを実施しています。<br />
            ご不便をおかけして申し訳ございません。
          </p>

          <div className="bg-white rounded-2xl shadow-card p-5 mb-6 text-left">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">復旧予定時刻</span>
                <span className="font-medium">2026年4月17日 6:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">影響範囲</span>
                <span className="font-medium">全サービス</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
            <Mail className="w-4 h-4" />
            <span>お急ぎの場合: support@ouver.jp</span>
          </div>
        </div>
      </main>
    </div>
  )
}
