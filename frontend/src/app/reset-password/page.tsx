'use client'

import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-500 tracking-tight">
            Ouver
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-primary-500" />
          </div>

          <h1 className="text-xl font-bold text-center mb-2">新しいパスワードを設定</h1>
          <p className="text-sm text-neutral-400 text-center mb-6">
            新しいパスワードを入力してください。
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">新しいパスワード</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="8文字以上で入力"
                  className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">パスワード確認</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="もう一度入力"
                  className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-400">
              <p className="font-medium">パスワード要件:</p>
              <div className="space-y-1 pl-1">
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-neutral-300" />
                  8文字以上
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-neutral-300" />
                  英数字を含む
                </p>
              </div>
            </div>

            <button className="w-full py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors">
              パスワードを変更する
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-primary-500 hover:underline">
              ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
