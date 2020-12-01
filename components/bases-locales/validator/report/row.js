import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Line from './line'
import RowIssues from './row-issues'
import {ChevronDown, ChevronUp} from 'react-feather'

class Row extends React.Component {
  state = {
    showIssues: this.isForcedShowIssues,
    field: null
  }

  static propTypes = {
    row: PropTypes.object.isRequired,
    unknownFields: PropTypes.array.isRequired,
    isForcedShowIssues: PropTypes.bool
  }

  static defaultProps = {
    isForcedShowIssues: false
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
    const {row, unknownFields, isForcedShowIssues} = this.props
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
                {showIssues ? 'Masquer' : 'Afficher'} l’anomalie {showIssues ? <ChevronUp style={{verticalAlign: 'middle', color: 'black'}} /> : <ChevronDown style={{verticalAlign: 'middle', color: 'black'}} />}
              </span>
            ) : (
              <span className='error' onClick={this.handleError}>
                {showIssues ? 'Masquer' : 'Afficher'} les {issuesCount} anomalies {showIssues ? <ChevronUp style={{verticalAlign: 'middle', color: 'black'}} /> : <ChevronDown style={{verticalAlign: 'middle', color: 'black'}} />}
              </span>
            )}
          </div>
        </div>

        {showIssues &&
          <div>
            <Line
              line={row}
              unknownFields={unknownFields}
              onHover={this.handleField}
            />

            {(issuesCount > 0 || isForcedShowIssues) && (
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
