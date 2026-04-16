'use client'

import { RouteGuard } from '@/components/auth/RouteGuard'

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['professional', 'admin']}>{children}</RouteGuard>
}
