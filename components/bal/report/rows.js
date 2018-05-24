import React from 'react'
import PropTypes from 'prop-types'
import FaCheck from 'react-icons/lib/fa/check'

import theme from '../../../styles/theme'

import Row from './row'

class Rows extends React.Component {
  render() {
    const {rows, rowsErrorsCount} = this.props
    return (
      <div>
        {rowsErrorsCount === 0 && <h3>Aucune anomalie trouvée <span className='valid'><FaCheck /></span></h3>}
        {rowsErrorsCount === 1 && <h3>{rowsErrorsCount} anomalie trouvée</h3>}
        {rowsErrorsCount > 1 && <h3>{rowsErrorsCount} anomalies trouvées</h3>}
        <div>
          {rows.map(row => <Row key={`row-${row._line}`} row={row} />)}
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

Rows.propTypes = {
  rows: PropTypes.array.isRequired,
  rowsErrorsCount: PropTypes.number.isRequired
}

export default Rows
