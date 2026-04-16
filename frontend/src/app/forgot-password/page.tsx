import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* ヘッダー */}
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-sm font-semibold text-foreground">相続不動産マッチング</span>
          </Link>
        </div>
      </header>

      {/* メイン */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold text-foreground mb-2">パスワードをリセット</h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                登録済みのメールアドレスを入力してください。<br />
                パスワード再設定用のリンクをお送りします。
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                  メールアドレス
                </label>
                <input
                  type="email"
                  placeholder="mail@example.com"
                  className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all"
              >
                リセットリンクを送信
              </button>
            </form>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 mt-6 text-sm text-neutral-400 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              ログインに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
