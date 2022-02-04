import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Notification from '@/components/notification'
import BalAlert from './bal-alert'

function BalAlerts({errors, warnings, infos}) {
  const hasAlerts = Boolean(warnings.length > 0 || errors.length > 0 || infos.length > 0)
  const numberOfErrors = errors.length
  const numberOfWarnings = warnings.length
  const numberOfInfos = infos.length

  return (
    <div className='bal-alerts-types-container'>
      {hasAlerts ? (
        <div className='alerts-container'>
          {numberOfErrors > 0 && (
            <div className='alerts-type-container'>
              <h4>{numberOfErrors > 1 ? `${numberOfErrors} erreurs détectées` : `${numberOfErrors} erreur détectée`}</h4>
              {errors.map(error => <BalAlert key={error} alert={error} type='error' />)}
            </div>
          )}

          {numberOfWarnings > 0 && (
            <div className='alerts-type-container'>
              <h4>{numberOfWarnings > 1 ? `${numberOfWarnings} avertissements détectés` : `${numberOfWarnings} avertissement détecté`}</h4>
              {warnings.map(warning => <BalAlert key={warning} alert={warning} type='warning' />)}
            </div>
          )}

          {numberOfInfos > 0 && (
            <div className='alerts-type-container'>
              <h4>{numberOfInfos > 1 ? `${numberOfInfos} informations détectées` : `${numberOfInfos} information détectée`}</h4>
              {infos.map(info => <BalAlert key={info} alert={info} type='information' />)}
            </div>
          )}
        </div>
      ) : (
        <div className='conform-container'>
          <Notification type='success'>
            <p className='conform-text'>La Base Adresse Locale ne comprend aucune alerte ! 🎉</p>
          </Notification>
        </div>
      )}

      <style jsx>{`
        .bal-alerts-types-container {
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

        .alerts-container {
          display: flex;
          flex-direction: column;
          gap: 2em;
        }

        .alerts-type-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
        }
      `}</style>
    </div>
  )
}

BalAlerts.propTypes = {
  errors: PropTypes.array.isRequired,
  warnings: PropTypes.array.isRequired,
  infos: PropTypes.array.isRequired
}

export default BalAlerts
