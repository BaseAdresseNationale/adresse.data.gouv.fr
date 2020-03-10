import React from 'react'
import PropTypes from 'prop-types'

import {Mail, Phone} from 'react-feather'
import colors from '../../styles/colors'

const getHours = time => {
  return new Date('1970-01-01T' + time + 'Z').getHours()
}

const MairieContact = ({nom, horaires, email, telephone}) => {
  const defaultValue = 'Non renseigné'

  return (
    <div className='mairie-contact'>
      <div><b>{nom}</b></div>
      <div className='infos'>
        <div>
          <Mail style={{marginRight: '3px'}} />
          Email: {email ? <a href={`mailto:${email}`}>{email}</a> : defaultValue}
        </div>
        <div>
          <Phone style={{marginRight: '3px'}} />
          Téléphone: {telephone ? <a href={`tel:+33${telephone}`}>{telephone}</a> : defaultValue}
        </div>

        <div className='horaires'>
          Horaires d’ouverture :
          <div>
            {horaires ? (
              horaires.map(horaire => (
                <div key={`${horaire.du}-${horaire.au}`}>
                  <div>
                    <b>{horaire.du === horaire.au ? `Le ${horaire.du}` : `Du ${horaire.du} au ${horaire.au}}`}</b> :
                  </div>
                  <ul>
                    {horaire.heures.map(heure => (
                      <li key={`${heure.de}-${heure.a}`}>
                        De <b>{getHours(heure.de)}h</b> à <b>{getHours(heure.a)}h</b>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : defaultValue}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mairie-contact {
          margin: 1em 0;
          background-color: ${colors.lighterGrey};
        }

        .mairie-contact > div {
          display: flex;
          flex-direction: column;
        }

        .infos {
          display: flex;
          padding: 1em;
        }

        .infos > div {
          display: flex;
          margin: 0.5em 0;
        }

        .infos a {
          margin: 0 0.2em;
        }

        .horaires {
          display: flex;
          flex-direction: column;
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
