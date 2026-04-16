import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">Cookieポリシー</h1>
          <p className="text-sm text-neutral-400 mb-8">最終更新日: 2026年4月1日</p>

          <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
            <section>
              <h2 className="text-base font-semibold mb-3">Cookieとは</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Cookie（クッキー）とは、ウェブサイトがお客様のブラウザに送信する小さなテキストファイルです。ブラウザに保存され、次回のアクセス時にウェブサイトがお客様を識別するために使用されます。株式会社Ouver（以下「当社」）は、本サービスの提供・改善のためにCookieを使用しています。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">使用するCookieの種類</h2>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-2.5 px-2 text-xs text-neutral-400 font-medium">種類</th>
                      <th className="text-left py-2.5 px-2 text-xs text-neutral-400 font-medium">目的</th>
                      <th className="text-left py-2.5 px-2 text-xs text-neutral-400 font-medium">保存期間</th>
                      <th className="text-center py-2.5 px-2 text-xs text-neutral-400 font-medium">必須</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr>
                      <td className="py-3 px-2 font-medium text-neutral-700">必須Cookie</td>
                      <td className="py-3 px-2 text-neutral-600">ログイン状態の維持、セキュリティ機能の提供など、サービスの基本動作に不可欠なCookieです。</td>
                      <td className="py-3 px-2 text-neutral-500 whitespace-nowrap">セッション〜1年</td>
                      <td className="py-3 px-2 text-center text-neutral-500">はい</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-neutral-700">分析Cookie</td>
                      <td className="py-3 px-2 text-neutral-600">サイトの利用状況を分析し、サービス改善に役立てるためのCookieです。アクセス数やページ遷移を匿名で収集します。</td>
                      <td className="py-3 px-2 text-neutral-500 whitespace-nowrap">最大2年</td>
                      <td className="py-3 px-2 text-center text-neutral-500">いいえ</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-neutral-700">機能Cookie</td>
                      <td className="py-3 px-2 text-neutral-600">お客様の設定（表示言語、地域など）を記憶し、より快適な利用体験を提供するためのCookieです。</td>
                      <td className="py-3 px-2 text-neutral-500 whitespace-nowrap">最大1年</td>
                      <td className="py-3 px-2 text-center text-neutral-500">いいえ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">サードパーティCookie</h2>
              <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                <p>当社は、以下のサードパーティサービスのCookieを利用する場合があります。</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Google Analytics（アクセス解析）</li>
                  <li>Vercel Analytics（パフォーマンス計測）</li>
                </ul>
                <p>
                  各サードパーティのCookie利用については、それぞれのプライバシーポリシーをご確認ください。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">Cookieの管理・無効化</h2>
              <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                <p>
                  お客様はブラウザの設定を変更することで、Cookieの受け入れを制御できます。ほとんどのブラウザでは以下の操作が可能です。
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>すべてのCookieを受け入れる</li>
                  <li>Cookieが設定されるときに通知を受ける</li>
                  <li>すべてのCookieを拒否する</li>
                </ul>
                <p>
                  ただし、必須Cookieを無効にした場合、ログインなど本サービスの一部機能が正常に動作しなくなる可能性があります。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">本ポリシーの変更</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                当社は、法令の変更やサービスの改善に伴い、本ポリシーを変更することがあります。重要な変更がある場合は、サービス上でお知らせいたします。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">お問い合わせ</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
              </p>
              <div className="mt-3 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
                <p>株式会社Ouver プライバシー担当</p>
                <p>メール: privacy@ouver.jp</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
