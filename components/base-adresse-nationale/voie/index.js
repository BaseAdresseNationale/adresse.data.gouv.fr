import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import Tag from '@/components/tag'

import AddressesList from '../addresses-list'
import Numero from './numero'

function Voie({type, nomVoie, commune, numeros, nbNumeros}) {
  const isToponyme = type === 'lieu-dit'
  const {region, departement} = commune

  return (
    <div>
      <div className='heading'>
        <div>
          <h2>{nomVoie}</h2>
          {commune && <h4><Link href={`${commune.id}`}><a>{commune.nom} {commune.code}</a></Link></h4>}
          {region && departement && (
            <div>{region.nom} - {departement.nom} ({departement.code})</div>
          )}
        </div>
      </div>

      {isToponyme ? (
        <Tag type='lieu-dit' />
      ) : (
        <div className='numeros-list'>
          <AddressesList
            title='Numéros de la voie'
            subtitle={nbNumeros > 1 ? `${nbNumeros} numéros répertoriés` : ''}
            addresses={numeros}
            placeholder='Rechercher un numéro'
            filterProp='numero'
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
        `}</style>
    </div>
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
