import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

import Line from './line'
import RowIssues from './row-issues'

class Row extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showIssues: props.forceShowIssues,
      field: null
    }
  }

  static propTypes = {
    row: PropTypes.object.isRequired,
    unknownFields: PropTypes.array.isRequired,
    forceShowIssues: PropTypes.bool
  }

  static defaultProps = {
    forceShowIssues: false
  }

  handleError = () => {
    this.setState(state => ({
      showIssues: !state.showIssues,
      field: null
    }))
  }

  handleField = field => {
    this.setState({field})
  }

  render() {
    const {showIssues, field} = this.state
    const {row, unknownFields, forceShowIssues} = this.props
    const issuesCount = row._errors.length + row._warnings.length

    return (
      <div>
        <div className='line'>
          <div className='col'>
            <b>Ligne {row._line}</b> {row.cle_interop.rawValue && `[${row.cle_interop.rawValue}]`}
          </div>
          <div>
            {issuesCount === 1 ? (
              <span className='error' onClick={this.handleError}>
                {showIssues ? 'Masquer' : 'Afficher'} l’anomalie
              </span>
            ) : (
              <span className='error' onClick={this.handleError}>
                {showIssues ? 'Masquer' : 'Afficher'} les {issuesCount} anomalies
              </span>
            )}
          </div>
        </div>

        {showIssues &&
          <div className='row-container'>
            <Line
              line={row}
              unknownFields={unknownFields}
              onHover={this.handleField}
            />

            {(issuesCount > 0 || forceShowIssues) && (
              <RowIssues errors={row._errors} warnings={row._warnings} field={field} />
            )}
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

          .row-container {
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

export default Row
