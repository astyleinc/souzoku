'use client'

import {
  Building2,
  User,
  Bell,
  Lock,
  Landmark,
  Save,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { brokerNav } from '@/config/navigation'

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

export default function BrokerSettingsPage() {
  return (
    <DashboardShell
      title="設定"
      roleLabel="提携業者"
      userName="松本 大輝"
      navItems={brokerNav}
    >
      <div className="max-w-3xl space-y-6">
        {/* 会社情報 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold">会社情報</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">会社の基本情報と宅建業免許を管理します</p>
          <div className="space-y-4">
            <div>
              <FieldLabel>会社名</FieldLabel>
              <TextInput defaultValue="東京中央不動産株式会社" />
            </div>
            <div>
              <FieldLabel>宅建業免許番号</FieldLabel>
              <TextInput defaultValue="東京都知事(3)第12345号" readOnly className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-500 cursor-not-allowed" />
              <p className="text-xs text-neutral-400 mt-1">免許番号の変更は運営へお問い合わせください</p>
            </div>
            <div>
              <FieldLabel>所在地</FieldLabel>
              <TextInput defaultValue="東京都中央区日本橋3丁目1-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>代表電話</FieldLabel>
                <TextInput defaultValue="03-7777-8888" type="tel" />
              </div>
              <div>
                <FieldLabel>代表メール</FieldLabel>
                <TextInput defaultValue="info@tokyo-chuo.example.com" type="email" />
              </div>
            </div>
          </div>
        </div>

        {/* 担当者情報 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-secondary-500" />
            <h2 className="text-base font-semibold">担当者情報</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">Ouverとの連絡窓口となる担当者の情報です</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>担当者名</FieldLabel>
                <TextInput defaultValue="松本 大輝" />
              </div>
              <div>
                <FieldLabel>役職</FieldLabel>
                <TextInput defaultValue="営業部長" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>メールアドレス</FieldLabel>
                <TextInput defaultValue="matsumoto@example.com" type="email" />
              </div>
              <div>
                <FieldLabel>携帯電話</FieldLabel>
                <TextInput defaultValue="090-1234-5678" type="tel" />
              </div>
            </div>
          </div>
        </div>

        {/* 振込口座 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Landmark className="w-5 h-5 text-cta-500" />
            <h2 className="text-base font-semibold">振込口座</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">仲介手数料の振込先口座を設定します</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>銀行名</FieldLabel>
                <TextInput defaultValue="三菱UFJ銀行" />
              </div>
              <div>
                <FieldLabel>支店名</FieldLabel>
                <TextInput defaultValue="日本橋支店" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel>口座種別</FieldLabel>
                <select className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
                  <option value="ordinary" selected>普通</option>
                  <option value="current">当座</option>
                </select>
              </div>
              <div>
                <FieldLabel>口座番号</FieldLabel>
                <TextInput defaultValue="1234567" />
              </div>
              <div>
                <FieldLabel>口座名義</FieldLabel>
                <TextInput defaultValue="トウキョウチュウオウフドウサン（カ" />
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
              { label: '新規案件の割当通知', description: '新しい案件が割り当てられたとき', checked: true },
              { label: 'メッセージの通知', description: '運営からメッセージを受信したとき', checked: true },
              { label: '案件期限の通知', description: '対応期限が近づいたとき', checked: true },
              { label: '決済完了の通知', description: '案件の決済が完了したとき', checked: true },
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
