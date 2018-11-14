import React from 'react'
import PropTypes from 'prop-types'
import FaCheck from 'react-icons/lib/fa/check'

import theme from '../../../../styles/theme'

import Row from './row'

class Rows extends React.Component {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    rowsWithIssuesCount: PropTypes.number.isRequired,
    unknownFields: PropTypes.array
  }

  static defaultProps = {
    unknownFields: []
  }

  render() {
    const {rows, rowsWithIssuesCount, unknownFields} = this.props

    return (
      <div>
        {rowsWithIssuesCount === 0 && <h3>Aucune ligne avec anomalies trouvée <span className='valid'><FaCheck /></span></h3>}
        {rowsWithIssuesCount === 1 && <h3>{rowsWithIssuesCount} ligne avec anomalies trouvée</h3>}
        {rowsWithIssuesCount > 1 && <h3>{rowsWithIssuesCount} lignes avec anomalies trouvées</h3>}
        {rowsWithIssuesCount > 1000 ?
          <p>Seules les 1000 premières lignes avec anomalies sont affichées ici.</p> :
          null
        }
        <div>
          {rows.map(row => (
            <Row key={`row-${row._line}`} row={row} unknownFields={unknownFields} />
          ))}
        </div>
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
