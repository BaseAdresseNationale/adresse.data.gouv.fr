import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import FaClose from 'react-icons/lib/fa/close'
import FaCheck from 'react-icons/lib/fa/check'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'

import theme from '../../../../styles/theme'

const fieldToFind = [
  'cle_interop',
  'uid_adresse',
  'voie_nom',
  'numero',
  'suffixe',
  'commune_nom',
  'position',
  'x',
  'y',
  'long',
  'lat',
  'source',
  'date_der_maj'
]

const KnownFields = ({found, alias}) => (
  <table id='fieldToFind'>
    <tbody>
      <tr>
        <th>Champs obligatoire</th>
        <th>Présent</th>
      </tr>
      {fieldToFind.map(field => (
        <tr key={field}>
          <td>{field}</td>
          {found.includes(field) ?
            alias[field] ? (
              <Fragment>
                <td className='warning'><FaExclamationTriangle /></td>
                <td className='warning message'><b>{alias[field]}</b> n’est pas standard</td>
              </Fragment>
            ) : (
              <td className='found'><FaCheck /></td>
            ) : (
              <td className='not-found'><FaClose /></td>
            )
          }
        </tr>
      ))}
    </tbody>
    <style jsx>{`
      .container {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(300px, 1fr));
        grid-gap: 2em 1em;
      }

      .found {
        color: ${theme.successBorder};
      }

      .not-found {
        color: ${theme.errorBorder};
      }

      .warning {
        color: ${theme.warningBorder};
      }

      .message {
        background-color: ${theme.colors.white};
      }

      th, td {
        padding: 0.5em;
      }

      tr:nth-child(2n) {
        background-color: ${theme.backgroundGrey};
      }

      td:nth-child(2n) {
        text-align: center;
      }
      `}</style>
  </table>
)

KnownFields.propTypes = {
  found: PropTypes.array,
  alias: PropTypes.object.isRequired
}

KnownFields.defaultProps = {
  found: []
}

export default KnownFields
