'use client'

import {
  ArrowLeft,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'

const inputClass = 'w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors'
const selectClass = inputClass
const labelClass = 'block text-sm font-medium mb-1.5'

export default function ProfessionalClientNewPage() {
  return (
    <DashboardShell
      title="売主を代理登録"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={professionalNav}
    >
      <Link href="/professional/clients" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        クライアント一覧に戻る
      </Link>

      <div className="max-w-2xl space-y-6">
        {/* NW経路 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4">紹介経路</h2>
          <div>
            <label className={labelClass}>NW経路を選択</label>
            <select className={selectClass}>
              <option value="direct">直接紹介</option>
              <option value="awaka">awaka cross</option>
              <option value="ui">UIコンサルティング</option>
              <option value="mitsukaru">ミツカル</option>
            </select>
            <p className="text-xs text-neutral-400 mt-1.5">
              NW経由の場合、報酬配分にNW手数料（3%）が適用されます
            </p>
          </div>
        </div>

        {/* 売主情報 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4">売主情報</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>売主氏名</label>
              <input type="text" placeholder="中村 一郎" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>メールアドレス</label>
                <input type="email" placeholder="nakamura@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>電話番号</label>
                <input type="tel" placeholder="03-1234-5678" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>住所</label>
              <input type="text" placeholder="東京都○○区○○1丁目2-3" className={inputClass} />
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-3">
            売主にはアカウント作成の通知メールが届きます。初回ログイン時にパスワード設定が必要です。
          </p>
        </div>

        {/* 物件情報 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4">物件情報</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>物件タイトル</label>
              <input type="text" placeholder="○○区 ○○マンション 3LDK" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>物件所在地</label>
              <input type="text" placeholder="東京都○○区○○5丁目" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>物件種別</label>
                <select className={selectClass}>
                  <option value="">選択してください</option>
                  <option value="mansion">マンション</option>
                  <option value="house">一戸建て</option>
                  <option value="land">土地</option>
                  <option value="building">ビル</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>面積（㎡）</label>
                <input type="number" placeholder="72.5" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>希望売出価格（万円）</label>
                <input type="number" placeholder="3500" className={inputClass} />
                <p className="text-xs text-neutral-400 mt-1">最低出品価格: 1,000万円</p>
              </div>
              <div>
                <label className={labelClass}>即決価格（万円・任意）</label>
                <input type="number" placeholder="4000" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>入札期間</label>
              <select className={selectClass}>
                <option value="7">7日間</option>
                <option value="14">14日間</option>
                <option value="21">21日間</option>
                <option value="30">30日間</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>備考（任意）</label>
              <textarea
                rows={3}
                placeholder="物件の特記事項があれば入力してください"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* 書類アップロード */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-base font-semibold mb-4">書類アップロード</h2>
          <div className="space-y-3">
            {['登記事項証明書', '遺産分割協議書', '本人確認書類', '物件写真'].map((docType) => (
              <div key={docType} className="flex items-center gap-3 p-3 border border-dashed border-neutral-200 rounded-xl hover:border-primary-300 transition-colors">
                <Upload className="w-4 h-4 text-neutral-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{docType}</p>
                  <p className="text-xs text-neutral-400">PDF / JPG / PNG（10MBまで）</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium text-primary-500 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  選択
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 送信 */}
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors">
            登録する
          </button>
          <Link href="/professional/clients" className="px-6 py-3 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
            キャンセル
          </Link>
        </div>
      </div>
    </DashboardShell>
  )
}
