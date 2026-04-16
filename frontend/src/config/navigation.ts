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
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  icon: LucideIcon
  label: string
  href: string
}

export const sellerNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/seller' },
  { icon: Building2, label: '出品物件', href: '/seller/properties' },
  { icon: Gavel, label: '入札一覧', href: '/seller/bids' },
  { icon: FileText, label: '書類管理', href: '/seller/documents' },
  { icon: Bell, label: '通知', href: '/seller/notifications' },
]

export const buyerNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/buyer' },
  { icon: Search, label: '物件を探す', href: '/properties' },
  { icon: Gavel, label: '入札履歴', href: '/buyer/bids' },
  { icon: Heart, label: 'お気に入り', href: '/buyer/favorites' },
  { icon: Bell, label: '通知', href: '/buyer/notifications' },
]

export const professionalNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/professional' },
  { icon: Users, label: '紹介案件', href: '/professional/referrals' },
  { icon: DollarSign, label: '紹介料実績', href: '/professional/earnings' },
  { icon: Link2, label: '紹介リンク', href: '/professional/referral-link' },
  { icon: FileText, label: '書類閲覧', href: '/professional/documents' },
  { icon: Bell, label: '通知', href: '/professional/notifications' },
]

export const brokerNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/broker' },
  { icon: Briefcase, label: '案件管理', href: '/broker/cases' },
  { icon: MessageSquare, label: 'メッセージ', href: '/broker/messages' },
  { icon: Bell, label: '通知', href: '/broker/notifications' },
]

export const adminNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/admin' },
  { icon: Building2, label: '物件管理', href: '/admin/properties' },
  { icon: Gavel, label: '入札管理', href: '/admin/bids' },
  { icon: Briefcase, label: '士業管理', href: '/admin/professionals' },
  { icon: Handshake, label: '業者管理', href: '/admin/brokers' },
  { icon: DollarSign, label: '収益管理', href: '/admin/revenue' },
  { icon: Users, label: 'ユーザー', href: '/admin/users' },
  { icon: Settings, label: '設定', href: '/admin/settings' },
]
