import React from 'react'
import PropTypes from 'prop-types'
import {CheckCircle, XOctagon} from 'react-feather'

import theme from '@/styles/theme'

function Certification({isCertified, certifiedMessage, notCertifiedMessage, iconSize}) {
  return (
    <>
      {isCertified ? (
        <div className='certified tooltip'>
          <CheckCircle style={{marginLeft: '.5em', verticalAlign: 'sub'}} color={theme.successBorder} size={iconSize} />
          <span className='tooltip-text'>{certifiedMessage}</span>
        </div >
      ) : (
        <div className='certified tooltip'>
          <XOctagon style={{marginLeft: '.5em', verticalAlign: 'sub'}} color={theme.warningBorder} size={iconSize} />
          <span className='tooltip-text'>{notCertifiedMessage}</span>
        </div>
      )}
      <style jsx>{`
        .certified {
          display: flex;
          align-items: center;
        }

        .tooltip {
          position: relative;
          display: inline-block;
          cursor: help;
        }

        .tooltip .tooltip-text {
          visibility: hidden;
          width: 154px;
          background-color: #000000d1;
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 5px 0;
          left: -106px;
          top: 60px;

          /* Position the tooltip */
          position: absolute;
          z-index: 1;
        }

        .tooltip .tooltip-text::after {
          content: " ";
          position: absolute;
          bottom: 100%;  /* At the top of the tooltip */
          left: 82%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent black transparent;
        }

        .tooltip:hover .tooltip-text {
          visibility: visible;
        }
      `}</style>
    </>
  )
}

Certification.defaultProps = {
  iconSize: 34
}

Certification.propTypes = {
  isCertified: PropTypes.bool.isRequired,
  certifiedMessage: PropTypes.string.isRequired,
  notCertifiedMessage: PropTypes.string.isRequired,
  iconSize: PropTypes.number
}

export default Certification
