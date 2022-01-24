import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {Mail, Phone, ChevronRight, ChevronDown} from 'react-feather'

import colors from '@/styles/colors'
import theme from '@/styles/theme'

const getHours = time => {
  return new Date('1970-01-01T' + time + 'Z').getHours()
}

function MairieContact({nom, horaires, email, telephone}) {
  const defaultValue = 'Non renseigné'
  const [areSchedulesVisible, setAreSchedulesVisible] = useState(false)

  const toggleSchedules = () => {
    setAreSchedulesVisible(!areSchedulesVisible)
  }

  return (
    <div className='mairie-infos'>
      <div className='mairie-name'>
        <Image src='/images/icons/commune.svg' height={80} width={80} />
        <b>{nom}</b>
      </div>
      <div>
        <div className='contact-infos'>
          <div className='contact-info'>
            <Mail style={{marginRight: '10px'}} />
            {email ? <a href={`mailto:${email}`}>{email}</a> : defaultValue}
          </div>
          <div className='contact-info'>
            <Phone style={{marginRight: '10px'}} />
            {telephone ? <a href={`tel:+33${telephone}`}>{telephone}</a> : defaultValue}
          </div>
        </div>

        <div className='horaires'>
          <div className='horaire-dropdown' onClick={toggleSchedules}>Horaires d’ouverture
            {areSchedulesVisible ? <ChevronDown style={{marginTop: '2px'}} /> : <ChevronRight style={{marginTop: '2px'}} />}
          </div>

          <div className='horaires-list'>
            {horaires ? (
              areSchedulesVisible && (
                horaires.map(horaire => (
                  <div key={`${horaire.du}-${horaire.au}`}>
                    <div>
                      <b>{horaire.du === horaire.au ? `Le ${horaire.du}` : `Du ${horaire.du} au ${horaire.au}`}</b> :
                    </div>
                    <ul>
                      {horaire.heures.map(heure => (
                        <li key={`${horaire.du}-${horaire.au}&${heure.de}-${heure.a}`}>
                          De <b>{getHours(heure.de)}h</b> à <b>{getHours(heure.a)}h</b>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )
            ) : defaultValue}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mairie-infos {
          margin-top: 1em;
          padding: 1em;
          background-color: ${colors.lighterGrey};
        }

        .mairie-infos > div {
          margin-top: 1em;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mairie-name {
          font-size: 26px;
        }

        .contact-infos {
          display: flex;
          flex-direction: column;
          padding-bottom: 1em;
          gap: 1em;
        }

        .contact-info {
          display: flex;
        }

        .horaires {
          width: 80%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 1em;
          gap: 1em;
          border-top: 2px solid ${theme.borderLighter};
        }

        .horaire-dropdown {
          font-size: 17px;
          font-weight: bolder;
          display: flex;
          gap: 5px;
          cursor: pointer;
          text-decoration: underline;
        }

        .horaires > div {
          padding: 0 1em;
        }
      `}</style>
    </div>
  )
}

MairieContact.defaultProps = {
  email: null,
  telephone: null,
  horaires: null
}

MairieContact.propTypes = {
  nom: PropTypes.string.isRequired,
  email: PropTypes.string,
  telephone: PropTypes.string,
  horaires: PropTypes.array
}

export default MairieContact
