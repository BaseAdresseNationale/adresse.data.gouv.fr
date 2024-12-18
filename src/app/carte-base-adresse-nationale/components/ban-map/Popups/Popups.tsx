import PlotsList from './PlotsList'

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

  console.log('properties >>>', properties)

  return (
    <PopupWrapper>
      <div className="heading">
        <div>
          <span className={`addr-num ${suffixe ? 'with-suffix' : ''}`}>
            {numero}
            {suffixe && <span className="addr-num-suffix">{suffixe}</span>}
            {' '}
          </span>
          <span className="addr-main-topo">{nomVoie}</span>
        </div>
        {
          lieuDitComplementNom && (
            <div className="addr-secondary-topo">{lieuDitComplementNom}{', '}</div>
          )
        }
        <div className="addr-district">
          <span className="addr-district-prefix">Commune de </span>
          {nomCommune} - (<span className="addr-district-cog-prefix">COG&nbsp;</span>{codeCommune})
        </div>
      </div>

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

      {parcelles && <PlotsList plots={parcelles.split('|')} />}
    </PopupWrapper>
  )
}

function PopupVoie({ nomVoie, nomCommune, codeCommune, parcelles, nbNumeros }: PorpsPopupVoie) {
  return (
    <PopupVoieWrapper>
      <div className="heading">
        <div className="addr-main-topo">{nomVoie}</div>
        <div className="addr-district">
          <span className="addr-district-prefix">Commune de </span>
          {nomCommune} - (COG&nbsp;{codeCommune})
        </div>

      </div>

      {parcelles && <PlotsList plots={parcelles.split('|')} />}

      <div className='toponym-desc'>
      {
        nbNumeros
          ? <><b>{nbNumeros} {nbNumeros > 1 ? 'adresses' : 'adresse'}</b> sur cet odonyme</>
          : <>Odonyme sans adresse</>
      }
      </div>
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
