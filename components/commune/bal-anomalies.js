import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Anomaly from './anomaly'
import Notification from '@/components/notification'
import SectionText from '@/components/section-text'

function BalAnomalies({errors}) {
  return (
    <div className='bal-anomalies-types-container'>
      {errors.length === 0 ? (
        <div className='conform-container'>
          <Notification type='success'>
            <p className='conform-text'>La Base Adresse Locale ne comprend aucune anomalie ! 🎉</p>
          </Notification>
        </div>
      ) : (
        <>
          <div className='anomalies-container'>
            {errors.map(error => <Anomaly key={error.code} error={error.code} />)}
          </div>
          <div className='download-bal-container'>

            <SectionText>
              La Base Adresse Locale comporte des <b>anomalies</b>. Pour obtenir plus de détails concernant les alertes, vous avez la possibilité de <b>télécharger le fichier de la BAL</b> au format CSV et utiliser l’outils <a href='/bases-locales/validateur'>Validateur Base Adresse Locale</a>.
            </SectionText>
          </div>
        </>
      )}

      <style jsx>{`
        .bal-anomalies-types-container {
          margin-top: 3em;
        }

        .conform-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2em;
        }

        .conform-text {
          font-weight: bold;
          color: ${theme.successBorder};
          margin: 0;
          font-size: 18px;
        }

        .anomalies-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
        }

        .download-bal-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

       h4 {
         margin-top: 2em;
         text-align: center;
       }
      `}</style>
    </div>
  )
}

BalAnomalies.propTypes = {
  errors: PropTypes.array.isRequired
}

export default BalAnomalies
