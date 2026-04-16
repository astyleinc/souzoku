'use client'

import {
  User,
  Bell,
  Lock,
  SlidersHorizontal,
  Save,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { buyerNav } from '@/config/navigation'

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

export default function BuyerSettingsPage() {
  return (
    <DashboardShell
      title="設定"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
    >
      <div className="max-w-3xl space-y-6">
        {/* プロフィール */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold">プロフィール</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">アカウント情報と連絡先を管理します</p>
          <div className="space-y-4">
            <div>
              <FieldLabel>会社名 / 氏名</FieldLabel>
              <TextInput defaultValue="株式会社山本不動産" />
            </div>
            <div>
              <FieldLabel>担当者名</FieldLabel>
              <TextInput defaultValue="山本 太郎" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>メールアドレス</FieldLabel>
                <TextInput defaultValue="yamamoto@example.com" type="email" />
              </div>
              <div>
                <FieldLabel>電話番号</FieldLabel>
                <TextInput defaultValue="03-7777-8888" type="tel" />
              </div>
            </div>
            <div>
              <FieldLabel>住所</FieldLabel>
              <TextInput defaultValue="東京都港区六本木3丁目2-1" />
            </div>
          </div>
        </div>

        {/* 物件検索の希望条件 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal className="w-5 h-5 text-secondary-500" />
            <h2 className="text-base font-semibold">希望条件</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">条件に合う新着物件の通知を受け取れます</p>
          <div className="space-y-4">
            <div>
              <FieldLabel>希望エリア</FieldLabel>
              <TextInput defaultValue="東京都23区" placeholder="例: 東京都23区、神奈川県横浜市" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>物件種別</FieldLabel>
                <select className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
                  <option value="">指定なし</option>
                  <option value="mansion">マンション</option>
                  <option value="house" selected>一戸建て</option>
                  <option value="land">土地</option>
                  <option value="building">ビル</option>
                </select>
              </div>
              <div>
                <FieldLabel>面積（㎡以上）</FieldLabel>
                <TextInput type="number" defaultValue="50" placeholder="例: 50" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>予算下限（万円）</FieldLabel>
                <TextInput type="number" defaultValue="2000" placeholder="例: 2000" />
              </div>
              <div>
                <FieldLabel>予算上限（万円）</FieldLabel>
                <TextInput type="number" defaultValue="8000" placeholder="例: 8000" />
              </div>
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
              { label: '新着物件の通知', description: '希望条件に合う物件が掲載されたとき', checked: true },
              { label: '入札結果の通知', description: '入札の結果が確定したとき', checked: true },
              { label: 'メッセージの通知', description: '新しいメッセージを受信したとき', checked: true },
              { label: 'お気に入り物件の更新', description: 'お気に入り物件のステータスが変わったとき', checked: false },
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
