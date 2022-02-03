import PropTypes from 'prop-types'
import {take} from 'lodash'
import {X} from 'react-feather'
import {getLabel} from '@etalab/bal'

import theme from '@/styles/theme'

import Notification from '@/components/notification'

import Row from './row'

const ROWS_LIMIT = 50

function IssueDialog({issue, unknowFields, handleClose}) {
  return (
    <div className='selected-issue'>
      <div className='dialog'>
        <div className='flex-container'>
          <div>
            <h3>Ligne{issue.rows.length > 1 ? 's' : ''} avec l’alerte :</h3>
            <h4>{getLabel(issue.code)}</h4>
          </div>
          <X size={40} style={{cursor: 'pointer'}} onClick={handleClose} />
        </div>
        <div className='scroll'>

          {issue.rows.length > ROWS_LIMIT && (
            <Notification message={`Seules les ${ROWS_LIMIT} premières lignes avec des alertes sont affichées ici`} />
          )}

          {take(issue.rows, ROWS_LIMIT).map(row => (
            <Row
              key={`row-${row.line}`}
              issueType={issue.type}
              row={row}
              unknowFields={unknowFields}
              isForcedShowIssues={issue.rows.length === 1}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .selected-issue {
          background-color: rgba(0,0,0,0.2);
          padding: 2em;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
        }

        .dialog {
          background-color: #fff;
          margin: auto;
          padding: 2em;
          height: 100%;
          max-width: 1400px;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          background: ${theme.colors.white};
        }

        .flex-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        h3, h4 {
          display: flex;
          margin: 1em 0;
        }

        .scroll {
          max-height: 80%;
          overflow: auto;
          padding-top: .5em;
          border-top: 1px solid black;
        }
      `}</style>
    </div>
  )
}

IssueDialog.propTypes = {
  issue: PropTypes.shape({
    code: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    rows: PropTypes.array.isRequired
  }),
  unknowFields: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default IssueDialog
