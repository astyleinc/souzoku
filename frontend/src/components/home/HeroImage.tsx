'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

export const HeroImage = ({ src, alt, className, priority, sizes }: Props) => {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      className={[
        className ?? '',
        'transition-opacity duration-700 ease-out',
        loaded ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    />
  )
}
