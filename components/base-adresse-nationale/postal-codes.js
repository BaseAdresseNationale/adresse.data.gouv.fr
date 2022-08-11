import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronUp, ChevronDown} from 'react-feather'

import ActionButtonNeutral from '@/components/action-button-neutral'
import colors from '@/styles/colors'

function PostalCodes({codes}) {
  const [showCodes, setShowCodes] = useState(false)
  return (
    <div className='postal-codes-container'>
      {codes.length === 1 ? (
        <div>
          Code postal : <b>{codes[0]}</b>
        </div>
      ) : (
        <div className='postal-codes'>
          <div>
            <ActionButtonNeutral
              label={showCodes ? 'Masquer les codes postaux' : 'Afficher les codes postaux'}
              onClick={() => setShowCodes(!showCodes)}
            >
              <div className='wrapper'>
                <div>Codes postaux</div> {showCodes ? <ChevronUp alt /> : <ChevronDown alt />}
              </div>
            </ActionButtonNeutral>

          </div>
          {showCodes && (
            <ul className='codes-list'>
              {codes.map(code => <li key={code}>{code}</li>)}
            </ul>
          )}
        </div>
      )}

      <style jsx>{`
        .postal-codes {
          padding: 5px;
          background: ${colors.lighterGrey};
        }

        .wrapper {
          display: flex;
          justify-content: space-between;
          border-radius: 4px;
          align-items: center;

        }

        .with-icon > div {
          margin-right: 0.4em;
        }

        .codes-list {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

PostalCodes.propTypes = {
  codes: PropTypes.array.isRequired
}

export default PostalCodes
