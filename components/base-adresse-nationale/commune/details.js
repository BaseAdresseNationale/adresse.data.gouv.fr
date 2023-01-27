import PropTypes from 'prop-types'
import {X, Check} from 'react-feather'

import theme from '@/styles/theme'

import CommuneIdCard from '@/components/commune-id-card'
import Counter from '@/components/ui/metrics/counter'
import ProgressBar from '@/components/progress-bar'
import Certification from '../certification'

function Details({
  codesPostaux,
  population,
  region,
  departement,
  nbVoies,
  nbLieuxDits,
  nbNumeros,
  nbNumerosCertifies,
  certificationPercentage,
  typeComposition,
  isCertificationInProgress,
  isAllCertified
}) {
  return (
    <div className='details-container'>
      <CommuneIdCard
        codesPostaux={codesPostaux}
        region={region}
        departement={departement}
        population={population}
        color='secondary'
        size='small'
      />

      <div>
        <h3>Les adresses de la commune en quelques chiffres</h3>
        <div className='number-cards'>
          <Counter
            value={nbVoies}
            label={nbVoies <= 1 ? 'Voie' : 'Voies'}
            color='secondary'
            size='small'
          />
          <Counter
            value={nbLieuxDits}
            label={nbLieuxDits <= 1 ? 'Lieu-dit' : 'Lieux-dits'}
            color='secondary'
            size='small'
          />
          <Counter
            value={nbNumeros}
            label={nbNumeros <= 1 ? 'Numéro' : 'Numéros'}
            color='secondary'
            size='small'
          />
        </div>
      </div>

      <div>
        <h3>Nombre d’adresses certifiées</h3>
        <div className='certif-progress-container'>
          <ProgressBar progress={certificationPercentage} />
          <div>
            <Certification
              iconSize={20}
              isCertified={typeComposition === 'bal'}
              validIconColor={isCertificationInProgress ? theme.border : theme.successBorder}
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

        {isAllCertified ? (
          <div className='full-none-certified'><Check /> {nbNumerosCertifies} adresses ont été certifiées</div>
        ) : (
          certificationPercentage === 0 ? (
            <div className='full-none-certified'><X />{nbNumeros} adresses sont non-certifiées</div>
          ) : (
            <div className='address-number-container'>
              <div className='certified-container'>
                <b>{nbNumerosCertifies}</b>
                <div>Adresses certifiées</div>
              </div>
              <div className='non-certified-container'>
                <b>{nbNumeros - nbNumerosCertifies}</b>
                <div>Adresses non certifiées</div>
              </div>
            </div>
          )
        )}
      </div>

      <style jsx>{`
        .details-container {
          margin: 1em 0;
          display: flex;
          flex-direction: column;
          gap: 1.8em;
        }

        h3 {
          font-size: medium;
          text-align: center;
          margin-bottom: 8px;
        }

        .number-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1em;
        }


        .address-number-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          align-items: center;
          margin-top: 1em;
        }

        .certif-progress-container {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
        }

        .certified-container, .non-certified-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: bold;
          font-size: 15px;
        }

        .certified-container b {
          color: ${theme.colors.green};
          font-size: x-large;
        }

        .non-certified-container b {
          color: ${theme.colors.red};
          font-size: x-large;
        }

        .full-none-certified {
          text-align: center;
          color: ${isAllCertified ? theme.colors.green : theme.colors.red};
          font-weight: bold;
          margin-top: .8em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
      `}</style>
    </div>
  )
}

Details.propTypes = {
  typeComposition: PropTypes.string.isRequired,
  isAllCertified: PropTypes.bool.isRequired,
  isCertificationInProgress: PropTypes.bool.isRequired,
  certificationPercentage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  nbVoies: PropTypes.number.isRequired,
  nbLieuxDits: PropTypes.number.isRequired,
  nbNumeros: PropTypes.number.isRequired,
  population: PropTypes.number.isRequired,
  codesPostaux: PropTypes.array.isRequired,
  region: PropTypes.object.isRequired,
  departement: PropTypes.object.isRequired,
  nbNumerosCertifies: PropTypes.number.isRequired
}

export default Details
