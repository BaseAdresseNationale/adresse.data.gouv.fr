import {useState} from 'react'

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

export const isSignalementAvailable = address => {
  return (address?.type === 'voie' || address?.type === 'lieu-dit' || address?.type === 'numero')
}

export const getPositionTypeLabel = positionType => {
  return positionTypeOptions.find(({value}) => value === positionType).label
}

export function getExistingLocationType(type) {
  switch (type) {
    case 'voie':
      return 'VOIE'
    case 'lieu-dit':
      return 'TOPONYME'
    case 'numero':
      return 'NUMERO'
    default:
      throw new Error(`Impossible de créer un signalement pour le type : ${type}`)
  }
}

export function getExistingLocationLabel(address) {
  switch (address.type) {
    case 'voie':
      return address.nomVoie
    case 'lieu-dit':
      return address.nomVoie
    case 'numero':
      return `${address.numero} ${address.suffixe || ''} ${address.voie.nomVoie}`
    default:
      throw new Error(`Impossible de créer un signalement pour le type : ${address.type}`)
  }
}

export function getExistingLocation(address) {
  switch (address.type) {
    case 'voie':
      return {
        type: 'VOIE',
        nom: address.nomVoie
      }
    case 'lieu-dit':
      return {
        type: 'TOPONYME',
        nom: address.nomVoie,
        position: {
          point: {
            type: 'Point',
            coordinates: [address.lon, address.lat]
          },
          type: address.positionType
        },
        parcelles: address.parcelles,
      }
    case 'numero':
      return {
        type: 'NUMERO',
        numero: address.numero,
        suffixe: address.suffixe,
        position: {
          point: {
            type: 'Point',
            coordinates: [address.lon, address.lat]
          },
          type: address.positionType
        },
        parcelles: address.parcelles,
        toponyme: {
          type: 'VOIE',
          nom: address.voie.nomVoie
        }
      }
    default:
      throw new Error(`Impossible de créer un signalement pour le type : ${address.type}`)
  }
}

export const getInitialSignalement = (signalementType, address) => {
  if (!address || !isSignalementAvailable(address)) {
    return null
  }

  const initialSignalement = {
    type: signalementType,
    codeCommune: address.commune.code,
    author: {
      firstName: '',
      lastName: '',
      email: ''
    },
    changesRequested: {}
  }

  if (signalementType === 'LOCATION_TO_CREATE') {
    initialSignalement.changesRequested = {
      numero: '',
      suffixe: '',
      nomVoie: address.nomVoie,
      positions: [],
      parcelles: []
    }
    initialSignalement.existingLocation = {
      type: 'VOIE',
      nom: address.nomVoie
    }
  } else if (signalementType === 'LOCATION_TO_UPDATE') {
    if (address.type === 'voie') {
      initialSignalement.changesRequested = {
        nom: address.nomVoie,
      }
    } else if (address.type === 'lieu-dit') {
      initialSignalement.changesRequested = {
        nom: address.nomVoie,
        // For the moment we don't allow to change the position of a toponyme
        // positions: address.positions,
        // parcelles: address.parcelles
      }
    } else {
      initialSignalement.changesRequested = {
        numero: address.numero,
        suffixe: address.suffixe,
        nomVoie: address.voie.nomVoie,
        positions: address.positions.map(({position, positionType}) => ({
          point: {
            type: 'Point',
            coordinates: [...position.coordinates]
          },
          type: positionType
        })),
        parcelles: address.parcelles
      }
    }

    initialSignalement.existingLocation = getExistingLocation(address)
  } else if (signalementType === 'LOCATION_TO_DELETE') {
    initialSignalement.changesRequested = {
      comment: ''
    }
    initialSignalement.existingLocation = getExistingLocation(address)
  }

  return initialSignalement
}

export function useSignalement(address) {
  const [signalement, setSignalement] = useState(null)
  const [isEditParcellesMode, setIsEditParcellesMode] = useState(false)

  const createSignalement = signalementType => {
    setSignalement(getInitialSignalement(signalementType, address))
  }

  const deleteSignalement = () => {
    setSignalement(null)
  }

  const onEditSignalement = (property, key) => value => {
    setSignalement(state => ({...state, [property]: {
      ...state[property],
      [key]: value
    }}))
  }

  return {
    createSignalement,
    deleteSignalement,
    signalement,
    isSignalementAvailable: isSignalementAvailable(address),
    onEditSignalement,
    isEditParcellesMode,
    setIsEditParcellesMode
  }
}