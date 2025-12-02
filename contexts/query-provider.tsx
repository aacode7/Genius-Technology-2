'use client'

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { ReactNode, useState, useEffect } from 'react'
import { NavigationPreloaderOptimized } from '@/lib/instant-navigation-optimized'

function NavigationSetup() {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Initialize instant navigation with React Query integration
    const preloader = NavigationPreloaderOptimized.getInstance()
    preloader.initialize(queryClient)
  }, [queryClient])

  return null
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationSetup />
      {children}
    </QueryClientProvider>
  )
}
