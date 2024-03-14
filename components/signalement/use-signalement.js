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
      return address.nom
    case 'voie':
      return address.nomVoie
    case 'lieu-dit':
      return address.nom
    default:
      return `${address.numero} ${address.suffixe || ''} ${address.voie.nomVoie}`
  }
}

export function getExistingLocation(address) {
  switch (address.type) {
    // In this case type = LOCATION_TO_CREATE
    case 'commune':
      return ''
    case 'voie':
      return 'VOIE'
    case 'lieu-dit':
      return 'TOPONYME'
    default:
      return {
        type: 'NUMERO',
        numero: address.numero,
        suffixe: address.suffixe,
        toponyme: {
          type: 'VOIE',
          nom: address.voie.nomVoie
        }
      }
  }
}

export const getInitialSignalement = (signalementType, address) => {
  if (!address) {
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
      nomVoie: address.voie.nomVoie,
      positions: [],
      parcelles: []
    }
  } else if (signalementType === 'LOCATION_TO_UPDATE') {
    initialSignalement.changesRequested = {
      numero: address.numero,
      suffixe: address.suffixe,
      nomVoie: address.voie.nomVoie,
      positions: address.positions,
      parcelles: address.parcelles
    }
  } else if (signalementType === 'LOCATION_TO_DELETE') {
    initialSignalement.changesRequested = {
      comment: ''
    }
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
    onEditSignalement,
    isEditParcellesMode,
    setIsEditParcellesMode
  }
}
