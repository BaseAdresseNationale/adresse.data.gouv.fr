import PropTypes from 'prop-types'
import {getLabel} from '@etalab/bal'
import {AlertTriangle} from 'react-feather'

import theme from '@/styles/theme'

function Anomaly({error}) {
  return (
    <div className='anomaly-container'>
      <div className='warning'><AlertTriangle /> Avertissement</div>
      <div className='warning-label'>{getLabel(error)}</div>

      <style jsx>{`
        .anomaly-container {
          width: 70%;
          min-width: 290px;
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          text-align: center;
          gap: 1em;
          padding: 1em;
          background: ${theme.colors.white};
          border-radius: ${theme.borderRadius};
        }

        .warning {
          background: ${theme.colors.orange};
          color: ${theme.colors.white};
          padding: .5em 1em;
          display: flex;
          justify-content: center;
          width: fit-content;
          gap: 1em;
          border-radius: ${theme.borderRadius};
        }


        @media (max-width: ${theme.breakPoints.laptop}) {
          .anomaly-container {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
}

Anomaly.propTypes = {
  error: PropTypes.string.isRequired
}
export default Anomaly
