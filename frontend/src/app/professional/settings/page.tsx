'use client'

import {
  User,
  Building2,
  Bell,
  Lock,
  Globe,
  Save,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'

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

export default function ProfessionalSettingsPage() {
  return (
    <DashboardShell
      title="設定"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={professionalNav}
    >
      <div className="max-w-3xl space-y-6">
        {/* プロフィール */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold">プロフィール</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">氏名と資格情報を管理します</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>姓</FieldLabel>
                <TextInput defaultValue="山田" />
              </div>
              <div>
                <FieldLabel>名</FieldLabel>
                <TextInput defaultValue="太郎" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>資格</FieldLabel>
                <select className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
                  <option value="tax_accountant" selected>税理士</option>
                  <option value="judicial_scrivener">司法書士</option>
                  <option value="administrative_scrivener">行政書士</option>
                  <option value="lawyer">弁護士</option>
                </select>
              </div>
              <div>
                <FieldLabel>登録番号</FieldLabel>
                <TextInput defaultValue="第12345号" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>メールアドレス</FieldLabel>
                <TextInput defaultValue="yamada@example.com" type="email" />
              </div>
              <div>
                <FieldLabel>電話番号</FieldLabel>
                <TextInput defaultValue="03-1234-5678" type="tel" />
              </div>
            </div>
          </div>
        </div>

        {/* 事務所情報 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-secondary-500" />
            <h2 className="text-base font-semibold">事務所情報</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">所属する事務所の情報です</p>
          <div className="space-y-4">
            <div>
              <FieldLabel>事務所名</FieldLabel>
              <TextInput defaultValue="山田税理士事務所" />
            </div>
            <div>
              <FieldLabel>所在地</FieldLabel>
              <TextInput defaultValue="東京都千代田区丸の内1丁目1-1" />
            </div>
          </div>
        </div>

        {/* NW所属 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-info-500" />
            <h2 className="text-base font-semibold">ネットワーク所属</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">所属するNWは報酬配分に影響します</p>
          <div className="space-y-3">
            {['awaka cross', 'UIコンサルティング', 'ミツカル'].map((nw) => (
              <label key={nw} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={nw === 'awaka cross'}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
                />
                <span className="text-sm">{nw}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-3">
            NW所属の変更は審査後に反映されます
          </p>
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
              { label: '紹介案件の進捗通知', description: '紹介した案件のステータスが変わったとき', checked: true },
              { label: '報酬確定の通知', description: '紹介料が確定したとき', checked: true },
              { label: '書類閲覧許可の通知', description: '売主から書類の閲覧許可が出たとき', checked: true },
              { label: '新規登録完了の通知', description: '紹介した売主の登録が完了したとき', checked: true },
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
