"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { QueryProvider } from "@/contexts/query-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { useInstantNavigation } from "@/lib/instant-navigation"

// Lazy load heavy components
const CartProvider = dynamic(() => import("@/contexts/cart-context").then(mod => ({ default: mod.CartProvider })), { ssr: false })
const WishlistProvider = dynamic(() => import("@/contexts/wishlist-context").then(mod => ({ default: mod.WishlistProvider })), { ssr: false })
const ComparisonProvider = dynamic(() => import("@/contexts/comparison-context").then(mod => ({ default: mod.ComparisonProvider })), { ssr: false })
const BackgroundPatterns = dynamic(() => import("@/components/shared/background-patterns").then(mod => ({ default: mod.BackgroundPatterns })), { ssr: false })
const MobilePerformanceOptimizer = dynamic(() => import("@/components/shared/mobile-performance-optimizer").then(mod => ({ default: mod.MobilePerformanceOptimizer })), { ssr: false })
const PerformanceMonitor = dynamic(() => import("@/components/shared/performance-monitor").then(mod => ({ default: mod.PerformanceMonitor })), { ssr: false })
const Header = dynamic(() => import("@/components/layout/header").then(mod => ({ default: mod.Header })), { ssr: true, loading: () => <div className="h-20 bg-white" /> })
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => ({ default: mod.Footer })), { ssr: true, loading: () => <div className="h-32 bg-gray-50" /> })

interface LayoutClientProps {
  children: React.ReactNode
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [isMobile, setIsMobile] = useState(false)
  const { initialize } = useInstantNavigation()
  const pathname = usePathname()

  // Pages where Header and Footer should be hidden
  const authPages = ['/login', '/register']
  const isAuthPage = authPages.includes(pathname)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Initialize instant navigation
    initialize()

    // Optimize page transitions with will-change hints
    if (!isAuthPage) {
      document.body.style.willChange = 'contents'

      // Cleanup after a short delay
      const timeout = setTimeout(() => {
        document.body.style.willChange = 'auto'
      }, 1000)

      return () => {
        clearTimeout(timeout)
        window.removeEventListener('resize', checkMobile)
      }
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [initialize, isAuthPage])

  return (
    <>
      {/* Only load performance monitors in development */}
      {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
      <MobilePerformanceOptimizer />
      {/* Disable background patterns for auth pages to improve performance */}
      {!isAuthPage && <BackgroundPatterns variant={isMobile ? "mobile" : "default"} />}
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                <div className="flex flex-col min-h-screen">
                  {!isAuthPage && <Header />}
                  <main className="flex-grow">
                    {children}
                  </main>
                  {!isAuthPage && <Footer />}
                </div>
                <Toaster />
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </>
  )
}
