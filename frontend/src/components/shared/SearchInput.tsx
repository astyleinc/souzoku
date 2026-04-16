import { Search } from 'lucide-react'

type SearchInputProps = {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SearchInput = ({
  placeholder = '検索...',
  className = '',
  value,
  onChange,
}: SearchInputProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl w-full bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
      />
    </div>
  )
}
