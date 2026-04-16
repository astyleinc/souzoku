'use client'

import {
  AlertTriangle,
  Download,
  Trash2,
} from 'lucide-react'

type AccountDeletionFormProps = {
  roleName: string
  userName: string
  hasPendingTransactions?: boolean
}

export const AccountDeletionForm = ({
  roleName,
  userName,
  hasPendingTransactions = false,
}: AccountDeletionFormProps) => {
  return (
    <div className="max-w-2xl space-y-6">
      {/* 警告バナー */}
      <div className="flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-error-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-error-700">アカウントを削除すると元に戻せません</p>
          <p className="text-error-600 mt-1">
            すべてのデータ（プロフィール、物件情報、取引履歴、書類）が削除されます。削除後30日間はデータが保持されますが、30日を過ぎると完全に削除されます。
          </p>
        </div>
      </div>

      {/* 未完了取引の警告 */}
      {hasPendingTransactions && (
        <div className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-warning-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-warning-700">未完了の取引があります</p>
            <p className="text-warning-600 mt-1">
              進行中の案件がある状態でアカウントを削除すると、取引相手に影響があります。すべての取引が完了してから退会することをお勧めします。
            </p>
          </div>
        </div>
      )}

      {/* データエクスポート */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-base font-semibold mb-1">データのエクスポート</h2>
        <p className="text-sm text-neutral-400 mb-4">
          退会前にデータをダウンロードできます。エクスポートにはお時間がかかる場合があります。
        </p>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
          <Download className="w-4 h-4" />
          データをエクスポート
        </button>
      </div>

      {/* 退会フォーム */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-base font-semibold mb-1">退会手続き</h2>
        <p className="text-sm text-neutral-400 mb-5">
          {userName}さんの{roleName}アカウントを削除します。
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">退会理由</label>
            <select className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
              <option value="">選択してください</option>
              <option value="not-needed">サービスを利用しなくなった</option>
              <option value="found-alternative">他のサービスを利用することにした</option>
              <option value="hard-to-use">使い方がわかりにくい</option>
              <option value="privacy">個人情報の取り扱いに不安がある</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">ご意見（任意）</label>
            <textarea
              rows={3}
              placeholder="サービス改善のため、ご意見をお聞かせください"
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">パスワードを入力して確認</label>
            <input
              type="password"
              placeholder="現在のパスワード"
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400 mb-4">
            「アカウントを削除」を押すと、30日間の猶予期間が開始されます。期間中にログインすることで削除をキャンセルできます。30日を過ぎるとデータは完全に削除されます。
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-error-500 rounded-xl hover:bg-error-600 transition-colors">
            <Trash2 className="w-4 h-4" />
            アカウントを削除
          </button>
        </div>
      </div>
    </div>
  )
}
