import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Notification from '@/components/notification'
import AlertRows from './alert-rows'

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
            <AlertRows alerts={errors} alertType='error' alertsLength={numberOfErrors} />
          )}

          {numberOfWarnings > 0 && (
            <AlertRows alerts={warnings} alertType='warning' alertsLength={numberOfWarnings} />
          )}

          {numberOfInfos > 0 && (
            <AlertRows alerts={infos} alertType='information' alertsLength={numberOfInfos} />
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
