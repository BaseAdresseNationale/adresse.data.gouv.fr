import React from 'react'
import PropTypes from 'prop-types'
import {Check} from 'react-feather'

import Tag from '../../tag'

const SourcesVoie = ({voie}) => {
  const {sourceNomVoie} = voie

  return (
    <div className='source-container'>
      <h3>Origine du nom de la voie</h3>
      <tbody className='table-container'>
        <tr>
          <th />
          <th>Libellé</th>
          <th>Source</th>
          <th>Nombre d’occurences</th>
        </tr>
        {voie.nomsVoie.map(nom => {
          return (
            <tr key={nom.index} className={sourceNomVoie === nom.source ? 'highlighted' : ''} >
              <td className='centered'>
                {sourceNomVoie === nom.source && (
                  <Check style={{verticalAlign: 'middle', margin: 'auto'}} />
                )}
              </td>
              <td>{nom.nomVoie}</td>
              <td><Tag key={nom.source} type={nom.source} style={{display: 'inline-flex'}} /></td>
              <td>{nom.count}</td>
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
        }

        .source-container {
          padding: 15px;
          width: 100%;
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
  voie: PropTypes.shape({
    sourceNomVoie: PropTypes.string.isRequired,
    nomsVoie: PropTypes.array.isRequired
  }).isRequired
}

export default SourcesVoie
