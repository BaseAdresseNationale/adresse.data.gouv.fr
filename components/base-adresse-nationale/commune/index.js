import {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash'
import {CheckCircle} from 'react-feather'

import theme from '@/styles/theme'

import Certification from '../certification'
import AddressesList from '../addresses-list'
import RegionInfos from '../region-infos'
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
          <h2>
            <a href={`/commune/${codeCommune}`}>{nomCommune} - {codeCommune}</a>
          </h2>
          <div>
            <Certification
              isCertified={typeComposition === 'bal'}
              validIconColor={certificationInProgress ? theme.border : theme.successBorder}
              certifiedMessage={
                isAllCertified ?
                  'Toutes les adresses sont certifiées par la commune' :
                  'Les adresses sont en cours de certification par la commune'
              }
              notCertifiedMessage={
                nbNumerosCertifies > 0 ?
                  'Certaines adresses ne sont pas certifiées par la commune' :
                  'Aucune adresse n’est certifiée par la commune'
              }
            />
          </div>
        </div>

        <RegionInfos
          codeCommune={codeCommune}
          region={region}
          departement={departement}
        />
      </div>
      <Details
        certificationPercentage={certificationPercentage}
        nbVoies={nbVoies}
        nbLieuxDits={nbLieuxDits}
        nbNumeros={nbNumeros}
        codesPostaux={codesPostaux}
        population={population}
      />

      {certificationInProgress && nbNumeros > 0 && (
        <Notification style={{marginTop: '1em'}} type='info'>
          Les adresses sont en <b>cours de certification</b> par la commune.<br />{}
          Actuellement, <span className='non-breaking'><b>{nbNumerosCertifies} / {nbNumeros} adresses ({certificationPercentage}%) sont certifiées</b> <CheckCircle style={{verticalAlign: 'middle'}} color={theme.successBorder} size={26} /></span>.
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
          margin: 1.2em 0;
        }

        .heading h2 {
          margin-bottom: 0.2em;
          display: flex;
        }

        .name-certification {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
