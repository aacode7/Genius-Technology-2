'use client'

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { collection, query, where, orderBy, limit, startAfter, getDocs, DocumentSnapshot, QueryConstraint } from 'firebase/firestore'
import { db } from './firebase'

const PRODUCTS_PER_PAGE = 20

// Transform raw Firebase data to Product format
const transformProduct = (rawData: any) => {
  return {
    ...rawData,
    name: rawData.name || rawData.Name || rawData.title || rawData.Title || rawData.productName || rawData.ProductName || rawData.id || 'Unnamed Product',
    description: rawData.description || rawData.Description || rawData.details || rawData.Details || rawData.desc || rawData.Desc || '',

    price: (() => {
      const priceValue = rawData.price || rawData.Price || rawData.salePrice || rawData.SalePrice || rawData.currentPrice || rawData.CurrentPrice || 0
      return Number(priceValue) || 0
    })(),

    originalPrice: (() => {
      const originalValue = rawData.originalPrice || rawData.OriginalPrice || rawData.mrp || rawData.MRP || rawData.listPrice || rawData.ListPrice || 0
      return Number(originalValue) || 0
    })(),

    images: (() => {
      const imageFields = [
        rawData.images, rawData.Images, rawData.imageUrls, rawData.ImageUrls,
        rawData.photos, rawData.Photos, rawData.gallery, rawData.Gallery
      ].filter(Boolean)

      if (imageFields.length > 0) {
        const firstImageField = imageFields[0]
        if (Array.isArray(firstImageField)) {
          return firstImageField.filter(img =>
            img && typeof img === 'string' && img.trim().length > 0 && img.startsWith('https://')
          )
        }
      }

      const singleImageFields = [
        rawData.image, rawData.Image, rawData.thumbnail, rawData.Thumbnail,
        rawData.mainImage, rawData.MainImage
      ]

      for (const field of singleImageFields) {
        if (field && typeof field === 'string' && field.startsWith('https://')) {
          return [field]
        }
      }

      return []
    })(),

    category: rawData.category || rawData.Category || rawData.type || rawData.Type || 'Uncategorized',
    brand: rawData.brand || rawData.Brand || rawData.manufacturer || rawData.Manufacturer || 'Unknown',
    stock: Number(rawData.stock || rawData.Stock || rawData.quantity || rawData.Quantity || 0),
    rating: Number(rawData.rating || rawData.Rating || rawData.avgRating || rawData.AvgRating || 0),
    reviewCount: Number(rawData.reviewCount || rawData.ReviewCount || rawData.reviews || rawData.Reviews || 0),
    featured: rawData.featured || rawData.Featured || rawData.isFeatured || rawData.IsFeatured || false,
  }
}

// Paginated products query
export const useProductsPaginated = (pageSize = PRODUCTS_PER_PAGE) => {
  return useInfiniteQuery({
    queryKey: ['products', 'paginated'],
    queryFn: async ({ pageParam = null }) => {
      const mobileCollection = collection(db, 'mobile')
      const constraints: QueryConstraint[] = [
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      ]

      if (pageParam) {
        constraints.push(startAfter(pageParam))
      }

      const q = query(mobileCollection, ...constraints)
      const snapshot = await getDocs(q)

      const products = snapshot.docs.map(doc =>
        transformProduct({ id: doc.id, ...doc.data() })
      )

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]

      return {
        products,
        lastDoc,
        hasMore: snapshot.docs.length === pageSize
      }
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Featured products (cached)
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const mobileCollection = collection(db, 'mobile')
      const q = query(
        mobileCollection,
        where('featured', '==', true),
        limit(12)
      )
      const snapshot = await getDocs(q)

      return snapshot.docs.map(doc =>
        transformProduct({ id: doc.id, ...doc.data() })
      )
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Products by category (paginated)
export const useProductsByCategory = (categorySlug: string, pageSize = PRODUCTS_PER_PAGE) => {
  return useInfiniteQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: async ({ pageParam = null }) => {
      const mobileCollection = collection(db, 'mobile')

      // Simple query without orderBy to avoid index requirements
      const constraints: QueryConstraint[] = [
        where('Category', '==', categorySlug),
        limit(pageSize)
      ]

      if (pageParam) {
        constraints.push(startAfter(pageParam))
      }

      const q = query(mobileCollection, ...constraints)
      const snapshot = await getDocs(q)

      const products = snapshot.docs.map(doc =>
        transformProduct({ id: doc.id, ...doc.data() })
      )

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]

      return {
        products,
        lastDoc,
        hasMore: snapshot.docs.length === pageSize
      }
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: null,
    enabled: !!categorySlug,
    staleTime: 1000 * 60 * 5,
  })
}

// Products by brand (paginated)
export const useProductsByBrand = (brandSlug: string, pageSize = PRODUCTS_PER_PAGE) => {
  return useInfiniteQuery({
    queryKey: ['products', 'brand', brandSlug],
    queryFn: async ({ pageParam = null }) => {
      const mobileCollection = collection(db, 'mobile')
      const constraints: QueryConstraint[] = [
        where('Brand', '==', brandSlug),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      ]

      if (pageParam) {
        constraints.push(startAfter(pageParam))
      }

      const q = query(mobileCollection, ...constraints)
      const snapshot = await getDocs(q)

      const products = snapshot.docs.map(doc =>
        transformProduct({ id: doc.id, ...doc.data() })
      )

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]

      return {
        products,
        lastDoc,
        hasMore: snapshot.docs.length === pageSize
      }
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: null,
    enabled: !!brandSlug,
    staleTime: 1000 * 60 * 5,
  })
}

// Categories (cached)
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const categoriesCollection = collection(db, 'categories')
      const snapshot = await getDocs(categoriesCollection)

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
  })
}

// Brands (cached)
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const brandsCollection = collection(db, 'brands')
      const snapshot = await getDocs(brandsCollection)

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - brands don't change often
  })
}

// Trending products (cached)
export const useTrendingProducts = (limitCount = 12) => {
  return useQuery({
    queryKey: ['products', 'trending', limitCount],
    queryFn: async () => {
      const mobileCollection = collection(db, 'mobile')
      const q = query(
        mobileCollection,
        where('featured', '==', true),
        orderBy('rating', 'desc'),
        limit(limitCount)
      )
      const snapshot = await getDocs(q)

      return snapshot.docs.map(doc =>
        transformProduct({ id: doc.id, ...doc.data() })
      )
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
