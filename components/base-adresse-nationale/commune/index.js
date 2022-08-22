import {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {orderBy} from 'lodash'
import {CheckCircle} from 'react-feather'

import theme from '@/styles/theme'

import {isCOM} from '@/lib/ban'

import AddressesList from '../addresses-list'
import Details from '@/components/base-adresse-nationale/commune/details'
import Tabs from '@/components/base-adresse-nationale/commune/tabs'
import Notification from '@/components/notification'
import Voie from './voie'

function Commune({nomCommune, codeCommune, region, departement, voies, nbVoies, nbNumeros, nbNumerosCertifies, nbLieuxDits, population, codesPostaux, typeComposition}) {
  const [activeTab, setActiveTab] = useState('VOIES')

  const isAllCertified = nbNumeros > 0 && nbNumeros === nbNumerosCertifies
  const certificationInProgress = typeComposition === 'bal' && !isAllCertified

  const certificationPercentage = useMemo(() => {
    const percentage = (nbNumerosCertifies * 100) / nbNumeros
    const roundedPercentage = Math.floor(percentage * 10) / 10
    return (roundedPercentage ? String(roundedPercentage).replace('.', ',') : roundedPercentage) || 0
  }, [nbNumerosCertifies, nbNumeros])

  return (
    <>
      <div className='heading'>
        <div className='name-certification'>
          <Image src='/images/icons/commune.svg' height={50} width={50} />
          <h2>
            <a href={`/commune/${codeCommune}`}>{nomCommune} - {codeCommune}</a>
            {isCOM(codeCommune) && <i>Collectivité d’outremer</i>}
          </h2>
        </div>
      </div>
      <Details
        typeComposition={typeComposition}
        isAllCertified={isAllCertified}
        isCertificationInProgress={certificationInProgress}
        certificationPercentage={certificationPercentage}
        region={region}
        departement={departement}
        nbVoies={nbVoies}
        nbLieuxDits={nbLieuxDits}
        nbNumeros={nbNumeros}
        nbNumerosCertifies={nbNumerosCertifies}
        codesPostaux={codesPostaux}
        population={population}
      />

      {certificationInProgress && nbNumeros > 0 && (
        <Notification style={{marginTop: '1em'}} type='info'>
          Les adresses sont en <b>cours de certification</b> par la commune.<br />{}
          Actuellement, <span className='non-breaking'><b>{nbNumerosCertifies} / {nbNumeros} adresses ({certificationPercentage}%) sont certifiées</b> <CheckCircle style={{verticalAlign: 'middle'}} color={theme.successBorder} size={26} alt aria-hidden='true' /></span>.
        </Notification>
      )}

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
              title='Lieux-dits de la commune'
              placeholder={`Rechercher un lieu-dit à ${nomCommune}`}
              addresses={orderBy(voies.filter(({type}) => type === 'lieu-dit'), 'nomVoie', 'asc')}
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
          flex-direction: column;
          margin-top: 1.2em;
        }

        .heading h2 {
          margin-bottom: 0.2em;
          display: flex;
          flex-direction: column;
        }

        .heading i {
          font-size: small;
          font-weight: lighter;
        }

        .name-certification {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1em;
        }

        .non-breaking {
          white-space: nowrap;
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
  nbNumerosCertifies: PropTypes.number.isRequired,
  region: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  departement: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  population: PropTypes.number.isRequired,
  codesPostaux: PropTypes.array.isRequired
}

export default Commune
