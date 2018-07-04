import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

import Fields from './fields'
import CsvMeta from './csv-meta'
import Rows from './rows'

class Report extends React.Component {
  render() {
    const {knownFields, unknownFields, aliasedFields, fileValidation, rowsWithErrors, parseMeta, rowsErrorsCount} = this.props.report
    return (
      <div>
        <div className='container'>
          {fileValidation &&
            <div>
              <h3>Validation de la structure du fichier</h3>
              <div className='items'>
                <CsvMeta name='Encodage des caractères' value={fileValidation.encoding.value} isValid={fileValidation.encoding.isValid} />
                <CsvMeta name='Délimiteur' value={fileValidation.delimiter.localName} isValid={fileValidation.delimiter.isValid} />
                <CsvMeta name='Nombre de lignes' value={parseMeta.rowsCount} isValid />
                <CsvMeta name='Séparateur de ligne' value={fileValidation.linebreak.value} isValid={fileValidation.linebreak.isValid} />
              </div>
            </div>}
        </div>

        <div className='container'>
          <h3>Validation des champs</h3>
          <Rows rows={rowsWithErrors} rowsErrorsCount={rowsErrorsCount} />
        </div>

        <div className='container'>
          <h3>Champs existants</h3>
          <Fields found={knownFields} unknown={unknownFields} alias={aliasedFields} />
        </div>

        <style jsx>{`
          .container {
            margin: 2em 0;
            padding: 2em 1em;
            box-shadow: 0 1px 4px ${theme.boxShadow};
            background: ${theme.colors.white};
          }
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
}

Report.propTypes = {
  report: PropTypes.shape({
    knownFields: PropTypes.array.isRequired,
    unknownFields: PropTypes.array.isRequired,
    aliasedFields: PropTypes.object.isRequired,
    rowsWithErrors: PropTypes.array.isRequired,
    parseMeta: PropTypes.object.isRequired,
    rowsErrorsCount: PropTypes.number.isRequired,
    fileValidation: PropTypes.shape({
      encoding: PropTypes.object.isRequired,
      delimiter: PropTypes.object.isRequired,
      linebreak: PropTypes.object.isRequired
    })
  }).isRequired
}

export default Report
