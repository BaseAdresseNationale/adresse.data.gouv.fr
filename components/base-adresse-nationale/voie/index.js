import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import {getNumeroComplet} from '@/lib/ban'

import Tag from '@/components/tag'

import AddressesList from '../addresses-list'
import Numero from './numero'

function Voie({type, nomVoie, commune, numeros, nbNumeros}) {
  const isToponyme = type === 'lieu-dit'
  const {region, departement} = commune

  return (
    <>
      <div className='heading'>
        <div style={{width: '100%'}}>
          <div className='title-container'>
            <h2>{nomVoie}</h2>
            <div>{nbNumeros > 0 ? (nbNumeros > 1 ? `${nbNumeros} numéros répertoriés` : '1 numéro répertorié') : 'Aucun numéros répertorié'}</div>
          </div>
          {commune && <h4><Link href={`/base-adresse-nationale?id=${commune.id}`} as={`/base-adresse-nationale/${commune.id}`}><a>{commune.nom} - {commune.code}</a></Link></h4>}
          {region && departement && (
            <div className='region'>{region.nom} - {departement.nom} ({departement.code})</div>
          )}
        </div>

      </div>
      <div className='separator' />
      {isToponyme ? (
        <Tag type='lieu-dit' />
      ) : (
        <div className='numeros-list'>
          <AddressesList
            title='Numéros de la voie'
            addresses={numeros}
            placeholder='Rechercher un numéro'
            getLabel={getNumeroComplet}
            addressComponent={numero => (
              <Numero {...numero} />
            )}
          />
        </div>
      )}

      <style jsx>{`
        .heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1.2em 0;
        }

        .heading h2, h4 {
          margin-bottom: 0.2em;
        }

        .title-container{
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .region {
          margin-top: 1em;
          font-style: italic;
          font-size: 17px;
          color: rgba(0, 0, 0, 0.81);
        }

        .separator{
          width: 100%;
          height: 0px;
          margin: 2em 0 1em 0;
          border: 1px solid rgba(32, 83, 179, 0.13);
        }
        `}</style>
    </>
  )
}

Voie.propTypes = {
  commune: null,
  numeros: null,
  nbNumeros: null
}

Voie.propTypes = {
  nomVoie: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['voie', 'lieu-dit']),
  commune: PropTypes.shape({
    id: PropTypes.string,
    nom: PropTypes.string,
    code: PropTypes.string,
    region: PropTypes.object,
    departement: PropTypes.object
  }),
  nbNumeros: PropTypes.number,
  numeros: PropTypes.array
}

export default Voie
