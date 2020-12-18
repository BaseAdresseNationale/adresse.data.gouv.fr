import React from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash'
import {MapPin, Users} from 'react-feather'

import PostalCodes from '../postal-codes'
import Certification from '../certification'
import AddressesList from '../addresses-list'

import Voie from './voie'

function Commune({nomCommune, codeCommune, region, departement, typeComposition, voies, nbVoies, nbLieuxDits, population, codesPostaux}) {
  return (
    <>
      <div className='heading'>
        <div>
          <h2>{nomCommune} - {codeCommune}</h2>
          <div>{region.nom} - {departement.nom} ({departement.code})</div>
        </div>
        <div style={{padding: '1em'}}>
          <Certification
            isCertified={typeComposition === 'bal'}
            certifiedMessage='Les adresses sont certifiées par la commune'
            notCertifiedMessage='Les adresses ne sont pas certifiées par la commune'
          />
        </div>
      </div>

      <div className='details'>
        <PostalCodes codes={codesPostaux} />
        <div className='with-icon'>
          <Users /> <div><b>{population}</b> habitants</div>
        </div>
        {nbLieuxDits > 0 && (
          <a href='#lieux-dits'>
            <div className='with-icon'>
              <MapPin /> <div><b>{nbLieuxDits}</b> {nbLieuxDits > 1 ? 'lieux-dits' : 'lieu-dit'}</div>
            </div>
          </a>
        )}
      </div>

      <AddressesList
        title='Voie de la commune'
        subtitle={`${nbVoies} voies répertoriées`}
        placeholder={`Rechercher une voie à ${nomCommune}`}
        addresses={orderBy(voies.filter(({type}) => type === 'voie'), 'nomVoie', 'asc')}
        getLabel={({nomVoie}) => nomVoie}
        addressComponent={voie => (
          <Voie {...voie} />
        )}
      />

      <div id='lieux-dits' className='lieux-dits-list'>
        <AddressesList
          title='Lieux-dits de la commune'
          subtitle={nbLieuxDits > 1 ? `${nbLieuxDits} lieux-dits répertoriés` : '1 lieu-dit répertorié'}
          placeholder={`Rechercher un lieu-dit à ${nomCommune}`}
          addresses={orderBy(voies.filter(({type}) => type === 'lieu-dit'), 'nomVoie', 'asc')}
          getLabel={({nomVoie}) => nomVoie}
          addressComponent={voie => (
            <Voie {...voie} />
          )}
        />
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

        .lieux-dits-list {
          margin: 2em 0;
        }
      `}</style>
    </>
  )
}

Commune.propTypes = {
  nomCommune: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  typeComposition: PropTypes.string.isRequired,
  voies: PropTypes.array.isRequired,
  nbVoies: PropTypes.number.isRequired,
  nbLieuxDits: PropTypes.number.isRequired,
  region: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }).isRequired,
  departement: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  population: PropTypes.number.isRequired,
  codesPostaux: PropTypes.array.isRequired
}

export default Commune
