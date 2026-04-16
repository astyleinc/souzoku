import { ROLE_LABEL } from '@/data/mock-dashboard'

type Role = 'seller' | 'buyer' | 'professional' | 'broker' | 'admin'

const roleStyle: Record<Role, string> = {
  seller: 'bg-primary-50 text-primary-700',
  buyer: 'bg-cta-50 text-cta-700',
  professional: 'bg-secondary-50 text-secondary-700',
  broker: 'bg-info-50 text-info-700',
  admin: 'bg-neutral-100 text-neutral-700',
}

export const RoleBadge = ({ role }: { role: Role }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${roleStyle[role]}`}
    >
      {ROLE_LABEL[role]}
    </span>
  )
}
