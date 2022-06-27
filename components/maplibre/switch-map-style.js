import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import theme from '@/styles/theme'

class SwitchMapStyle extends React.Component {
  static propTypes = {
    isVector: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired
  }

  render() {
    const {isVector, handleChange} = this.props
    const src = `/images/preview-${isVector ? 'ortho' : 'vector'}.png`
    const style = isVector ? 'Satellite' : 'Vectoriel'

    return (
      <div className='switch-style'>
        <button
          type='button'
          aria-label={isVector ? 'Passer en vue satellite' : 'Passer en vue vectoriel'}
          onClick={handleChange}
        >
          <Image
            width={80}
            height={80}
            alt={style}
            src={src}
          />
        </button>
        <div className='text'>{style}</div>
        <style jsx>{`
          .switch-style {
            width: 80px;
            height: 80px;
            border: 2px solid #fff;
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
          }

          button {
            border: none;
            background: none;
            padding: 0;
          }

          .switch-style:hover {
            cursor: pointer;
          }

          .text {
            position: relative;
            bottom: 26px;
            left: 4px;
            color: ${isVector ? '#fff' : '#000'}
          }
          `}</style>
      </div>
    )
  }
}

export default SwitchMapStyle
