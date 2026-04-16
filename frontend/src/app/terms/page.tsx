import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold mb-2">利用規約</h1>
          <p className="text-sm text-neutral-400 mb-8">最終更新日: 2026年4月1日</p>

          <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
            <section>
              <h2 className="text-base font-semibold mb-3">第1条（適用）</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                本規約は、株式会社Ouver（以下「当社」）が提供する相続不動産マッチングサービス（以下「本サービス」）の利用に関する条件を定めるものです。登録ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">第2条（利用登録）</h2>
              <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
                <p>
                  本サービスにおいては、登録希望者が本規約に同意のうえ、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって利用登録が完了するものとします。
                </p>
                <p>
                  当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、当社が利用登録を相当でないと判断した場合</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">第3条（ユーザーIDおよびパスワードの管理）</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。ユーザーIDおよびパスワードの管理不十分、使用上の過誤、第三者の使用等によって生じた損害に関する責任はユーザーが負うものとします。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">第4条（禁止事項）</h2>
              <div className="text-sm text-neutral-600 leading-relaxed">
                <p className="mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>当社、本サービスの他のユーザー、または第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為</li>
                  <li>本サービスの運営を妨害するおそれのある行為</li>
                  <li>不正アクセスをし、またはこれを試みる行為</li>
                  <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                  <li>不正な目的を持って本サービスを利用する行為</li>
                  <li>その他、当社が不適切と判断する行為</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">第5条（本サービスの提供の停止等）</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">第6条（免責事項）</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                当社は、本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。当社は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、当社とユーザーとの間の契約が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3">第7条（準拠法・裁判管轄）</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、東京地方裁判所を専属的合意管轄とします。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
