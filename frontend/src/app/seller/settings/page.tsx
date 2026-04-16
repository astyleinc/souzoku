'use client'

import {
  User,
  Bell,
  Lock,
  Save,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium text-neutral-600 mb-1.5 block">{children}</label>
)

const TextInput = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="text"
    className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 bg-white transition-colors"
    {...props}
  />
)

export default function SellerSettingsPage() {
  return (
    <DashboardShell
      title="設定"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <div className="max-w-3xl space-y-6">
        {/* プロフィール */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold">プロフィール</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">本人確認情報と連絡先を管理します</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>姓</FieldLabel>
                <TextInput defaultValue="中村" />
              </div>
              <div>
                <FieldLabel>名</FieldLabel>
                <TextInput defaultValue="一郎" />
              </div>
            </div>
            <div>
              <FieldLabel>メールアドレス</FieldLabel>
              <TextInput defaultValue="nakamura@example.com" type="email" />
            </div>
            <div>
              <FieldLabel>電話番号</FieldLabel>
              <TextInput defaultValue="03-1234-5678" type="tel" />
            </div>
            <div>
              <FieldLabel>住所</FieldLabel>
              <TextInput defaultValue="東京都練馬区豊玉北5丁目1-1" />
            </div>
          </div>
        </div>

        {/* 通知設定 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-warning-500" />
            <h2 className="text-base font-semibold">通知設定</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">受け取る通知の種類を選択します</p>
          <div className="space-y-3">
            {[
              { label: '新しい入札の通知', description: '物件に新しい入札があったとき', checked: true },
              { label: '入札期限の通知', description: '入札期間の終了が近づいたとき', checked: true },
              { label: '書類審査の通知', description: '書類の審査結果が出たとき', checked: true },
              { label: 'メッセージの通知', description: '新しいメッセージを受信したとき', checked: true },
              { label: '案件進捗の通知', description: '案件のステータスが変更されたとき', checked: false },
            ].map((item) => (
              <label key={item.label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
                />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-neutral-400">{item.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100">
            <p className="text-sm font-medium mb-3">通知の受け取り方法</p>
            <div className="flex flex-wrap gap-4">
              {['メール', 'アプリ内通知'].map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* セキュリティ */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-neutral-500" />
            <h2 className="text-base font-semibold">セキュリティ</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">パスワードの変更と認証設定</p>
          <div className="space-y-4">
            <div>
              <FieldLabel>現在のパスワード</FieldLabel>
              <TextInput type="password" placeholder="現在のパスワードを入力" />
            </div>
            <div>
              <FieldLabel>新しいパスワード</FieldLabel>
              <TextInput type="password" placeholder="新しいパスワードを入力" />
            </div>
            <div>
              <FieldLabel>新しいパスワード（確認）</FieldLabel>
              <TextInput type="password" placeholder="もう一度入力" />
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            設定を保存
          </button>
        </div>
      </div>
    </DashboardShell>
  )
}
