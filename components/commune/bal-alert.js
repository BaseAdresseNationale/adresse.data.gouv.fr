import PropTypes from 'prop-types'
import {getLabel} from '@ban-team/validateur-bal'
import {AlertTriangle, AlertOctagon, Info} from 'react-feather'

import theme from '@/styles/theme'

function BalAlert({alert, type}) {
  return (
    <div className='alert-container'>
      <div className={`alert-type ${type}`}>
        {type === 'error' ? <AlertOctagon alt aria-hidden='true' /> : (type === 'warning' ? <AlertTriangle alt aria-hidden='true' /> : <Info alt aria-hidden='true' />)}
        {type === 'error' ? 'Erreur' : (type === 'warning' ? 'Avertissement' : 'Information')}
      </div>
      <div>{getLabel(alert)}</div>

      <style jsx>{`
        .alert-container {
          width: 70%;
          min-width: 290px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          text-align: center;
          gap: 1em;
          padding: 1em;
          background: ${theme.colors.white};
          border-radius: ${theme.borderRadius};
        }

        .alert-type {
          color: ${theme.colors.white};
          padding: .5em 1em;
          display: flex;
          justify-content: center;
          width: fit-content;
          gap: 1em;
          border-radius: ${theme.borderRadius};
        }

        .error {
          background: ${theme.errorBorder};
        }

        .warning {
          background: ${theme.warningBorder};
        }

        .information {
          background: ${theme.infoBorder};
        }

        @media (max-width: ${theme.breakPoints.laptop}) {
          .alert-container {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
}

BalAlert.propTypes = {
  alert: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'information',
    'warning',
    'error'
  ]).isRequired
}
export default BalAlert
