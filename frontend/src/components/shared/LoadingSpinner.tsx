import { Loader2 } from 'lucide-react'

type LoadingSpinnerProps = {
  // 表示サイズ。デフォルトはリスト待機用の `md`。
  size?: 'sm' | 'md' | 'lg'
  // 垂直余白の調整。ページ中央配置は `page`、インラインは `inline`。
  variant?: 'page' | 'inline'
  // 補助テキスト（任意）。読み込み中の文言を添えたい場面で使う。
  label?: string
  className?: string
}

const SIZE_CLASS = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

// ページ全体・セクション単位のローディング表示を共通化するコンポーネント。
// `<div className="flex items-center justify-center py-20"><Loader2 ...></div>` の定型を一箇所にまとめる。
// ボタン内や小領域で使う場合は variant="inline"、ページ初期ロードは variant="page"。
export const LoadingSpinner = ({
  size = 'md',
  variant = 'page',
  label,
  className = '',
}: LoadingSpinnerProps) => {
  const wrapper = variant === 'page'
    ? 'flex flex-col items-center justify-center py-20 gap-3'
    : 'inline-flex items-center gap-2'

  return (
    <div className={`${wrapper} ${className}`}>
      <Loader2 className={`${SIZE_CLASS[size]} animate-spin text-neutral-300`} />
      {label && <span className="text-sm text-neutral-400">{label}</span>}
    </div>
  )
}
