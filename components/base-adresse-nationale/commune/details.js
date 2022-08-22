import PropTypes from 'prop-types'

import colors from '@/styles/colors'

import CommuneIdCard from '@/components/commune-id-card'

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

      <div className='number-of-wrapper'>
        <div className='number-of-container'>
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

          <div>
            {nbVoies > 0 ? (nbVoies > 1 ? `${nbVoies} voies répertoriées` : '1 voie répertoriée') : 'Aucune voie répertoriée'}
          </div>
          <div>
            {nbLieuxDits > 0 ? (nbLieuxDits > 1 ? `${nbLieuxDits} lieux-dits répertoriés` : '1 lieu-dit répertorié') : 'Aucun lieu-dit répertorié'}
          </div>
          <div>
            {nbNumeros > 0 ? (nbNumeros > 1 ? `${nbNumeros} numéros répertoriés` : '1 numéro répertorié') : 'Aucun numéro répertorié'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .details-container {
          margin: 1em 0;
          display: flex;
          flex-direction: column;
        }

        .commune-general {
          padding-bottom: 1em;
          display: flex;
          justify-content: space-between;
        }

        .with-icon {
          display: flex;
        }

        .with-icon > div {
          margin-left: 0.4em;
        }

        .number-of-wrapper {
          margin: 1em 0;
          border-left: solid 3px ${colors.lightBlue};
        }

        .number-of-container {
          display: flex;
          flex-direction: column;
          padding-left: 1em;
        }

        .number-of-container > div {
          font-style: italic;
          font-size: 16px;
          color: ${colors.almostBlack};
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
