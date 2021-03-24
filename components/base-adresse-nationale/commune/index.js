import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash'
import {Users} from 'react-feather'
import colors from '@/styles/colors'

import PostalCodes from '../postal-codes'
import Certification from '../certification'
import AddressesList from '../addresses-list'
import Button from '@/components/button'

import Voie from './voie'

function Commune({nomCommune, codeCommune, region, departement, typeComposition, voies, nbVoies, nbLieuxDits, nbNumeros, population, codesPostaux}) {
  const activeTabStates = {
    voies: 'VOIES',
    lieuxdits: 'LIEUXDITS'
  }
  const [activeTab, setActiveTab] = useState(activeTabStates.voies)
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

      <div className='details'>
        <div className='numberOf-wrapper'>
          <div className='details-separator' />
          <div className='numberOf-container'>
            <div>
              {nbVoies > 0 ? (nbVoies > 1 ? `${nbVoies} voies répertoriées` : '1 voie répertoriée') : 'Aucune voie répertoriée'}
            </div>
            <div>
              {nbLieuxDits > 0 ? (nbLieuxDits > 1 ? `${nbLieuxDits} lieux-dits répertoriés` : '1 lieu-dit répertorié') : 'Aucun lieu-dit répertorié'}
            </div>
            <div>
              {nbNumeros > 0 ? (nbNumeros > 1 ? `${nbNumeros} numéros répertoriés` : '1 numéro répertorié') : 'Aucun numéros répertorié'}
            </div>
          </div>
        </div>

        <div className='commune-general'>
          <PostalCodes codes={codesPostaux} />
          <div className='with-icon'>
            <Users /> <div><b>{population}</b> habitants</div>
          </div>
        </div>
      </div>

      <div>
        <div className='tab-separator' />
        <div className='tab-container'>
          <Button isOutlined={activeTab !== activeTabStates.voies && true} style={{width: '45%'}}
            onClick={() => {
              setActiveTab(activeTabStates.voies)
            }}
          >
            Voies
          </Button>

          <Button type='button' isOutlined={activeTab !== activeTabStates.lieuxdits && true} style={{width: '45%'}}
            onClick={() => {
              setActiveTab(activeTabStates.lieuxdits)
            }}
          >
            Lieux-dits
          </Button>
        </div>
        <div className={activeTab === activeTabStates.voies ? 'active' : 'inactive'}>
          <AddressesList
            title='Voie de la commune'
            placeholder={`Rechercher une voie à ${nomCommune}`}
            addresses={orderBy(voies.filter(({type}) => type === 'voie'), 'nomVoie', 'asc')}
            getLabel={({nomVoie}) => nomVoie}
            addressComponent={voie => (
              <Voie {...voie} />
            )}
          />
        </div>

        <div id='lieux-dits' className={activeTab === activeTabStates.lieuxdits ? 'active' : 'inactive'}>
          <AddressesList
            title='Lieux-dits de la commune'
            placeholder={`Rechercher un lieu-dit à ${nomCommune}`}
            addresses={orderBy(voies.filter(({type}) => type === 'lieu-dit'), 'nomVoie', 'asc')}
            getLabel={({nomVoie}) => nomVoie}
            addressComponent={voie => (
              <Voie {...voie} />
            )}
          />
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

        .region {
          margin-top: 0.5em;
          font-style: italic;
          font-size: 17px;
          color: ${colors.almostBlack};
        }

        .details {
          display: grid;
          grid-gap: 1em;
        }

        .with-icon {
          display: flex;
        }

        .with-icon > div {
          margin-left: 0.4em;
        }

        .numberOf-wrapper {
          display: flex;
          margin: 1em 0 1em 0;
        }

        .details-separator {
          width: 0px;
          height: 100%;
          border: 2px solid ${colors.separatorBlue};
        }

        .numberOf-container {
          display: flex;
          flex-direction: column;
          padding-left: 10px;
        }

        .numberOf-container > div {
          font-style: italic;
          font-size: 16px;
          color: ${colors.almostBlack};
        }

        .tab-separator {
          margin-top: 2em;
          height: 0px;
          border: 1px solid ${colors.almostTransparent};
        }

        .commune-general {
          display: flex;
          justify-content: space-between;
        }

        .tab-container {
          display: flex;
          justify-content: space-around;
          margin: 1em 0 2em 0;
        }

        .active {
          display: block;
        }

        .inactive {
          display: none;
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
