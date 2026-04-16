'use client'

import {
  Building2,
  Mail,
  Bell,
  Shield,
  Globe,
  Percent,
  Save,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'

type SettingsSectionProps = {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}

const SettingsSection = ({ icon, title, description, children }: SettingsSectionProps) => (
  <div className="bg-white rounded-2xl shadow-card p-6">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
    <p className="text-sm text-neutral-400 mb-5">{description}</p>
    {children}
  </div>
)

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium text-neutral-600 mb-1.5 block">{children}</label>
)

const TextInput = ({ defaultValue, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="text"
    defaultValue={defaultValue}
    className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 bg-white transition-colors"
    {...props}
  />
)

export default function AdminSettingsPage() {
  return (
    <DashboardShell
      title="設定"
      roleLabel="管理者"
      userName="Ouver運営"
      navItems={adminNav}
    >
      <div className="max-w-3xl space-y-6">
        {/* プラットフォーム情報 */}
        <SettingsSection
          icon={<Building2 className="w-5 h-5 text-primary-500" />}
          title="プラットフォーム情報"
          description="サイト全体に表示される基本情報です"
        >
          <div className="space-y-4">
            <div>
              <FieldLabel>サイト名</FieldLabel>
              <TextInput defaultValue="Ouver 相続不動産マッチング" />
            </div>
            <div>
              <FieldLabel>運営会社名</FieldLabel>
              <TextInput defaultValue="株式会社Ouver" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>連絡先メール</FieldLabel>
                <TextInput defaultValue="info@ouver.jp" type="email" />
              </div>
              <div>
                <FieldLabel>連絡先電話番号</FieldLabel>
                <TextInput defaultValue="03-1234-5678" type="tel" />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* 報酬配分設定 */}
        <SettingsSection
          icon={<Percent className="w-5 h-5 text-cta-500" />}
          title="報酬配分設定"
          description="成約時の仲介手数料配分率を設定します"
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-xs font-medium text-neutral-500 mb-3">NW経由の紹介</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: '業者', value: '50' },
                  { label: 'Ouver', value: '32' },
                  { label: '士業', value: '15' },
                  { label: 'NW', value: '3' },
                ].map((item) => (
                  <div key={item.label}>
                    <FieldLabel>{item.label}</FieldLabel>
                    <div className="relative">
                      <TextInput defaultValue={item.value} className="w-full px-3 py-2.5 pr-8 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-xs font-medium text-neutral-500 mb-3">直接紹介（NW無し）</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: '業者', value: '50' },
                  { label: 'Ouver', value: '35' },
                  { label: '士業', value: '15' },
                ].map((item) => (
                  <div key={item.label}>
                    <FieldLabel>{item.label}</FieldLabel>
                    <div className="relative">
                      <TextInput defaultValue={item.value} className="w-full px-3 py-2.5 pr-8 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-400">
              段階的手数料率: 最初5件は業者60%、6〜20件は55%、21件以上は50%
            </p>
          </div>
        </SettingsSection>

        {/* 通知設定 */}
        <SettingsSection
          icon={<Bell className="w-5 h-5 text-warning-500" />}
          title="通知設定"
          description="システム通知の送信先とトリガーを設定します"
        >
          <div className="space-y-3">
            {[
              { label: '新規物件登録の通知', description: '物件が新しく登録されたとき', checked: true },
              { label: '即決価格到達の通知', description: '入札額が即決価格に到達したとき', checked: true },
              { label: '入札期限終了の通知', description: '入札受付期間が終了したとき', checked: true },
              { label: '新規士業登録の通知', description: '士業パートナーが新しく登録したとき', checked: true },
              { label: '書類アップロードの通知', description: '売主が書類をアップロードしたとき', checked: false },
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
        </SettingsSection>

        {/* メール設定 */}
        <SettingsSection
          icon={<Mail className="w-5 h-5 text-info-500" />}
          title="メール設定"
          description="システムメールの送信元情報を設定します"
        >
          <div className="space-y-4">
            <div>
              <FieldLabel>送信元メールアドレス</FieldLabel>
              <TextInput defaultValue="noreply@ouver.jp" type="email" />
            </div>
            <div>
              <FieldLabel>送信元表示名</FieldLabel>
              <TextInput defaultValue="Ouver 相続不動産マッチング" />
            </div>
          </div>
        </SettingsSection>

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
