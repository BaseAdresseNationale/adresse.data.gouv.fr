import PropTypes from 'prop-types'
import Image from 'next/image'
import {capitalize} from 'lodash'

import languesRegionales from '@ban-team/shared-data/langues-regionales.json'

import theme from '@/styles/theme'

import Tooltip from '@/components/base-adresse-nationale/tooltip'

function FoundFields({fields}) {
  return (
    <>
      <h4>Champs présents</h4>
      <table>
        <tbody>
          <tr>
            <th>Nom du champ dans le fichier</th>
            <th>Nom du champ dans la spécification</th>
            <th>Version de la spécification</th>
          </tr>
          {fields.length > 0 ? fields.map(field => (
            <tr key={field.name} className={field.exactMatch ? 'background-green' : (field.exactMatch === false ? 'background-red' : 'background-grey')}>
              <td className='lr-field'>
                {field.name}
                {field.locale && (
                  <Tooltip
                    message={
                      <div className='lr-tooltip'>
                        Langue régionale
                        <div className='lr'>
                          {capitalize(languesRegionales.find(langue => langue.code === field.locale).label)}
                        </div>
                      </div>
                    }
                  >
                    <Image src={`/images/icons/flags/${field.locale}.svg`} height={25} width={25} />
                  </Tooltip>
                )}
              </td>
              <td>{field.schemaName}</td>
              <td>{field.version}</td>
            </tr>
          )) : (
            <tr>
              <td className='background-red'>Aucun champ présent</td>
            </tr>
          )}
        </tbody>
        <style jsx>{`
          .background-green {
            background-color: ${theme.successBg};
          }

          .background-red {
            background-color: ${theme.warningBg};
          }

          .background-grey {
            background-color: ${theme.borderLighter};
          }

          table {
            width: 100%;
          }

          th, td {
            padding: 0.5em;
          }

          .lr-field {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .lr-tooltip {
            width: 125px;
            font-size: 16px;
            font-weight: bold;
          }

          .lr {
            font-size: 14px;
            font-style: italic;
          }
        `}</style>
      </table>
    </>
  )
}

FoundFields.propTypes = {
  fields: PropTypes.array.isRequired
}

export default FoundFields
