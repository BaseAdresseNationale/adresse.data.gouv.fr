import React from 'react'
import {renderToString} from 'react-dom/server'

import Tag from '@/components/tag'

import {sources} from './layers'

function popupNumero({numero, suffixe, nomVoie, nomCommune, codeCommune, sourcePosition, sourceNomVoie}) {
  const position = sources[sourcePosition]
  const nom = sources[sourceNomVoie]

  return renderToString(
    <div>
      <div className='heading'>
        <b>{numero}{suffixe} {nomVoie}</b>
        <Tag type='numero' />
      </div>
      <div>{nomCommune} {codeCommune}</div>
      <div>Nom : <span style={{color: nom.color}}>{nom.name}</span></div>
      <div>Position : <span style={{color: position.color}}>{position.name}</span></div>

      <style jsx>{`
        .heading {
          display: grid;
          grid-template-columns: 3fr 1fr;
          grid-gap: .5em;
          align-items: center;
          margin-bottom: 1em;
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
