import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function TokushoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">特定商取引法に基づく表記</h1>
          <p className="text-sm text-neutral-400 mb-8">最終更新日: 2026年4月1日</p>

          <div className="bg-white rounded-2xl shadow-card p-8">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-neutral-100">
                {[
                  ['販売業者', '株式会社Ouver'],
                  ['代表者', '代表取締役 ○○ ○○'],
                  ['所在地', '東京都○○区○○ ○丁目○番○号'],
                  ['電話番号', '050-XXXX-XXXX（平日10:00〜18:00）'],
                  ['メールアドレス', 'info@ouver.jp'],
                  ['URL', 'https://ouver.jp'],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <th className="py-3.5 pr-6 text-left text-neutral-500 font-medium align-top whitespace-nowrap w-40">
                      {label}
                    </th>
                    <td className="py-3.5 text-neutral-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 space-y-8">
              <section>
                <h2 className="text-base font-semibold mb-3">サービス内容</h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  相続不動産に特化した入札型マッチングプラットフォームの運営。売主（相続人）が物件を登録し、入札方式により買い手とマッチングするサービスを提供します。
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold mb-3">利用料金</h2>
                <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                  <p>物件の掲載および入札は無料です。成約時に以下の手数料が発生します。</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>仲介手数料: 宅地建物取引業法に基づく上限額（売買価格×3%＋6万円（税別）、400万円以下は別途規定）</li>
                    <li>士業紹介料: 仲介手数料の15%（士業パートナー経由の場合）</li>
                  </ul>
                  <p>その他の料金は発生しません。詳細は<a href="/pricing" className="text-primary-500 hover:underline">料金ページ</a>をご確認ください。</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold mb-3">支払方法</h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  仲介手数料は、成約時に提携宅建業者を通じてお支払いいただきます。支払方法は銀行振込となります。
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold mb-3">サービスの提供時期</h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  利用登録完了後、直ちにサービスをご利用いただけます。物件の掲載は運営による審査完了後に公開されます。
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold mb-3">キャンセルポリシー</h2>
                <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                  <p>
                    入札期間中の入札キャンセルは可能です。ただし、売主が入札者を選択した後のキャンセルについては、提携宅建業者との契約条件に従います。
                  </p>
                  <p>
                    アカウントの退会はいつでも可能です。退会後30日間はデータが保持され、期間内であれば復元が可能です。
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold mb-3">動作環境</h2>
                <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                  <p>推奨ブラウザ:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Google Chrome（最新版）</li>
                    <li>Safari（最新版）</li>
                    <li>Microsoft Edge（最新版）</li>
                    <li>Firefox（最新版）</li>
                  </ul>
                  <p>スマートフォンでもご利用いただけます。</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold mb-3">お問い合わせ先</h2>
                <div className="p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
                  <p>株式会社Ouver カスタマーサポート</p>
                  <p>メール: support@ouver.jp</p>
                  <p>電話: 050-XXXX-XXXX（平日10:00〜18:00）</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
