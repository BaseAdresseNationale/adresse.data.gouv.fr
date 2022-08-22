import PropTypes from 'prop-types'

import colors from '@/styles/colors'

import CommuneIdCard from '@/components/commune-id-card'
import NumberCard from '@/components/number-card'

function Details({region, departement, certificationPercentage, nbVoies, nbLieuxDits, nbNumeros, codesPostaux, population}) {
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

      <div className='address-number'>
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

      <div className='number-of-wrapper'>
        <div>
          {certificationPercentage === 0 ? (
            <div>
              Aucune adresse n’est certifiée par la commune
            </div>
          ) : (
            <div>
              {certificationPercentage}% des adresses sont certifiées par la commune
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .details-container {
          margin-top: 1em;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .commune-general {
          padding-bottom: 1em;
          display: flex;
          justify-content: space-between;
        }

        .number-of-wrapper {
          margin: 1em 0;
          border-left: solid 3px ${colors.lightBlue};
          padding-left: 5px;
        }

        .address-number h3 {
          font-size: large;
          text-align: center;
          margin-bottom: .5em;
        }

        .number-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1em;
        }
      `}</style>
    </div>
  )
}

Details.propTypes = {
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
  departement: PropTypes.object.isRequired
}

export default Details
