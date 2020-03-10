import React from 'react'
import PropTypes from 'prop-types'
import {Check} from 'react-feather'

import Tag from '../../tag'

const SourcesVoie = ({numero}) => {
  const {adressesOriginales} = numero

  return (
    <div className='source-container'>
      <h3>Origine de la position</h3>
      {/* <div className='resume centered'></div> */}
      <tbody className='table-container'>
        <tr>
          <th />
          <th>Source</th>
          <th>Type de position</th>
        </tr>
        {adressesOriginales.map(adresse => {
          return (
            <tr key={adresse.index} className={numero.sourcePosition === adresse.sourcePosition ? 'highlighted' : ''}>
              <td className='centered'>
                {numero.sourcePosition === adresse.sourcePosition && (
                  <Check style={{verticalAlign: 'middle', margin: 'auto'}} />
                )}
              </td>
              <td><Tag key={adresse.source} type={adresse.source} style={{display: 'inline-flex'}} /></td>
              <td>{adresse.positionType || adresse.typePosition || 'inconnu'}</td>
            </tr>
          )
        })}
      </tbody>
      <style jsx>{`
        h3 {
          margin-top: 1em;
          margin-bottom: 0;
        }

        th {
          background-color: #0053b3;
          color: #ffffff;
        }

        td, th {
          padding: .5em;
          border: .5px solid lightgrey;
          text-align: center;
        }

        .source-container {
          width: 50%;
          padding: 15px;
        }

        .table-container {
          width: 100%;
          display: inline-table;
          border: .5px solid lightgrey;
          margin-bottom: 1.5em;
        }

        .resume {
          padding: 1em;
        }

        .centered {
          text-align: center;
        }

        .highlighted {
          background-color: #d6f5d6;
        }

        `}</style>
    </div>
  )
}

SourcesVoie.propTypes = {
  numero: PropTypes.shape({
    sourcePosition: PropTypes.string.isRequired,
    adressesOriginales: PropTypes.array.isRequired
  }).isRequired
}

export default SourcesVoie
