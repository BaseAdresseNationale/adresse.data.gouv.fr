import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronRight, ChevronDown} from 'react-feather'

import theme from '@/styles/theme'

import ActionButtonNeutral from '@/components/action-button-neutral'

const getHours = time => {
  const getHour = time.slice(0, 2).replace('0', '')
  const getMinutes = time.slice(3, 5).replace('00', '')

  return getHour + 'h' + getMinutes
}

function CommuneSchedules({scheldules}) {
  const [isDisplayed, setIsDisplay] = useState(false)

  const toggleSchedules = () => {
    setIsDisplay(!isDisplayed)
  }

  return (
    <div className='schedules'>
      <ActionButtonNeutral label={`${isDisplayed ? 'Masquer' : 'Afficher'} les horaires de la mairie`} onClick={toggleSchedules}>
        <div className='scheldule-dropdown'>
          Horaires d’ouverture
          {isDisplayed ? (
            <ChevronDown style={{marginTop: '2px'}} alt aria-hidden='true' />
          ) : (
            <ChevronRight style={{marginTop: '2px'}} alt aria-hidden='true' />
          )}
        </div>
      </ActionButtonNeutral>

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
                    <li key={`${scheldule.du}-${scheldule.au}&${heure.de}-${heure.a}`} aria-label={`${getHours(heure.de)} heures à ${getHours(heure.a)} heures`}>
                      <div aria-hidden='true'>De <b>{getHours(heure.de)}</b> à <b>{getHours(heure.a)}</b></div>
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
          align-items: center;
          gap: 5px;
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
