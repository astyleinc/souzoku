'use client'

import { RouteGuard } from '@/components/auth/RouteGuard'

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['broker', 'admin']}>{children}</RouteGuard>
}
