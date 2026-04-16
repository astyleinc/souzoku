import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">アクセシビリティ方針</h1>
          <p className="text-sm text-neutral-400 mb-8">最終更新日: 2026年4月1日</p>

          <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
            <section>
              <h2 className="text-base font-semibold mb-3">基本方針</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                株式会社Ouver（以下「当社」）は、相続不動産マッチングサービス「Ouver」において、年齢、障がいの有無、利用環境に関わらず、すべてのユーザーがサービスを利用できるよう、アクセシビリティの確保・向上に取り組んでいます。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">対応基準</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                当社は、Web Content Accessibility Guidelines（WCAG）2.1 レベルAA への準拠を目標としています。すべての基準を完全に満たすことは継続的な取り組みであり、段階的な改善を進めています。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">具体的な取り組み</h2>
              <div className="text-sm text-neutral-600 leading-relaxed">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>画像や図に代替テキストを付与し、スクリーンリーダーでの読み上げに対応</li>
                  <li>十分な色のコントラスト比を確保し、色覚多様性に配慮</li>
                  <li>キーボードのみでの操作に対応</li>
                  <li>フォーム入力のラベル付けとエラーメッセージの明確化</li>
                  <li>レスポンシブデザインによるさまざまな画面サイズへの対応</li>
                  <li>ページ構造を適切な見出し階層で整理</li>
                  <li>リンクテキストに遷移先がわかる説明を記載</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">現状と課題</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                現在、一部のページや機能において、アクセシビリティ基準を完全に満たしていない箇所がある可能性があります。特に以下の領域については改善を進めています。
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-neutral-600">
                <li>複雑なテーブル表示のスクリーンリーダー対応</li>
                <li>動的に更新されるコンテンツのライブリージョン対応</li>
                <li>PDFドキュメントのアクセシビリティ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">改善への取り組み</h2>
              <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                <p>当社では以下の取り組みにより、アクセシビリティの継続的な改善を図っています。</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>開発チーム内でのアクセシビリティガイドラインの共有と教育</li>
                  <li>定期的なアクセシビリティ監査の実施</li>
                  <li>ユーザーからのフィードバックに基づく改善</li>
                  <li>新機能リリース時のアクセシビリティチェック</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">フィードバック</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                アクセシビリティに関するご意見・ご要望がございましたら、下記までお気軽にお寄せください。いただいたフィードバックは、サービス改善に役立てさせていただきます。
              </p>
              <div className="mt-3 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
                <p>株式会社Ouver アクセシビリティ担当</p>
                <p>メール: accessibility@ouver.jp</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
