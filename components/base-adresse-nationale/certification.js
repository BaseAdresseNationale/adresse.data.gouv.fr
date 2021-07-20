import React from 'react'
import PropTypes from 'prop-types'
import {CheckCircle, XOctagon} from 'react-feather'

import theme from '@/styles/theme'

import Tooltip from './tooltip'

function Certification({isCertified, certifiedMessage, notCertifiedMessage, iconSize, tooltipDirection}) {
  return (
    <div>
      {isCertified ? (
        <Tooltip message={certifiedMessage} direction={tooltipDirection}>
          <CheckCircle style={{marginLeft: '.5em', verticalAlign: 'sub'}} color={theme.successBorder} size={iconSize} />
        </Tooltip>
      ) : (
        <Tooltip message={notCertifiedMessage} direction={tooltipDirection}>
          <XOctagon style={{marginLeft: '.5em', verticalAlign: 'sub'}} color={theme.warningBorder} size={iconSize} />
        </Tooltip>
      )}
    </div>
  )
}

Certification.defaultProps = {
  iconSize: 34,
  tooltipDirection: 'bottom'
}

Certification.propTypes = {
  isCertified: PropTypes.bool.isRequired,
  certifiedMessage: PropTypes.string.isRequired,
  notCertifiedMessage: PropTypes.string.isRequired,
  iconSize: PropTypes.number,
  tooltipDirection: PropTypes.oneOf([
    'bottom',
    'left'
  ])
}

export default Certification
