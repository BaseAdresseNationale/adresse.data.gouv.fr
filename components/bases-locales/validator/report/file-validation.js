import React from 'react'
import PropTypes from 'prop-types'

import CsvMeta from './csv-meta'

function FileValidation({encoding, delimiter, linebreak, rowsCount}) {
  return (
    <div>
      <h4>Validation de la structure du fichier</h4>
      <div className='items'>
        <CsvMeta
          name='Encodage des caractères'
          value={encoding.value}
          isValid={encoding.isValid}
        />
        <CsvMeta
          name='Délimiteur'
          value={delimiter.value}
          isValid={delimiter.isValid}
        />
        <CsvMeta
          name='Nombre de lignes'
          value={rowsCount}
          isValid
        />
        <CsvMeta
          name='Séparateur de ligne'
          value={linebreak.value}
          isValid={linebreak.isValid}
        />
      </div>

      <style jsx>{`
        .items {
          margin-bottom: 2em;
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(210px,1fr));
          grid-gap: 2em 1em;
        }
        `}</style>
    </div>
  )
}

FileValidation.propTypes = {
  encoding: PropTypes.shape({
    value: PropTypes.string.isRequired,
    isValid: PropTypes.bool.isRequired
  }),
  delimiter: PropTypes.shape({
    value: PropTypes.string.isRequired,
    isValid: PropTypes.bool.isRequired
  }),
  linebreak: PropTypes.shape({
    value: PropTypes.string.isRequired,
    isValid: PropTypes.bool.isRequired
  }),
  rowsCount: PropTypes.number.isRequired
}

export default FileValidation
