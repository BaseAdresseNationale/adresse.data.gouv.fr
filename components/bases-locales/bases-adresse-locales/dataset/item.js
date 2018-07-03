import React from 'react'
import PropTypes from 'prop-types'
import FaAngleRight from 'react-icons/lib/fa/angle-right'

import theme from '../../../../styles/theme'

class Item extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    link: PropTypes.func
  }

  static defaultProps = {
    link: null
  }

  render() {
    const {id, name, link, children} = this.props

    return (
      <div className={`item ${link ? 'selectable' : ''}`} onClick={link ? () => link(id) : () => {}}>
        <div className='infos'>
          <div className='name'><b>{name}</b></div>
          <div>
            {children}
          </div>
        </div>
        <div className='link'>{link && <FaAngleRight />}</div>
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

          .selectable:hover {
            cursor: pointer;
            color: ${theme.colors.white};
            background-color: ${theme.primary};
          }

          .link {
            display: none;
          }

          @media (max-width: 700px) {
            .item {
              flex-direction: column;
              align-items: center;
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
