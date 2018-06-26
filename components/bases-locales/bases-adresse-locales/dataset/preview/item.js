import React from 'react'
import PropTypes from 'prop-types'
import FaAngleRight from 'react-icons/lib/fa/angle-right'

import theme from '../../../../../styles/theme'

class Item extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    info: PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node
      ])
    }).isRequired,
    link: PropTypes.func.isRequired
  }

  render() {
    const {id, name, info, link} = this.props

    return (
      <div className='item' onClick={() => link(id)}>
        <div className='infos'>
          <div className='name'><b>{name}</b></div>
          {info.value ? (
            <div><b>{info.value}</b> {info.title}</div>
          ) : (
            <div>Non renseigné</div>
          )}
        </div>
        <div className='link'><FaAngleRight /></div>
        <style jsx>{`
          .container {
            width: 100;
            display: flex;
            flex-direction: column;
          }

          .item {
            display: flex;
            justify-content: space-between;
            align-item: center;
            border: 1px solid ${theme.border};
            padding: 1em;
            margin: 0.2em 0;
          }

          .infos {
            display: flex;
            flex-grow: 1;
            justify-content: space-between;
          }

          .name {
            font-size: 18px;
          }

          .item:hover {
            cursor: pointer;
            color: ${theme.colors.white};
            background-color: ${theme.primary};
          }

          .link {
            display: none;
          }

          @media (max-width: 580px) {
            .item {
              flex-direction: column;
              aling-item: center;
              flex-flow: wrap;
            }

            .infos {
              flex-direction: column;
            }


            .name {
              font-size: initial;
            }

            .link {
              display: block;
              margin: 1em;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Item
