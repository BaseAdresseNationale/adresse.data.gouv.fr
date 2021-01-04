import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import {getNumeroComplet} from '@/lib/ban'

import Certification from '../certification'

function Numero({numero, suffixe, sourcePosition, commune, voie, libelleAcheminement, codePostal, cleInterop}) {
  return (
    <>
      <div className='heading'>
        <div>
          <h2>{getNumeroComplet({numero, suffixe})} <Link href={`/base-adresse-nationale?id=${voie.id}`} as={`/base-adresse-nationale/${voie.id}`}><a>{voie.nomVoie}</a></Link>,</h2>
          {commune && <h4><Link href={`/base-adresse-nationale?id=${commune.id}`} as={`/base-adresse-nationale/${commune.id}`}><a>{commune.nom} - {commune.code}</a></Link></h4>}
          <div>{commune.region.nom} - {commune.departement.nom} ({commune.departement.code})</div>
        </div>
        <div style={{padding: '1em'}}>
          <Certification
            isCertified={sourcePosition === 'bal'}
            certifiedMessage='Ce numéro est certifié par la commune'
            notCertifiedMessage='Ce numéro n’est pas certifié par la commune'
          />
        </div>
      </div>
      <div className='address-details'>
        <div>Libellé d’acheminement : <b>{libelleAcheminement}</b></div>
        <div>Code postal : <b>{codePostal}</b></div>
        <div>Clé d’interopérabilité : <b>{cleInterop}</b></div>
      </div>

      <style jsx>{`
        .heading {
          display: grid;
          grid-template-columns: 3fr 1fr;
          justify-content: space-between;
          align-items: center;
        }

        .heading h2 {
          margin-bottom: 0.2em;
        }

        .heading, .address-details > div {
          margin: 1.2em 0;
        }
      `}</style>
    </>
  )
}

Numero.propTypes = {
  numero: PropTypes.string.isRequired,
  suffixe: PropTypes.string,
  sourcePosition: PropTypes.string.isRequired,
  commune: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    region: PropTypes.object,
    departement: PropTypes.object
  }).isRequired,
  voie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nomVoie: PropTypes.string.isRequired
  }),
  libelleAcheminement: PropTypes.string.isRequired,
  codePostal: PropTypes.string.isRequired,
  cleInterop: PropTypes.string.isRequired
}

export default Numero
