import React from 'react'
import PropTypes from 'prop-types'
import {Eye, X} from 'react-feather'

import theme from '@/styles/theme'

class IssueRows extends React.Component {
  static propTypes = {
    issue: PropTypes.shape({
      message: PropTypes.string.isRequired,
      rows: PropTypes.array.isRequired
    }).isRequired,
    rows: PropTypes.array.isRequired,
    type: PropTypes.oneOf(['error', 'warning']).isRequired,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    isSelected: false
  }

  handleClick = () => {
    const {issue, type, onClick} = this.props
    onClick(issue, type)
  }

  render() {
    const {issue, rows, type, isSelected} = this.props
    const issuesRows = issue.rows.length

    return (
      <div className='issue' onClick={this.handleClick}>
        <div>
          <b>{
            issuesRows === rows.length ?
              'Toutes les lignes' :
              (issuesRows === 1 ?
                `La ligne ${issue.rows[0]}` :
                `${issuesRows} lignes`)
          }</b> {issuesRows === 1 ? 'comporte' : 'comportent'} l’anomalie :

          <span className='colored'> {issue.message}</span>

          {isSelected ? (
            <span className='icon'><X style={{verticalAlign: 'middle'}} /></span>
          ) : (
            <span className='icon'><Eye style={{verticalAlign: 'middle'}} /></span>
          )}
        </div>

        <style jsx>{`
            .colored {
              color: ${type === 'error' ? theme.errorBorder : theme.warningBorder};
            }

            .issue {
              padding: .5em;
              background-color: ${isSelected ? '#f8f8f8' : ''};
            }

            .issue:hover {
              cursor: pointer;
              background-color: #f8f8f8;
            }

            .icon {
              margin-left: .5em;
            }
        `}</style>
      </div>
    )
  }
}

export default IssueRows
