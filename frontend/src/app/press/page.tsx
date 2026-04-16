import {
  Download,
  ExternalLink,
  FileText,
  Mail,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const pressReleases = [
  { date: '2026-04-15', title: '株式会社Ouver、相続不動産マッチングサービス「Ouver」を正式リリース' },
  { date: '2026-03-01', title: '株式会社Ouver、士業ネットワーク5団体との提携を開始' },
  { date: '2026-01-15', title: '株式会社Ouver、シードラウンドの資金調達を完了' },
]

const mediaArticles = [
  { date: '2026-04-16', source: '不動産業界新聞', title: '相続不動産の入札型プラットフォーム「Ouver」がサービス開始' },
  { date: '2026-04-15', source: 'TechCrunch Japan', title: '相続×テック、士業ネットワークを活用した不動産マッチングの新しい形' },
]

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">メディア掲載・プレス</h1>
          <p className="text-sm text-neutral-400 mb-10">
            株式会社Ouverに関するプレスリリース、メディア掲載情報をまとめています。
          </p>

          {/* プレスキット */}
          <section className="bg-white rounded-2xl shadow-card p-6 mb-8">
            <h2 className="text-base font-semibold mb-3">プレスキット</h2>
            <p className="text-sm text-neutral-500 mb-4">
              ロゴデータ、サービス概要、代表者プロフィールなどをまとめたプレスキットをダウンロードいただけます。
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              <Download className="w-4 h-4" />
              プレスキットをダウンロード（ZIP）
            </button>
          </section>

          {/* プレスリリース */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">プレスリリース</h2>
            <div className="space-y-3">
              {pressReleases.map((pr) => (
                <div key={pr.date} className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-3 hover:shadow-md transition-shadow">
                  <FileText className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">{pr.date}</p>
                    <p className="text-sm font-medium">{pr.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* メディア掲載 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">メディア掲載</h2>
            <div className="space-y-3">
              {mediaArticles.map((article) => (
                <div key={article.title} className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-3 hover:shadow-md transition-shadow">
                  <ExternalLink className="w-4 h-4 text-info-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-neutral-400">{article.date}</span>
                      <span className="text-xs font-medium text-info-600">{article.source}</span>
                    </div>
                    <p className="text-sm font-medium">{article.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 報道関連お問い合わせ */}
          <section className="bg-neutral-100 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-semibold mb-1">報道関連のお問い合わせ</h2>
                <p className="text-sm text-neutral-500 mb-2">
                  取材のご依頼、掲載許可、資料請求など、報道関連のお問い合わせは下記までご連絡ください。
                </p>
                <p className="text-sm">
                  株式会社Ouver 広報担当<br />
                  メール: press@ouver.jp
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
