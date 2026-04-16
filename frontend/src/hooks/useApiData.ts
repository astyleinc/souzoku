'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

type UseApiDataResult<T> = {
  data: T | null
  isLoading: boolean
  error: string | null
}

export const useApiData = <T>(path: string): UseApiDataResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setError(null)
      const result = await api.get<T>(path)
      if (cancelled) return

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error.message)
      }
      setIsLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [path])

  return { data, isLoading, error }
}
