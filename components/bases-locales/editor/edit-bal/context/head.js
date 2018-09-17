import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'

import theme from '../../../../../styles/theme'

import Button from '../../../../button'

class Head extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    previous: PropTypes.func,
    parent: PropTypes.string
  }

  static defaultProps = {
    parent: null,
    previous: null
  }

  render() {
    const {name, parent, previous} = this.props

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

        <style jsx>{`
        .context-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1em 0;
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
      `}</style>
      </div>
    )
  }
}

export default Head
