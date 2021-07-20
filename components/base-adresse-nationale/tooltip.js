import React from 'react'
import PropTypes from 'prop-types'

function Tooltip({isCertified, message, direction, children}) {
  return (
    <div className={`tooltip tooltip-${direction}`}>
      {children}
      <div className='tooltip-text'>
        {message}
      </div>
      <style jsx>{`
      .tooltip {
        position: relative;
        display: inline-block;
        cursor: help;
      }

      .tooltip-bottom .tooltip-text, .tooltip-left .tooltip-text {
        visibility: hidden;
        width: 154px;
        background-color: #000000d1;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        padding: 5px;

        /* Position the tooltip */
        position: absolute;
        z-index: 1;
      }

      .tooltip-bottom .tooltip-text {
        left: -106px;
        top: 60px;
      }

      .tooltip-left .tooltip-text {
        left: -170px;
        top: -20px;
      }

      .tooltip-bottom .tooltip-text::after, .tooltip-left .tooltip-text::after {
        content: " ";
        position: absolute;
        border-width: 5px;
        border-style: solid;
      }

      .tooltip-bottom .tooltip-text::after {
        margin-left: -5px;
        bottom: 100%;  /* At the top of the tooltip */
        left: 82%;
        border-color: transparent transparent black transparent;
      }

      .tooltip-left .tooltip-text::after {
        left: 100%;  /* At the right of the tooltip */
        bottom: ${isCertified ? '' : '50%'};
        border-color: transparent transparent transparent black;
      }

      .tooltip:hover .tooltip-text {
        visibility: visible;
      }
    `}</style>
    </div>
  )
}

Tooltip.defaultProps = {
  isCertified: null,
  direction: 'bottom'
}

Tooltip.propTypes = {
  isCertified: PropTypes.bool,
  message: PropTypes.string.isRequired,
  direction: PropTypes.oneOf([
    'bottom',
    'left'
  ]),
  children: PropTypes.node.isRequired
}

export default Tooltip
