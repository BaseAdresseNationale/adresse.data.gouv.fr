import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash'

import colors from '@/styles/colors'

import Certification from '../certification'
import AddressesList from '../addresses-list'
import Details from '@/components/base-adresse-nationale/commune/details'
import Tabs from '@/components/base-adresse-nationale/commune/tabs'
import Voie from './voie'

function Commune({nomCommune, codeCommune, region, departement, typeComposition, voies, nbVoies, nbLieuxDits, nbNumeros, population, codesPostaux}) {
  const [activeTab, setActiveTab] = useState('VOIES')
  const lieuxDits = voies.filter(({type}) => type === 'lieu-dit')

  return (
    <>
      <div className='heading'>
        <div>
          <h2>{nomCommune} - {codeCommune}</h2>
          <div className='region'>{region.nom} - {departement.nom} ({departement.code})</div>
        </div>
        <div style={{padding: '1em'}}>
          <Certification
            isCertified={typeComposition === 'bal'}
            certifiedMessage='Les adresses sont certifiées par la commune'
            notCertifiedMessage='Les adresses ne sont pas certifiées par la commune'
          />
        </div>
      </div>
      <Details
        nbVoies={nbVoies}
        nbLieuxDits={nbLieuxDits}
        nbNumeros={nbNumeros}
        codesPostaux={codesPostaux}
        population={population}
      />
      <div>
        <Tabs
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        {activeTab === 'VOIES' ? (
          <AddressesList
            title='Voie de la commune'
            placeholder={`Rechercher une voie à ${nomCommune}`}
            addresses={orderBy(voies.filter(({type}) => type === 'voie'), 'nomVoie', 'asc')}
            getLabel={({nomVoie}) => nomVoie}
            addressComponent={voie => (
              <Voie {...voie} />
            )}
          />
        ) : (
          <div id='lieux-dits'>
            <AddressesList
              title={lieuxDits.length > 0 ? 'Lieux-dits de la commune' : 'Aucun lieu-dit'}
              placeholder={`Rechercher un lieu-dit à ${nomCommune}`}
              addresses={orderBy(lieuxDits, 'nomVoie', 'asc')}
              getLabel={({nomVoie}) => nomVoie}
              addressComponent={voie => (
                <Voie {...voie} />
              )}
            />
          </div>) }
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

        .region {
          margin-top: 0.5em;
          font-style: italic;
          font-size: 17px;
          color: ${colors.almostBlack};
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
  nbNumeros: PropTypes.number.isRequired,
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
