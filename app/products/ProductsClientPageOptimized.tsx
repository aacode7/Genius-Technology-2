"use client"

import { useState, useMemo, useCallback } from "react"
import { useProductsPaginated } from "@/lib/firebase-hooks-optimized"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product/filters/product-filters"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { ListFilter, Grid3X3, List, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsClientPageOptimized() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useProductsPaginated()

  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: [0, 100000],
    rating: 0,
    inStock: false,
    specifications: {} as Record<string, string[]>,
  })
  const [sortBy, setSortBy] = useState("relevance")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Flatten paginated data
  const allProducts = useMemo(() => {
    if (!data) return []
    return data.pages.flatMap(page => page.products)
  }, [data])

  // Extract unique categories from products
  const categories = useMemo(() => {
    if (allProducts.length === 0) return []

    const uniqueCategories = Array.from(
      new Set(allProducts.map(product => product.category).filter(Boolean))
    ).map((category, index) => ({
      id: `cat-${index}`,
      name: category as string,
      slug: category as string,
      description: '',
      image: "",
      isActive: true,
      productCount: allProducts.filter(p => p.category === category).length
    }))

    return uniqueCategories
  }, [allProducts])

  // Extract available specifications
  const availableSpecifications = useMemo(() => {
    const specs: Record<string, Set<string>> = {}
    allProducts.forEach((product) => {
      if (product.specifications) {
        for (const key in product.specifications) {
          if (product.specifications.hasOwnProperty(key)) {
            if (!specs[key]) {
              specs[key] = new Set()
            }
            specs[key].add(product.specifications[key])
          }
        }
      }
    })
    const result: Record<string, string[]> = {}
    for (const key in specs) {
      result[key] = Array.from(specs[key]).sort()
    }
    return result
  }, [allProducts])

  // Available brands
  const availableBrands = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean)))
  }, [allProducts])

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !filters.category || product.category === filters.category
      const matchesBrand = !filters.brand || product.brand === filters.brand
      const matchesPrice =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      const matchesRating = !filters.rating || (product.rating || 0) >= filters.rating
      const matchesStock = !filters.inStock || product.inStock

      const matchesSpecs = Object.entries(filters.specifications).every(([key, values]) => {
        if (values.length === 0) return true
        return product.specifications && values.includes(product.specifications[key])
      })

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesRating &&
        matchesStock &&
        matchesSpecs
      )
    })
  }, [allProducts, searchQuery, filters])

  // Sort logic
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case "newest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
      default:
        return sorted
    }
  }, [filteredProducts, sortBy])

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading products</p>
          <p className="text-gray-600">Please try again later</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-gray-500">All Products</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header with Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold">All Products</h1>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="md:hidden"
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by: {sortBy === "relevance" ? "Relevance" : sortBy === "price-asc" ? "Price: Low to High" : sortBy === "price-desc" ? "Price: High to Low" : sortBy === "newest" ? "Newest" : "Rating"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("relevance")}>Relevance</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-asc")}>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-desc")}>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("rating")}>Rating</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600">
            Showing {sortedProducts.length} of {allProducts.length} products
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                brands={availableBrands}
                specifications={availableSpecifications}
                maxPrice={Math.max(...allProducts.map((p) => p.price || 0), 10000)}
              />
            </div>
          </aside>

          {/* Mobile Filter Panel */}
          {isFilterPanelOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
              <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-lg overflow-y-auto">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterPanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <ProductFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    categories={categories}
                    brands={availableBrands}
                    specifications={availableSpecifications}
                    maxPrice={Math.max(...allProducts.map((p) => p.price || 0), 10000)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </Card>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600 text-lg">No products found matching your criteria</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setFilters({
                      category: "",
                      brand: "",
                      priceRange: [0, 100000],
                      rating: 0,
                      inStock: false,
                      specifications: {},
                    })
                    setSearchQuery("")
                  }}
                >
                  Clear all filters
                </Button>
              </Card>
            ) : (
              <>
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      size="lg"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading more...
                        </>
                      ) : (
                        'Load More Products'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
