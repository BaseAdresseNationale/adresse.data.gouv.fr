import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronRight, ChevronDown} from 'react-feather'

import theme from '@/styles/theme'

const getHours = time => {
  return new Date('1970-01-01T' + time + 'Z').getHours()
}

function CommuneSchedules({scheldules}) {
  const [isDisplayed, setIsDisplay] = useState(false)

  const toggleSchedules = () => {
    setIsDisplay(!isDisplayed)
  }

  return (
    <div className='schedules'>
      <div className='scheldule-dropdown' onClick={toggleSchedules}>Horaires d’ouverture
        {isDisplayed ? (
          <ChevronDown style={{marginTop: '2px'}} />
        ) : (
          <ChevronRight style={{marginTop: '2px'}} />
        )}
      </div>

      <div>
        {scheldules ? (
          isDisplayed && (
            scheldules.map(scheldule => (
              <div key={`${scheldule.du}-${scheldule.au}`}>
                <div>
                  <b>{scheldule.du === scheldule.au ? `Le ${scheldule.du}` : `Du ${scheldule.du} au ${scheldule.au}`}</b> :
                </div>
                <ul>
                  {scheldule.heures.map(heure => (
                    <li key={`${scheldule.du}-${scheldule.au}&${heure.de}-${heure.a}`}>
                      De <b>{getHours(heure.de)}h</b> à <b>{getHours(heure.a)}h</b>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )
        ) : 'Non renseignés'}
      </div>

      <style jsx>{`
        .schedules {
          width: 80%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 1em;
          gap: 1em;
          border-top: 2px solid ${theme.borderLighter};
        }

        .scheldule-dropdown {
          font-size: 17px;
          font-weight: bolder;
          display: flex;
          gap: 5px;
          cursor: pointer;
          text-decoration: underline;
        }

        .schedules > div {
          padding: 0 1em;
        }
      `}</style>
    </div>
  )
}

CommuneSchedules.defaultProps = {
  scheldules: null
}

CommuneSchedules.propTypes = {
  scheldules: PropTypes.array
}

export default CommuneSchedules
