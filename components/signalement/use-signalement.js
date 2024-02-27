import {useEffect, useState} from 'react'

export const positionTypeOptions = [
  {value: 'entrée', label: 'Entrée', color: 'green'},
  {value: 'délivrance postale', label: 'Délivrance postale', color: 'blue'},
  {value: 'bâtiment', label: 'Bâtiment', color: 'orange'},
  {value: 'cage d’escalier', label: 'Cage d’escalier', color: 'purple'},
  {value: 'logement', label: 'Logement', color: 'red'},
  {value: 'parcelle', label: 'Parcelle', color: 'yellow'},
  {value: 'segment', label: 'Segment', color: 'black'},
  {value: 'service technique', label: 'Service technique', color: 'grey'},
  {value: 'inconnue', label: 'Inconnu', color: 'white'}
]

export const getPositionTypeLabel = positionType => {
  return positionTypeOptions.find(({value}) => value === positionType).label
}

export function getExistingLocationType(type) {
  switch (type) {
    // In this case type = LOCATION_TO_CREATE
    case 'commune':
      return ''
    case 'voie':
      return 'VOIE'
    case 'lieu-dit':
      return 'TOPONYME'
    default:
      return 'NUMERO'
  }
}

export function getExistingLocationLabel(address) {
  switch (address.type) {
    // In this case type = LOCATION_TO_CREATE
    case 'commune':
      return ''
    case 'voie':
      return 'VOIE'
    case 'lieu-dit':
      return 'TOPONYME'
    default:
      return `${address.numero} ${address.voie.nomVoie}`
  }
}

export const getInitialSignalement = address => {
  let initialSignalement = {}
  if (address) {
    const type = getExistingLocationType(address.type)
    initialSignalement = {
      codeCommune: address.commune.code,
      type: 'LOCATION_TO_UPDATE',
      existingLocation: {
        type,
        label: getExistingLocationLabel(address),
      },
      author: {
        firstName: '',
        lastName: '',
        email: ''
      }
    }

    if (type === 'NUMERO') {
      initialSignalement.changesRequested = {
        numero: address.numero,
        suffixe: address.suffixe,
        positions: address.positions,
        parcelles: address.parcelles,
        nomVoie: address.voie.nomVoie
      }
    } else if (type === 'VOIE') {
      initialSignalement.changesRequested = {
        nomVoie: address.nomVoie
      }
    } else if (type === 'TOPONYME') {
      initialSignalement.changesRequested = {}
    }
  }

  return initialSignalement
}

export function useSignalement(address) {
  const [signalement, setSignalement] = useState(null)
  const [isEditParcellesMode, setIsEditParcellesMode] = useState(false)

  useEffect(() => {
    if (!address || address.type !== 'numero') {
      return
    }

    setSignalement(getInitialSignalement(address))
  }, [address])

  const onEditSignalement = (property, key) => value => {
    setSignalement(state => ({...state, [property]: {
      ...state[property],
      [key]: value
    }}))
  }

  return {
    signalement,
    onEditSignalement,
    isEditParcellesMode,
    setIsEditParcellesMode
  }
}
