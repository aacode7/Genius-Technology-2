"use client"

import React, { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useInstantNavigationOptimized } from "@/lib/instant-navigation-optimized"

interface LayoutClientWrapperProps {
  children: React.ReactNode
}

export function LayoutClientWrapper({ children }: LayoutClientWrapperProps) {
  const queryClient = useQueryClient()
  const { initialize } = useInstantNavigationOptimized(queryClient)

  useEffect(() => {
    // Initialize instant navigation with React Query integration
    initialize()
  }, [initialize])

  return <>{children}</>
}
