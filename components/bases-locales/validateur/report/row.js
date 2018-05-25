import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

import Line from './line'
import RowErrors from './row-errors'

class Row extends React.Component {
  constructor(props) {
    super(props)
    this.state = {showErr: false, field: null}
    this.handleError = this.handleError.bind(this)
    this.handleField = this.handleField.bind(this)
  }

  handleError() {
    this.setState({showErr: !this.state.showErr, field: null})
  }

  handleField(field) {
    this.setState({field})
  }

  render() {
    const {showErr, field} = this.state
    const {row} = this.props
    const errCount = row._errors.length

    return (
      <div>
        <div className='line'>
          <div className='col'>
            <b>Ligne {row._line}</b> {row.cle_interop.rawValue && `[${row.cle_interop.rawValue}]`}
          </div>
          <div>
            {errCount > 0 && (
              errCount === 1 ? <span className='error' onClick={this.handleError}>{showErr ? 'Masquer' : 'Afficher'} l’anomalie</span> :
              <span className='error' onClick={this.handleError}>{showErr ? 'Masquer' : 'Afficher'} les {errCount} anomalies</span>)
            }
          </div>
        </div>

        {showErr &&
          <div className='container'>
            <Line line={row} onHover={this.handleField} />
            {row._errors.length > 0 && <RowErrors errors={row._errors} field={field} />}
          </div>}

        <style jsx>{`
          .line {
            display: flex;
            align-items: center;
          }

          .col {
            margin: 0.5em 1em 0.5em 0;
          }

          .error {
            color: ${theme.errorBorder};
          }

          .error:hover {
            cursor: pointer;
            text-decoration: underline;
          }

          .container {
            margin: 1em 0;
            padding: 1em;
            box-shadow: 0 1px 4px ${theme.boxShadow};
          }

          span {
            color: ${theme.darkText};
            text-decoration: italic;
          }
          `}</style>
      </div>
    )
  }
}

Row.propTypes = {
  row: PropTypes.object.isRequired
}

export default Row
