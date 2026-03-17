import { useState, useEffect, useCallback } from 'react'
import { redirectToLogoutOnSessionExpired } from '@/utils/sessionExpired'

interface FavoriteCommune {
  districtID: string
  codeCommune: string
  nomCommune: string
  addedAt: string
}

const MAX_FAVORITES = 1000

export interface UseFavoritesOptions {
  /** Si false, le chargement des favoris n'est pas lancé (ex. en attente d'init session). Défaut true. */
  enabled?: boolean
}

export function useFavorites(userId?: string, options?: UseFavoritesOptions) {
  const enabled = options?.enabled !== false
  const [favorites, setFavorites] = useState<FavoriteCommune[]>([])
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
          redirectToLogoutOnSessionExpired()
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
    if (!enabled) {
      setIsLoading(false)
      return
    }
    fetchFavorites()
  }, [fetchFavorites, enabled])

  const addFavorite = useCallback(async (codeCommune: string, options?: { skipRefresh?: boolean }) => {
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
        if (response.status === 401) {
          redirectToLogoutOnSessionExpired()
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add favorite')
      }

      if (!options?.skipRefresh) {
        await fetchFavorites()
      }
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
        if (response.status === 401) {
          redirectToLogoutOnSessionExpired()
          return
        }
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
    favorites,
    addFavorite,
    removeFavorite,
    refreshFavorites: fetchFavorites,
    isFavorite,
    count: favorites.length,
    maxReached: favorites.length >= MAX_FAVORITES,
    isLoading,
  }
}
