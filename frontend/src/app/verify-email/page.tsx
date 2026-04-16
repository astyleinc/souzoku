'use client'

import {
  Mail,
  RefreshCw,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-500 tracking-tight">
            Ouver
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7 text-primary-500" />
          </div>

          <h1 className="text-xl font-bold mb-2">メールアドレスを確認してください</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            ご登録いただいたメールアドレスに確認メールを送信しました。メール内のリンクをクリックして、アカウントを有効化してください。
          </p>

          <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
            <p className="text-xs text-neutral-400">送信先</p>
            <p className="text-sm font-medium mt-0.5">nakamura@example.com</p>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              <RefreshCw className="w-4 h-4" />
              確認メールを再送する
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-100 space-y-2 text-xs text-neutral-400">
            <p>メールが届かない場合:</p>
            <ul className="space-y-1 text-left pl-4 list-disc">
              <li>迷惑メールフォルダをご確認ください</li>
              <li>入力したメールアドレスが正しいかご確認ください</li>
              <li>数分経っても届かない場合は再送ボタンをお試しください</li>
            </ul>
          </div>

          <div className="mt-6">
            <Link href="/login" className="text-sm text-primary-500 hover:underline">
              ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
