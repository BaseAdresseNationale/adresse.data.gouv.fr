import PropTypes from 'prop-types'

import colors from '@/styles/colors'

import Tag from '@/components/tag'
import ParcellesList from '@/components/base-adresse-nationale/parcelles-list'

import {sources} from './layers'

function PopupNumero({numero, suffixe, parcelles, lieuDitComplementNom, nomVoie, nomCommune, codeCommune, sourcePosition}) {
  const position = sources[sourcePosition]

  return (
    <div>
      <div className='heading'>
        <b>{numero}{suffixe} {nomVoie} {lieuDitComplementNom ? `(${lieuDitComplementNom})` : ''}</b>
        <Tag type='numero' />
      </div>
      <div className='commune'>{nomCommune} - {codeCommune}</div>

      {parcelles && <ParcellesList parcelles={parcelles.split('|')} />}

      <div className='infos-container'>
        <div className='separator' />
        <div className='infos'>
          <div>Source de l’adresse : <b style={{color: position.color}}>{position.name}</b></div>
        </div>
      </div>

      <style jsx>{`
        .heading {
          display: grid;
          grid-template-columns: 3fr 1fr;
          grid-gap: .5em;
          align-items: center;
        }

        .commune {
          font-style: italic;
          color: ${colors.almostBlack};
        }

        .infos-container {
          display: grid;
          grid-template-columns: 10px 1fr;
          margin-top: 2em;
        }

        .separator {
          width: 0px;
          border: 1px solid ${colors.blue};
        }

        .infos {
          display: grid;
          align-items: center;
          grid-template-rows: 1fr 1fr;
        }
      `}</style>
    </div>
  )
}

PopupNumero.propTypes = {
  numero: PropTypes.number.isRequired,
  suffixe: PropTypes.string,
  parcelles: PropTypes.string,
  lieuDitComplementNom: PropTypes.string,
  nomVoie: PropTypes.string.isRequired,
  nomCommune: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  sourcePosition: PropTypes.string.isRequired,
}

function PopupVoie({nomVoie, nomCommune, codeCommune, parcelles, nbNumeros, type}) {
  return (
    <div>
      <div className='heading'>
        <div className='address'>
          <div><b>{nomVoie}</b></div>
          <div>{nomCommune} {codeCommune}</div>
        </div>
        <Tag type={type || 'lieu-dit'} />
      </div>

      {parcelles && <ParcellesList parcelles={parcelles.split('|')} />}

      {nbNumeros && (
        <div>Cette voie contient <b>{nbNumeros} numéro{nbNumeros > 1 ? 's' : ''}</b></div>
      )}

      <style jsx>{`
        .heading {
          display: grid;
          grid-template-columns: 3fr 1fr;
          grid-gap: .5em;
          margin-bottom: 1em;
        }

        .address {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
}

PopupVoie.propTypes = {
  nomVoie: PropTypes.string.isRequired,
  nomCommune: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  parcelles: PropTypes.string,
  nbNumeros: PropTypes.number.isRequired,
  type: PropTypes.string
}

export default function popupFeatures(features) {
  return features.map(({properties}) => (
    <div key={properties.id}>
      {properties.type ? (
        <PopupVoie {...properties} />
      ) : (
        <PopupNumero {...properties} />
      )}
    </div>
  ))
}
