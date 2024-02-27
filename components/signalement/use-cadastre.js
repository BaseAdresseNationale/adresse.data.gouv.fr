
import {useCallback, useMemo, useEffect, useState} from 'react'

export const useCadastre = ({map, parcelles, handleEditParcelle}) => {
  const [hoveredParcelle, setHoveredParcelle] = useState(null)

  console.log(map)
  useEffect(() => {
    console.log('hoveredParcelle', hoveredParcelle)
  }, [hoveredParcelle])

  const cadastreFiltre = useMemo(() => parcelles ? ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])] : ['==', ['get', 'id'], ''], [parcelles])

  const handleMouseMove = useCallback(
    e => {
      if (e.features.length > 0) {
        if (hoveredParcelle) {
          map.current.setFeatureState(
            {source: 'cadastre', sourceLayer: 'parcelle-hovered', id: hoveredParcelle},
            {hover: false}
          )
        }

        setHoveredParcelle(e.features[0].id)
        map.current.setFeatureState(
          {source: 'cadastre', sourceLayer: 'parcelle-hovered', id: hoveredParcelle},
          {hover: true}
        )
      }
    },
    [map, hoveredParcelle]
  )

  const handleMouseLeave = useCallback(
    () => {
      if (hoveredParcelle) {
        map.current.setFeatureState(
          {source: 'cadastre', sourceLayer: 'parcelle-hovered', id: hoveredParcelle},
          {hover: false}
        )
      }

      setHoveredParcelle(null)
    },
    [map, hoveredParcelle]
  )

  const handleSelectParcelle = useCallback(
    e => {
      console.log('e', e)
      if (map && e && e.features && e.features.length > 0) {
        const selected = e.features[0].id
        if (parcelles.includes(selected)) {
          handleEditParcelle(parcelles.filter(id => id !== selected))
        } else {
          handleEditParcelle([...parcelles, selected])
        }
      }
    },
    [map, parcelles, handleEditParcelle]
  )

  useEffect(() => {
    map.current.on('mousemove', 'parcelle-hovered', handleMouseMove)
    map.current.on('mouseleave', 'parcelle-hovered', () => handleMouseLeave)
    map.current.on('click', 'parcelle-hovered', handleSelectParcelle)
    return () => {
      map.current.off('mousemove', 'parcelle-hovered', handleMouseMove)
      map.current.off('mouseleave', 'parcelle-hovered', () => handleMouseLeave)
      map.current.off('click', 'parcelle-hovered', handleSelectParcelle)
    }
  }, [map, handleMouseMove, handleSelectParcelle, handleMouseLeave])

  return {
    cadastreFiltre
  }
}
