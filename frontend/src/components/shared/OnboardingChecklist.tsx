'use client'

import { useState } from 'react'
import {
  CheckCircle,
  Circle,
  X,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

type ChecklistItem = {
  label: string
  href: string
  completed: boolean
}

type OnboardingChecklistProps = {
  items: ChecklistItem[]
}

export const OnboardingChecklist = ({ items }: OnboardingChecklistProps) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const completedCount = items.filter((i) => i.completed).length
  const progress = Math.round((completedCount / items.length) * 100)

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-semibold">はじめにやること</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {completedCount}/{items.length} 完了
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-neutral-300 hover:text-neutral-500 transition-colors"
          aria-label="閉じる"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* プログレスバー */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full mb-4">
        <div
          className="h-1.5 bg-primary-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* チェックリスト */}
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-50 transition-colors group"
          >
            {item.completed ? (
              <CheckCircle className="w-4 h-4 text-success-500 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
            )}
            <span className={`text-sm flex-1 ${item.completed ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
              {item.label}
            </span>
            {!item.completed && (
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0" />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
