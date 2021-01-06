import React, {useState} from 'react'
import PropTypes from 'prop-types'

import CsvMeta from './csv-meta'
import Fields from './fields'
import Summary from './summary'

import {ChevronDown, ChevronUp} from 'react-feather'
import theme from '@/styles/theme'

function Report({report}) {
  const {knownFields, unknownFields, aliasedFields, fileValidation, rowsWithIssues, issuesSummary, parseMeta, rowsWithIssuesCount} = report
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = open => {
    setIsOpen(open)
  }

  return (
    <div>
      <div className='report-container'>
        {fileValidation &&
          <div>
            <h3>Validation de la structure du fichier</h3>
            <div className='items'>
              <CsvMeta
                name='Encodage des caractères'
                value={fileValidation.encoding.value}
                isValid={fileValidation.encoding.isValid}
              />
              <CsvMeta
                name='Délimiteur'
                value={fileValidation.delimiter.localName}
                isValid={fileValidation.delimiter.isValid}
              />
              <CsvMeta
                name='Nombre de lignes'
                value={parseMeta.rowsCount}
                isValid
              />
              <CsvMeta
                name='Séparateur de ligne'
                value={fileValidation.linebreak.value}
                isValid={fileValidation.linebreak.isValid}
              />
            </div>
          </div>}
      </div>

      <div className='report-container'>
        <div className='flex-container' onClick={() => handleClick(!isOpen)}>
          <h3>Champs existants</h3>
          {isOpen ? (
            <ChevronUp size={40} />
          ) : (
            <ChevronDown size={40} />
          )}
        </div>
        {isOpen && (
          <Fields
            found={knownFields}
            unknown={unknownFields}
            alias={aliasedFields}
          />
        )}
      </div>

      <div className='report-container'>
        <h3>Validation des données</h3>
        <Summary
          rows={rowsWithIssues}
          issuesSummary={issuesSummary}
          unknownFields={unknownFields}
          rowsWithIssuesCount={rowsWithIssuesCount}
        />
      </div>

      <style jsx>{`
        .flex-container {
          display: flex;
          margin: auto;
        }

        .flex-container:hover {
          cursor: pointer;
          background-color: #f8f8f8;
        }

        .report-container {
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

        .valid {
          color: ${theme.successBorder};
        }

        h3 {
          padding: 0 .5em;
        }
      `}</style>
    </div>
  )
}

Report.propTypes = {
  report: PropTypes.shape({
    knownFields: PropTypes.array.isRequired,
    unknownFields: PropTypes.array.isRequired,
    aliasedFields: PropTypes.object.isRequired,
    rowsWithIssues: PropTypes.array.isRequired,
    issuesSummary: PropTypes.object.isRequired,
    parseMeta: PropTypes.object.isRequired,
    rowsWithIssuesCount: PropTypes.number.isRequired,
    fileValidation: PropTypes.shape({
      encoding: PropTypes.object.isRequired,
      delimiter: PropTypes.object.isRequired,
      linebreak: PropTypes.object.isRequired
    })
  }).isRequired
}

export default Report
