'use client'

import { useState, useEffect } from 'react'
import {
  Settings,
  DollarSign,
  Clock,
  Bell,
  Shield,
  CheckCircle,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type SystemSettings = {
  commissionRate: number
  ouverShareNw: number
  ouverShareDirect: number
  professionalShare: number
  nwShare: number
  bidDurationDays: number
  registrationGraceDays: number
  maxImagesPerProperty: number
  autoVerificationEnabled: boolean
  maintenanceMode: boolean
}

const defaultSettings: SystemSettings = {
  commissionRate: 3,
  ouverShareNw: 32,
  ouverShareDirect: 35,
  professionalShare: 15,
  nwShare: 3,
  bidDurationDays: 14,
  registrationGraceDays: 60,
  maxImagesPerProperty: 20,
  autoVerificationEnabled: true,
  maintenanceMode: false,
}

const inputClass = 'w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<SystemSettings>('/admin/settings')
      if (res.success) {
        setSettings({ ...defaultSettings, ...res.data })
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const res = await api.put('/admin/settings', settings)
    setSaving(false)
    if (res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const set = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  if (loading) {
    return (
      <DashboardShell title="システム設定" roleLabel="管理画面" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="システム設定" roleLabel="管理画面" navItems={adminNav}>
      <div className="max-w-3xl space-y-8">
        {/* 手数料・報酬配分 */}
        <section className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign className="w-5 h-5 text-cta-500" />
            <h2 className="text-base font-semibold">手数料・報酬配分</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                基本仲介手数料率（%）
              </label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => set('commissionRate', Number(e.target.value))}
                min={0}
                max={10}
                step={0.1}
                className={inputClass}
              />
              <p className="text-xs text-neutral-400 mt-1">400万円超: 売買価格 × {settings.commissionRate}% + 6万円</p>
            </div>
            <div />
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                Ouver配分（NW経由, %）
              </label>
              <input
                type="number"
                value={settings.ouverShareNw}
                onChange={(e) => set('ouverShareNw', Number(e.target.value))}
                min={0}
                max={100}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                Ouver配分（直接紹介, %）
              </label>
              <input
                type="number"
                value={settings.ouverShareDirect}
                onChange={(e) => set('ouverShareDirect', Number(e.target.value))}
                min={0}
                max={100}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                士業配分（%）
              </label>
              <input
                type="number"
                value={settings.professionalShare}
                onChange={(e) => set('professionalShare', Number(e.target.value))}
                min={0}
                max={100}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                NW配分（%）
              </label>
              <input
                type="number"
                value={settings.nwShare}
                onChange={(e) => set('nwShare', Number(e.target.value))}
                min={0}
                max={100}
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-4 p-3 bg-info-50 rounded-xl text-xs text-info-600">
            合計: 業者50% + Ouver{settings.ouverShareNw}% + 士業{settings.professionalShare}% + NW{settings.nwShare}% = {50 + settings.ouverShareNw + settings.professionalShare + settings.nwShare}%
            {50 + settings.ouverShareNw + settings.professionalShare + settings.nwShare !== 100 && (
              <span className="text-error-500 font-medium ml-2">（合計が100%になるよう調整してください）</span>
            )}
          </div>
        </section>

        {/* 運営ルール */}
        <section className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold">運営ルール</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                入札受付期間（日数）
              </label>
              <input
                type="number"
                value={settings.bidDurationDays}
                onChange={(e) => set('bidDurationDays', Number(e.target.value))}
                min={1}
                max={90}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                登記猶予期間（日数）
              </label>
              <input
                type="number"
                value={settings.registrationGraceDays}
                onChange={(e) => set('registrationGraceDays', Number(e.target.value))}
                min={1}
                max={365}
                className={inputClass}
              />
              <p className="text-xs text-neutral-400 mt-1">期限超過で自動差戻し</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                物件画像の最大枚数
              </label>
              <input
                type="number"
                value={settings.maxImagesPerProperty}
                onChange={(e) => set('maxImagesPerProperty', Number(e.target.value))}
                min={1}
                max={50}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* 通知・自動処理 */}
        <section className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-secondary-500" />
            <h2 className="text-base font-semibold">自動処理</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl cursor-pointer">
              <div>
                <p className="text-sm font-medium">士業の自動認証</p>
                <p className="text-xs text-neutral-400 mt-0.5">資格登録番号の自動照合による認証</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoVerificationEnabled}
                onChange={(e) => set('autoVerificationEnabled', e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
              />
            </label>
          </div>
        </section>

        {/* メンテナンスモード */}
        <section className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-warning-500" />
            <h2 className="text-base font-semibold">メンテナンス</h2>
          </div>
          <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl cursor-pointer">
            <div>
              <p className="text-sm font-medium">メンテナンスモード</p>
              <p className="text-xs text-neutral-400 mt-0.5">有効にすると管理者以外のアクセスが制限されます</p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => set('maintenanceMode', e.target.checked)}
              className="w-5 h-5 rounded border-neutral-300 text-warning-500 focus:ring-warning-500/20"
            />
          </label>
        </section>

        {/* 保存ボタン */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-success-600">
              <CheckCircle className="w-4 h-4" />
              保存しました
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? '保存中...' : '設定を保存'}
          </button>
        </div>
      </div>
    </DashboardShell>
  )
}
