import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'

import theme from '../../../../../styles/theme'

import Button from '../../../../button'

const STATUS = {
  deleted: {
    text: 'Supprimé',
    color: theme.errorBg,
    labelColor: theme.errorBorder
  },
  edited: {
    text: 'Modifié',
    color: theme.warningBg,
    labelColor: theme.warningBorder
  },
  created: {
    text: 'Ajouté',
    color: theme.successBg,
    labelColor: theme.successBorder
  }
}

class Head extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.string,
    previous: PropTypes.func,
    parent: PropTypes.string
  }

  static defaultProps = {
    status: null,
    parent: null,
    previous: null
  }

  render() {
    const {name, status, parent, previous} = this.props

    return (
      <div className='context-head shadow-box'>
        <div className='title'>
          {previous && (
            <div className='previous-button'>
              <Button size='small' onClick={previous}>
                <FaAngleLeft /> {parent}
              </Button>
            </div>
          )}

          <h2>{name}</h2>
        </div>

        {status && (
          <div className='status'>
            {STATUS[status].text}
          </div>
        )}

        <style jsx>{`
        .context-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1em 0;
          background-color: ${status ? STATUS[status].color : '#fff'};
        }

        .shadow-box {
          border: 1px solid ${theme.border};
          box-shadow: 0 1px 4px 0 ${theme.boxShadow};
          padding: 1em;
        }

        .title {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .previous-button {
          margin-right: 1em;
        }

        h2 {
          margin: 0;
          flex: 1;
        }

        .status {
          background: ${status ? STATUS[status].labelColor : '#fff'};
          padding: 0.5em;
          border-radius: 4px;
          color: #fff;
        }
      `}</style>
      </div>
    )
  }
}

export default Head
