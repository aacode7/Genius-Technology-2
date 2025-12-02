"use client"

import { QueryClient } from '@tanstack/react-query'

// NavigationPreloader for React Query integration
export class NavigationPreloaderOptimized {
  private static instance: NavigationPreloaderOptimized
  private preloadQueue: Set<string> = new Set()
  private queryClient: QueryClient | null = null

  static getInstance(): NavigationPreloaderOptimized {
    if (!NavigationPreloaderOptimized.instance) {
      NavigationPreloaderOptimized.instance = new NavigationPreloaderOptimized()
    }
    return NavigationPreloaderOptimized.instance
  }

  setQueryClient(client: QueryClient): void {
    this.queryClient = client
  }

  // Preload product data using React Query
  async preloadProduct(productId: string): Promise<void> {
    if (!this.queryClient) return

    const dataKey = `product_${productId}`
    if (this.preloadQueue.has(dataKey)) return
    this.preloadQueue.add(dataKey)

    try {
      // Prefetch will use React Query cache
      await this.queryClient.prefetchQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
          const { getmobileCollection } = await import('./firebase-collections')
          return await getmobileCollection(productId)
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
      })
    } catch (error) {
      // Silently fail - not critical
    } finally {
      this.preloadQueue.delete(dataKey)
    }
  }

  // Preload category data using React Query
  async preloadCategory(category: string): Promise<void> {
    if (!this.queryClient) return

    const dataKey = `category_${category}`
    if (this.preloadQueue.has(dataKey)) return
    this.preloadQueue.add(dataKey)

    try {
      await this.queryClient.prefetchInfiniteQuery({
        queryKey: ['products', 'category', category],
        queryFn: async () => {
          // This will prefetch the first page only
          const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore')
          const { db } = await import('./firebase')

          const mobileCollection = collection(db, 'mobile')
          const q = query(
            mobileCollection,
            where('Category', '==', category),
            orderBy('createdAt', 'desc'),
            limit(20)
          )
          const snapshot = await getDocs(q)

          return {
            products: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            lastDoc: snapshot.docs[snapshot.docs.length - 1],
            hasMore: snapshot.docs.length === 20
          }
        },
        initialPageParam: null,
        staleTime: 1000 * 60 * 5,
      })
    } catch (error) {
      // Silently fail
    } finally {
      this.preloadQueue.delete(dataKey)
    }
  }

  // Preload product list images
  preloadImages(imageUrls: string[]): void {
    if (typeof window === 'undefined') return

    // Limit to first 6 images to avoid overwhelming the browser
    const urlsToPreload = imageUrls.slice(0, 6)

    urlsToPreload.forEach((url, index) => {
      // Stagger preloading
      setTimeout(() => {
        const img = new Image()
        img.src = url
      }, index * 100) // 100ms delay between each
    })
  }

  // Handle link hover for preloading
  handleLinkHover(href: string): void {
    try {
      const url = new URL(href, window.location.origin)
      const pathSegments = url.pathname.split('/').filter(Boolean)

      // Handle mobile product pages
      if (pathSegments[0] === 'mobile' && pathSegments[1]) {
        this.preloadProduct(decodeURIComponent(pathSegments[1]))
      }

      // Handle category pages
      if (pathSegments[0] === 'category' && pathSegments[1]) {
        this.preloadCategory(decodeURIComponent(pathSegments[1]))
      }

      // Handle products by category
      if (pathSegments[0] === 'products' && pathSegments[1]) {
        this.preloadCategory(decodeURIComponent(pathSegments[1]))
      }
    } catch (error) {
      // Invalid URL, ignore
    }
  }

  // Smart preloading based on user behavior
  setupHoverPreloading(): void {
    if (typeof window === 'undefined') return

    // Throttle hover events to avoid excessive preloading
    let hoverTimeout: NodeJS.Timeout | null = null

    // Preload on link hover (with 150ms delay to avoid accidental hovers)
    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement

      if (link && link.href) {
        if (hoverTimeout) clearTimeout(hoverTimeout)
        hoverTimeout = setTimeout(() => {
          this.handleLinkHover(link.href)
        }, 150)
      }
    })

    // Clear timeout on mouseout
    document.addEventListener('mouseout', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement

      if (link && hoverTimeout) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }
    })

    // Preload on touch start (mobile) - instant, no delay
    document.addEventListener('touchstart', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement

      if (link && link.href) {
        this.handleLinkHover(link.href)
      }
    }, { passive: true })
  }

  // Initialize preloading system
  initialize(queryClient?: QueryClient): void {
    if (queryClient) {
      this.setQueryClient(queryClient)
    }
    this.setupHoverPreloading()
  }
}

// Hook for instant navigation with React Query
export function useInstantNavigationOptimized(queryClient?: QueryClient) {
  const preloader = NavigationPreloaderOptimized.getInstance()

  if (queryClient) {
    preloader.setQueryClient(queryClient)
  }

  return {
    preloadProduct: (id: string) => preloader.preloadProduct(id),
    preloadCategory: (category: string) => preloader.preloadCategory(category),
    preloadImages: (urls: string[]) => preloader.preloadImages(urls),
    initialize: () => preloader.initialize(queryClient)
  }
}
