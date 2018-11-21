import React from 'react'
import PropTypes from 'prop-types'
import FaCheck from 'react-icons/lib/fa/check'

import theme from '../../../../styles/theme'

import Summary from './summary'

class Rows extends React.Component {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    issuesSummary: PropTypes.object.isRequired,
    rowsWithIssuesCount: PropTypes.number.isRequired,
    unknownFields: PropTypes.array
  }

  static defaultProps = {
    unknownFields: []
  }

  render() {
    const {rows, issuesSummary, rowsWithIssuesCount, unknownFields} = this.props

    return (
      <div>
        {rowsWithIssuesCount === 0 ? (
          <h3>Aucune ligne avec anomalies trouvée <span className='valid'><FaCheck /></span></h3>
        ) : (
          <>
            {rowsWithIssuesCount > 1 ? (
              <h3>{rowsWithIssuesCount} lignes avec anomalies trouvées</h3>
            ) : (
              <h3>{rowsWithIssuesCount} ligne avec anomalies trouvée</h3>
            )}

            <Summary
              rows={rows}
              issuesSummary={issuesSummary}
              unknownFields={unknownFields}
            />
          </>
        )}

        <style jsx>{`
          .valid {
            color: ${theme.successBorder};
          }
        `}</style>
      </div>
    )
  }
}

export default Rows
