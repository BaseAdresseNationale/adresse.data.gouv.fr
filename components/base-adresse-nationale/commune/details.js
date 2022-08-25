import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import CommuneIdCard from '@/components/commune-id-card'
import NumberCard from '@/components/number-card'
import ProgressBar from '@/components/progress-bar'
import Certification from '../certification'

function Details({
  typeComposition,
  isCertificationInProgress,
  isAllCertified,
  region,
  departement,
  certificationPercentage,
  nbVoies,
  nbLieuxDits,
  nbNumeros,
  codesPostaux,
  population,
  nbNumerosCertifies
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
          <NumberCard
            label={nbVoies <= 1 ? 'Voie' : 'Voies'}
            number={nbVoies}
            color='secondary'
            size='small'
          />
          <NumberCard
            label={nbLieuxDits <= 1 ? 'Lieu-dit' : 'Lieux-dits'}
            number={nbLieuxDits}
            color='secondary'
            size='small'
          />
          <NumberCard
            label={nbNumeros <= 1 ? 'Numéro' : 'Numéros'}
            number={nbNumeros}
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
      </div>

      <style jsx>{`
        .details-container {
          margin: 1em 0;
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        h3 {
          font-size: medium;
          text-align: center;
          margin-bottom: 5px;
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
