'use client'

import { RouteGuard } from '@/components/auth/RouteGuard'

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['seller', 'admin']}>{children}</RouteGuard>
}
