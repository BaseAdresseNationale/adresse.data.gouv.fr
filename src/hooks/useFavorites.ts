import { useState, useEffect, useCallback } from 'react'
import { getCommuneWithoutCache } from '@/lib/api-ban'
import { BANCommune } from '@/types/api-ban.types'

interface FavoriteCommune {
  districtID: string
  codeCommune: string
  nomCommune: string
  addedAt: string
}

interface FavoriteCommuneWithData extends FavoriteCommune {
  data?: BANCommune
  loading: boolean
  error?: string
}

interface CachedCommuneData {
  data: BANCommune
  timestamp: number
}

const MAX_FAVORITES = 20
const CACHE_DURATION = 60 * 60 * 1000

const communeDataCache = new Map<string, CachedCommuneData>()

async function getCommuneWithCache(codeCommune: string): Promise<BANCommune> {
  const now = Date.now()
  const cached = communeDataCache.get(codeCommune)

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data
  }

  const data = await getCommuneWithoutCache(codeCommune)
  
  communeDataCache.set(codeCommune, {
    data,
    timestamp: now,
  })

  return data
}

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<FavoriteCommune[]>([])
  const [favoritesWithData, setFavoritesWithData] = useState<FavoriteCommuneWithData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/favorites')
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('User not authenticated')
          setFavorites([])
          return
        }
        throw new Error('Failed to fetch favorites')
      }

      const data = await response.json()
      setFavorites(data.favorites || [])
    }
    catch (error) {
      console.error('Failed to load favorites:', error)
      setFavorites([])
    }
    finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])
  
  useEffect(() => {
    if (favorites.length === 0) {
      setFavoritesWithData([])
      return
    }

    const initialData = favorites.map(fav => ({
      ...fav,
      loading: true,
    }))
    setFavoritesWithData(initialData)

    favorites.forEach(async (fav, index) => {
      try {
        const data = await getCommuneWithCache(fav.codeCommune)
        setFavoritesWithData(prev => {
          const updated = [...prev]
          updated[index] = {
            ...fav,
            data,
            loading: false,
          }
          return updated
        })
      }
      catch (error: any) {
        setFavoritesWithData(prev => {
          const updated = [...prev]
          updated[index] = {
            ...fav,
            loading: false,
            error: error?.message || 'Erreur de chargement',
          }
          return updated
        })
      }
    })
  }, [favorites])
  
  const addFavorite = useCallback(async (codeCommune: string) => {
    if (favorites.length >= MAX_FAVORITES) {
      throw new Error(`Vous ne pouvez pas ajouter plus de ${MAX_FAVORITES} communes favorites`)
    }

    if (favorites.some(f => f.codeCommune === codeCommune)) {
      throw new Error('Cette commune est déjà dans vos favoris')
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeCommune,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add favorite')
      }

      await fetchFavorites()
    }
    catch (error: any) {
      console.error('Failed to add favorite:', error)
      throw error
    }
  }, [favorites, fetchFavorites])
  
  const removeFavorite = useCallback(async (districtID: string) => {
    try {
      const response = await fetch(`/api/favorites/${districtID}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove favorite')
      }

      await fetchFavorites()
    }
    catch (error: any) {
      console.error('Failed to remove favorite:', error)
      throw error
    }
  }, [fetchFavorites])
  
  const isFavorite = useCallback((identifier: string) => {
    return favorites.some(f => f.districtID === identifier || f.codeCommune === identifier)
  }, [favorites])
  
  return {
    favorites: favoritesWithData,
    addFavorite,
    removeFavorite,
    isFavorite,
    count: favorites.length,
    maxReached: favorites.length >= MAX_FAVORITES,
    isLoading,
  }
}
