import {
  LayoutDashboard,
  Building2,
  Gavel,
  FileText,
  Bell,
  Search,
  Heart,
  Users,
  DollarSign,
  Link2,
  Briefcase,
  MessageSquare,
  Handshake,
  Settings,
  ClipboardList,
  Receipt,
  BarChart3,
  HelpCircle,
  Activity,
  MessageSquareMore,
  Shield,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  icon: LucideIcon
  label: string
  href: string
}

export const sellerNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/seller' },
  { icon: Search, label: '物件を探す', href: '/properties' },
  { icon: Building2, label: '出品物件', href: '/seller/properties' },
  { icon: Gavel, label: '入札一覧', href: '/seller/bids' },
  { icon: ClipboardList, label: '案件進捗', href: '/seller/cases' },
  { icon: FileText, label: '書類管理', href: '/seller/documents' },
  { icon: Receipt, label: '取引履歴', href: '/seller/transactions' },
  { icon: MessageSquare, label: 'メッセージ', href: '/seller/messages' },
  { icon: Bell, label: '通知', href: '/seller/notifications' },
  { icon: HelpCircle, label: 'サポート', href: '/seller/support' },
  { icon: Settings, label: '設定', href: '/seller/settings' },
]

export const buyerNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/buyer' },
  { icon: Search, label: '物件を探す', href: '/properties' },
  { icon: Gavel, label: '入札履歴', href: '/buyer/bids' },
  { icon: Heart, label: 'お気に入り', href: '/buyer/favorites' },
  { icon: ClipboardList, label: '案件進捗', href: '/buyer/cases' },
  { icon: Receipt, label: '取引履歴', href: '/buyer/transactions' },
  { icon: MessageSquare, label: 'メッセージ', href: '/buyer/messages' },
  { icon: Bell, label: '通知', href: '/buyer/notifications' },
  { icon: HelpCircle, label: 'サポート', href: '/buyer/support' },
  { icon: Settings, label: '設定', href: '/buyer/settings' },
]

export const professionalNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/professional' },
  { icon: Search, label: '物件を探す', href: '/properties' },
  { icon: Users, label: '紹介案件', href: '/professional/referrals' },
  { icon: DollarSign, label: '紹介料実績', href: '/professional/earnings' },
  { icon: Link2, label: '紹介リンク', href: '/professional/referral-link' },
  { icon: FileText, label: '書類閲覧', href: '/professional/documents' },
  { icon: MessageSquare, label: 'メッセージ', href: '/professional/messages' },
  { icon: Bell, label: '通知', href: '/professional/notifications' },
  { icon: HelpCircle, label: 'サポート', href: '/professional/support' },
  { icon: Settings, label: '設定', href: '/professional/settings' },
]

export const brokerNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/broker' },
  { icon: Search, label: '物件を探す', href: '/properties' },
  { icon: Briefcase, label: '案件管理', href: '/broker/cases' },
  { icon: MessageSquare, label: 'メッセージ', href: '/broker/messages' },
  { icon: Receipt, label: '請求書', href: '/broker/invoices' },
  { icon: Bell, label: '通知', href: '/broker/notifications' },
  { icon: HelpCircle, label: 'サポート', href: '/broker/support' },
  { icon: Settings, label: '設定', href: '/broker/settings' },
]

export const adminNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/admin' },
  { icon: Search, label: '物件を探す', href: '/properties' },
  { icon: Building2, label: '物件管理', href: '/admin/properties' },
  { icon: Gavel, label: '入札管理', href: '/admin/bids' },
  { icon: ClipboardList, label: '案件管理', href: '/admin/cases' },
  { icon: Briefcase, label: '士業管理', href: '/admin/professionals' },
  { icon: Handshake, label: '業者管理', href: '/admin/brokers' },
  { icon: Link2, label: 'NW会社', href: '/admin/nw-companies' },
  { icon: DollarSign, label: '収益管理', href: '/admin/revenue' },
  { icon: BarChart3, label: '分析', href: '/admin/analytics' },
  { icon: Users, label: 'ユーザー', href: '/admin/users' },
  { icon: Shield, label: '監査ログ', href: '/admin/audit-log' },
  { icon: Activity, label: 'システム状態', href: '/admin/system-health' },
  { icon: MessageSquareMore, label: 'お問い合わせ', href: '/admin/inquiries' },
  { icon: FileText, label: 'コンテンツ', href: '/admin/content' },
  { icon: Bell, label: '通知', href: '/admin/notifications' },
  { icon: Settings, label: '設定', href: '/admin/settings' },
]
