import ParcellesList from './ParcellesList'

import {
  PopupWrapper,
  PopupVoieWrapper,
  BadgeIcon,
} from './Popups.styles'

interface PropsPopupNumero {
  numero?: string
  suffixe?: string
  parcelles: string
  lieuDitComplementNom: string
  nomVoie: string
  nomCommune: string
  codeCommune: string
  sourcePosition: 'bal' | string
  certifie: boolean
}

interface PorpsPopupVoie {
  nomVoie: string
  nomCommune: string
  codeCommune: string
  parcelles: string
  nbNumeros: number
  type: string
}

interface PopupFeatureProperties extends PropsPopupNumero, PorpsPopupVoie {
  id: string
  nomVoie: string
}

export interface PopupFeature {
  id: string
  properties?: PopupFeatureProperties
  nom?: string
}

function PopupNumero(properties: PropsPopupNumero) {
  const {
    numero,
    suffixe,
    parcelles,
    lieuDitComplementNom,
    nomVoie,
    nomCommune,
    codeCommune,
    sourcePosition,
    certifie,
  } = properties

  return (
    <PopupWrapper>
      <div className="heading">
        <b>{numero}{suffixe} {nomVoie}</b>
      </div>
      {
        lieuDitComplementNom && (
          <p>{lieuDitComplementNom}</p>
        )
      }
      <div className="commune">{nomCommune} - (COG&nbsp;{codeCommune})</div>

      <div>
        <span className={`fr-badge fr-badge--no-icon ${sourcePosition === 'bal' ? 'fr-badge--success' : 'fr-badge--grey'}`}>
          <BadgeIcon className={sourcePosition === 'bal' ? 'ri-shield-star-fill' : 'ri-government-fill'} />
          {sourcePosition === 'bal' ? 'BAL' : 'Assemblage IGN'}
        </span>{' '}
        <span className={`fr-badge fr-badge--no-icon ${certifie ? 'fr-badge--success' : 'fr-badge--grey'}`}>
          <BadgeIcon className={certifie ? 'ri-shield-check-fill' : 'ri-forbid-fill'} />
          {certifie ? 'Certifiée' : 'Non certifiée'}
        </span>
      </div>

      {parcelles && <ParcellesList parcelles={parcelles.split('|')} />}
    </PopupWrapper>
  )
}

function PopupVoie({ nomVoie, nomCommune, codeCommune, parcelles, nbNumeros, type }: PorpsPopupVoie) {
  return (
    <PopupVoieWrapper>
      <div className="heading">
        <div className="address">
          <div><b>{nomVoie}</b></div>
          <div>{nomCommune} {codeCommune}</div>
        </div>
        <div>
        </div>
      </div>

      {parcelles && <ParcellesList parcelles={parcelles.split('|')} />}

      {nbNumeros && (
        <div>Cette voie contient <b>{nbNumeros} numéro{nbNumeros > 1 ? 's' : ''}</b></div>
      )}
    </PopupVoieWrapper>
  )
}

export default function PopupFeatures({ features }: { features: PopupFeature[] }) {
  return features.map(({ properties }) => properties
    ? (
        <div key={properties.id}>
          {properties?.type
            ? (
                <PopupVoie {...properties} />
              )
            : (
                <PopupNumero {...properties} />
              )}
        </div>
      )
    : null)
}
