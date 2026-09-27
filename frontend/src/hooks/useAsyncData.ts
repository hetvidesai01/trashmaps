import { useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
}

export function useAsyncData<T>(loader: () => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    loader().then((result) => {
      if (isActive) {
        setData(result)
        setIsLoading(false)
      }
    })
    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, isLoading }
}
