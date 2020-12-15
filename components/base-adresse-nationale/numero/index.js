import React from 'react'
import PropTypes from 'prop-types'

import Certification from '../certification'

function Numero({numero, suffixe, sourcePosition, commune, voie}) {
  return (
    <div>
      <div className='heading'>
        <div>
          <h2>{numero}{suffixe} {voie.nomVoie}</h2>
          <h4>{commune.nom} - {commune.code}</h4>
          <div>{commune.region.nom} - {commune.departement.nom} ({commune.departement.code})</div>
        </div>
        <div style={{padding: '1em'}}>
          <Certification isCertified={sourcePosition === 'bal'} subject='Les adresses' />
        </div>
      </div>

      <style jsx>{`
        .heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1.2em 0;
        }

        .heading h2 {
          margin-bottom: 0.2em;
        }

        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 1em;
        }

        .with-icon {
          display: flex;
        }

        .with-icon > div {
          margin-left: 0.4em;
        }
      `}</style>
    </div>
  )
}

Numero.propTypes = {
  numero: PropTypes.string.isRequired,
  suffixe: PropTypes.string,
  sourcePosition: PropTypes.string.isRequired,
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    region: PropTypes.object,
    departement: PropTypes.object
  }).isRequired,
  voie: PropTypes.shape({
    nomVoie: PropTypes.string.isRequired
  })
}

export default Numero
