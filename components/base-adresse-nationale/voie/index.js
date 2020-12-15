import React from 'react'
import PropTypes from 'prop-types'

import Tag from '@/components/tag'

import AddressesList from '../addresses-list'
import Numero from './numero'

function Voie({idVoie, type, nomVoie, commune, numeros, nbNumeros, handleSelect}) {
  const isToponyme = type === 'lieu-dit'
  const {region, departement} = commune

  return (
    <div>
      <div className='heading'>
        <div>
          <h2>{nomVoie}</h2>
          {commune && <h4>{commune.nom} {commune.code}</h4>}
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
              <Numero numero={numero} handleSelect={handleSelect} />
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
  region: null,
  departement: null,
  numeros: null
}

Voie.propTypes = {
  idVoie: PropTypes.string.isRequired,
  idVoie: PropTypes.string.isRequired,
  nomVoie: PropTypes.string.isRequired,
  commune: PropTypes.shape({
    nom: PropTypes.string,
    code: PropTypes.string,
    region: PropTypes.object,
    departement: PropTypes.object
  }),
  nbNumeros: PropTypes.number.isRequired,
  numeros: PropTypes.array,
  handleSelect: PropTypes.func.isRequired
}

export default Voie
