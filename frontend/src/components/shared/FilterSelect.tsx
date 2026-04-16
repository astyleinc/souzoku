type FilterSelectProps = {
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const FilterSelect = ({
  options,
  placeholder = 'すべて',
  className = '',
  value,
  onChange,
}: FilterSelectProps) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
