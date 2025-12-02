"use client"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="h-[685px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse mt-[50px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
      </div>

      {/* Products Section Skeleton */}
      <div className="container-custom py-12">
        {/* Section Title Skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              {/* Image Skeleton */}
              <div className="bg-gray-200 h-48 rounded-lg mb-4" />

              {/* Title Skeleton */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

              {/* Price Skeleton */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>

              {/* Button Skeleton */}
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Brands Section Skeleton */}
      <div className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 h-24 animate-pulse">
                <div className="bg-gray-200 h-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
