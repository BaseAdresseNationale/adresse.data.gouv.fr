import React from 'react'
import {renderToString} from 'react-dom/server'
import colors from '@/styles/colors'

import Tag from '@/components/tag'

import {sources} from './layers'

function popupNumero({numero, suffixe, lieuDitComplementNom, nomVoie, nomCommune, codeCommune, sourcePosition, sourceNomVoie}) {
  const position = sources[sourcePosition]
  const nom = sources[sourceNomVoie]

  return renderToString(
    <div>
      <div className='heading'>
        <b>{numero}{suffixe} {nomVoie} {lieuDitComplementNom ? `(${lieuDitComplementNom})` : ''}</b>
        <Tag type='numero' />
      </div>
      <div className='commune'>{nomCommune} - {codeCommune}</div>
      <div className='infos-container'>
        <div className='separator' />
        <div className='infos'>
          {nom ? (
            <div>Nom : <b style={{color: nom.color}}>{nom.name}</b></div>
          ) : (
            <div>Nom : <i>source inconnue</i></div>
          )}
          <div>Position : <b style={{color: position.color}}>{position.name}</b></div>
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
          margin-bottom: 2em;
        }

        .infos-container {
          
          display: grid;
          grid-template-columns: 10px 1fr;
        }

        .separator {
          width: 0px;
          border: 1px solid ${colors.separatorBlue};
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

function popupVoie({nomVoie, nomCommune, codeCommune, nbNumeros, type}) {
  return renderToString(
    <div>
      <div className='heading'>
        <div className='address'>
          <div><b>{nomVoie}</b></div>
          <div>{nomCommune} {codeCommune}</div>
        </div>
        <Tag type={type || 'lieu-dit'} />
      </div>
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

export default function popupFeatures(features) {
  return features.map(({properties}) => {
    return properties.type ? popupVoie(properties) : popupNumero(properties)
  })
}
