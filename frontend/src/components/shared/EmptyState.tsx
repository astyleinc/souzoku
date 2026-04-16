import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="py-16 text-center">
      <Icon className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
      <p className="text-base font-medium text-neutral-500 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-neutral-400 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
