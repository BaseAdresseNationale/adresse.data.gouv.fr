import React, { useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'

interface FavoriteButtonProps {
  districtID: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  priority?: 'primary' | 'secondary' | 'tertiary' | 'tertiary no outline'
}

export function FavoriteButton({
  districtID,
  className,
  size = 'small',
  priority = 'tertiary no outline',
}: FavoriteButtonProps) {
  const { userInfo } = useAuth()
  const { addFavorite, removeFavorite, isFavorite, maxReached } = useFavorites(userInfo?.sub)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isFav = isFavorite(districtID)

  const handleClick = async () => {
    setError(null)
    setIsLoading(true)

    try {
      if (isFav) {
        await removeFavorite(districtID)
      }
      else {
        if (maxReached) {
          throw new Error('Vous avez atteint la limite de 20 communes favorites')
        }
        await addFavorite(districtID)
      }
    }
    catch (e: any) {
      setError(e.message || 'Une erreur est survenue')
      console.error('Favorite toggle error:', e)

      // Afficher l'erreur dans un toast (optionnel, tu peux utiliser une lib comme react-hot-toast)
      // toast.error(e.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  if (!userInfo) {
    // L'utilisateur n'est pas connecté, ne pas afficher le bouton
    return null
  }

  return (
    <div>
      <Button
        iconId={isFav ? 'fr-icon-star-fill' : 'fr-icon-star-line'}
        priority={priority}
        size={size}
        onClick={handleClick}
        disabled={isLoading || (!isFav && maxReached)}
        title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className={className}
      >
        {isFav ? 'Favori' : 'Ajouter aux favoris'}
      </Button>
      {error && (
        <p className="fr-error-text fr-text--sm fr-mt-1w">
          {error}
        </p>
      )}
    </div>
  )
}
