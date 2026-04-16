import type { LucideIcon } from 'lucide-react'

type SummaryCardProps = {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  value: string
  sub?: string
  subIcon?: LucideIcon
  subColor?: string
}

export const SummaryCard = ({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  sub,
  subIcon: SubIcon,
  subColor,
}: SummaryCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-[18px] h-[18px] ${iconColor}`} />
      </div>
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="price text-2xl text-foreground">{value}</p>
      {sub && (
        SubIcon ? (
          <p className={`text-xs ${subColor ?? 'text-neutral-400'} flex items-center gap-1 mt-1`}>
            <SubIcon className="w-3 h-3" />
            {sub}
          </p>
        ) : (
          <p className="text-xs text-neutral-400 mt-1">{sub}</p>
        )
      )}
    </div>
  )
}
