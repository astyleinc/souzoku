type PriceDisplayProps = {
  price: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'text-base',
  md: 'text-price-md',
  lg: 'text-price-lg',
}

export const PriceDisplay = ({ price, size = 'md' }: PriceDisplayProps) => {
  const formatted = price.toLocaleString()
  return (
    <span className={`price ${sizeStyles[size]} text-foreground`}>
      {formatted}
      <span className="text-sm font-normal text-neutral-400 ml-1">万円</span>
    </span>
  )
}
