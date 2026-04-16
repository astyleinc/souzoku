import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">プライバシーポリシー</h1>
          <p className="text-sm text-neutral-400 mb-8">最終更新日: 2026年4月1日</p>

          <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
            <section>
              <h2 className="text-base font-semibold mb-3">1. 個人情報の収集</h2>
              <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                <p>
                  株式会社Ouver（以下「当社」）は、本サービスの提供にあたり、以下の個人情報を収集することがあります。
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>氏名、メールアドレス、電話番号、住所</li>
                  <li>本人確認書類（運転免許証等）の画像</li>
                  <li>物件情報（住所、面積、価格等）</li>
                  <li>入札履歴、取引履歴</li>
                  <li>資格情報（士業パートナーの場合）</li>
                  <li>Cookie、IPアドレス、ブラウザ情報等のアクセスログ</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">2. 個人情報の利用目的</h2>
              <div className="text-sm text-neutral-600 leading-relaxed">
                <p className="mb-2">当社は、収集した個人情報を以下の目的で利用します。</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>本サービスの提供・運営</li>
                  <li>ユーザーの本人確認</li>
                  <li>物件情報の掲載・入札プロセスの管理</li>
                  <li>仲介業者・士業パートナーへの業務上必要な情報の共有</li>
                  <li>サービス改善のための統計分析</li>
                  <li>重要なお知らせの通知</li>
                  <li>問い合わせへの対応</li>
                  <li>利用規約に違反する行為への対応</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">3. 個人情報の第三者提供</h2>
              <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                <p>
                  当社は、以下の場合を除き、あらかじめユーザーの同意を得ることなく第三者に個人情報を提供することはありません。
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>法令に基づく場合</li>
                  <li>人の生命、身体または財産の保護のために必要がある場合</li>
                  <li>取引の成立に必要な範囲で、仲介業者・士業パートナーに共有する場合</li>
                  <li>業務委託先に必要な範囲で提供する場合</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">4. 個人情報の安全管理</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                当社は、個人情報の漏えい、滅失、き損の防止その他の安全管理のために必要かつ適切な措置を講じます。SSL/TLS暗号化通信の採用、アクセス権限の適切な管理、定期的なセキュリティ監査を実施しています。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">5. Cookieの使用</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                本サービスでは、ユーザー体験の向上およびサービス改善のためにCookieを使用しています。ユーザーはブラウザの設定によりCookieの受け入れを拒否することができますが、一部のサービスが正常に機能しなくなる場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">6. 個人情報の開示・訂正・削除</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                ユーザーは、当社が保有する自己の個人情報の開示、訂正、追加、削除、利用停止を請求することができます。ご請求の際は、本人確認を行ったうえで対応いたします。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">7. お問い合わせ</h2>
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
