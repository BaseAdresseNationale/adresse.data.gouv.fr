import PropTypes from 'prop-types'

import BalAlert from './bal-alert'

function AlertRows({alerts, alertType, alertsLength}) {
  return (
    <div className='alerts-type-container'>
      <h4>{alertsLength > 1 ? `${alertsLength} erreurs détectées` : `${alertsLength} erreur détectée`}</h4>
      {alerts.map(error => <BalAlert key={error} alert={error} type={alertType} />)}

      <style jsx>{`
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

AlertRows.propTypes = {
  alerts: PropTypes.array.isRequired,
  alertType: PropTypes.oneOf([
    'information',
    'warning',
    'error'
  ]).isRequired,
  alertsLength: PropTypes.number.isRequired
}

export default AlertRows
