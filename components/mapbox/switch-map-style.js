import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'

class SwitchMapStyle extends React.Component {
  static propTypes = {
    isVector: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired
  }

  render() {
    const {isVector, handleChange} = this.props
    const src = `/static/images/preview-${isVector ? 'ortho' : 'vector'}.png`
    const style = isVector ? 'Satellite' : 'Vectoriel'

    return (
      <div className='switch-style'>
        <img
          alt={style}
          src={src}
          onClick={handleChange}
        />
        <div className='text'>{style}</div>
        <style jsx>{`
          .switch-style {
            width: 80px;
            height: 80px;
            border: 2px solid #fff;
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
          }

          img {
            width: 100%;
            height: 100%;
          }

          img:hover {
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
