import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

import Action from './action'

const COLORS = {
  deleted: theme.errorBg,
  edited: theme.warningBg,
  created: theme.successBg
}

class Item extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    newName: PropTypes.string,
    childs: PropTypes.string,
    status: PropTypes.string,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        func: PropTypes.func.isRequired
      }).isRequired
    ).isRequired,
    handleClick: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  static defaultProps = {
    newName: null,
    status: null,
    childs: null,
    children: null
  }

  render() {
    const {name, newName, childs, status, handleClick, actions, children} = this.props

    return (
      <div className='item-container'>
        <div className='item'>
          <div className='infos' onClick={handleClick}>
            <div>
              {newName ? (
                <div>
                  <div className='line-through'>{name}</div>
                  <div><b>{newName}</b></div>
                </div>
              ) : (
                <div><b>{name}</b></div>
              )}
            </div>
            {childs && (
              <div>{childs}</div>
            )}
          </div>

          <div className='actions'>
            {actions.map(action => (
              <Action
                key={`${action.type} ${name}`}
                action={action}
              />
            ))}
          </div>
        </div>

        {children && (
          <div className='editing'>
            {children}
          </div>
        )}

        <style jsx>{`
          .item-container {
            display: flex;
            flex-direction: column;
            margin: 0.3em 0;
          }

          .item {
            display: flex;
            flex: 1;
            justify-content: space-between;
          }

          .line-through {
            text-decoration: line-through;
          }

          .infos {
            display: flex;
            justify-content: space-between;
            width: 100%;
            align-items: center;
            border: 1px solid ${theme.border};
            background-color: ${COLORS[status] || '#fff'};
            padding: 0.5em 1em;
          }

          .infos:hover {
            cursor: pointer;
            color: ${theme.colors.white};
            background-color: ${theme.primary};
          }

          .actions {
            display: flex;
            justify-content: center;
            border-left: 1px solid #ddd;
            align-items: center;
          }

          .editing {
            padding: 2em;
            margin-top: 0.3em;
            border: 1px solid ${theme.border};
          }

          @media (max-width: 700px) {
            .infos {
              display: flex;
              flex-direction: column;
              align-items: self-start;
            }

            .actions {
              display: flex;
              width: 30%;
              flex-direction: column;
              align-items: center;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Item
