'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  Download,
  Trash2,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/format'

type AccountDeletionFormProps = {
  roleName: string
  hasPendingTransactions?: boolean
}

export const AccountDeletionForm = ({
  roleName,
  hasPendingTransactions = false,
}: AccountDeletionFormProps) => {
  const router = useRouter()
  const { user, logout } = useAuth()
  const userName = user?.name ?? ''

  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setExporting(true)
    const res = await api.post('/users/me/export-data')
    if (res.success) {
      // データをJSONとしてダウンロード
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ouver-data-export-${formatDate(new Date())}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
    setExporting(false)
  }

  const handleDelete = async () => {
    setError(null)
    if (!reason) {
      setError('退会理由を選択してください')
      return
    }

    setDeleting(true)
    const res = await api.post('/users/me/delete-request', {
      reason: `${reason}${feedback ? `: ${feedback}` : ''}`,
    })

    if (res.success) {
      await logout()
      router.push('/')
    } else {
      setError('退会処理に失敗しました')
    }
    setDeleting(false)
  }

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
          退会前にデータをダウンロードできます。
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors disabled:opacity-60"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          データをエクスポート
        </button>
      </div>

      {/* 退会フォーム */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-base font-semibold mb-1">退会手続き</h2>
        <p className="text-sm text-neutral-400 mb-5">
          {userName}さんの{roleName}アカウントを削除します。
        </p>

        {error && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">退会理由 <span className="text-error-500">*</span></label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
            >
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
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="サービス改善のため、ご意見をお聞かせください"
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white resize-none"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400 mb-4">
            「アカウントを削除」を押すと、30日間の猶予期間が開始されます。期間中にログインすることで削除をキャンセルできます。30日を過ぎるとデータは完全に削除されます。
          </p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-error-500 rounded-xl hover:bg-error-600 transition-colors disabled:opacity-60"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            アカウントを削除
          </button>
        </div>
      </div>
    </div>
  )
}
