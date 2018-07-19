import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

const LABELS_COLORS = {
  commune: '#8B572A',
  voie: '#9B9B9B',
  numero: '#63A3FF'
}

class Label extends React.PureComponent {
  state = {}

  static propTypes = {
    newName: PropTypes.string,
    label: PropTypes.shape({
      type: PropTypes.oneOf(Object.keys(LABELS_COLORS)).isRequired,
      text: PropTypes.string.isRequired
    }).isRequired,
    handleClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    newName: null
  }

  render() {
    const {newName, label, handleClick} = this.props
    const {type, text} = label

    return (
      <div className='label' onClick={handleClick}>
        <div className='type'>{type === 'numero' ? 'numéro' : type}</div>
        {newName ? (
          <div>
            <div className='line-through'>{text}</div>
            <div className='text'>{newName}</div>
          </div>
        ) : (
          <div className='text'>{text}</div>
        )}

        <style jsx>{`
          .label {
            display: flex;
            align-items: center;
          }

          .label:hover {
            cursor: pointer;
            font-weight: 600;
          }

          .label:hover .text {
            text-decoration: underline;
          }

          .line-through {
            text-decoration: line-through;
          }

          .type {
            padding: 0.2em 0.5em;
            background-color: ${LABELS_COLORS[type]};
            color: #fff;
            border-radius: 4px;
            margin-right: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default Label
