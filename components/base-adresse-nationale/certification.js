import PropTypes from 'prop-types'
import {CheckCircle, XOctagon} from 'react-feather'

import theme from '@/styles/theme'

import Tooltip from './tooltip'

function Certification({isCertified, certifiedMessage, notCertifiedMessage, iconSize, validIconColor, tooltipDirection}) {
  return (
    <div>
      {isCertified && (
        <Tooltip message={certifiedMessage} direction={tooltipDirection}>
          <CheckCircle style={{marginLeft: '.5em', verticalAlign: 'sub'}} color={validIconColor} size={iconSize} alt='' />
        </Tooltip>
      )}

      {!isCertified && notCertifiedMessage && (
        <Tooltip message={notCertifiedMessage} direction={tooltipDirection}>
          <XOctagon style={{marginLeft: '.5em', verticalAlign: 'sub'}} color={theme.warningBorder} size={iconSize} alt='' />
        </Tooltip>
      )}
    </div>
  )
}

Certification.defaultProps = {
  iconSize: 34,
  validIconColor: theme.successBorder,
  tooltipDirection: 'bottom',
  notCertifiedMessage: null
}

Certification.propTypes = {
  isCertified: PropTypes.bool.isRequired,
  certifiedMessage: PropTypes.string.isRequired,
  notCertifiedMessage: PropTypes.string,
  iconSize: PropTypes.number,
  validIconColor: PropTypes.string,
  tooltipDirection: PropTypes.oneOf([
    'bottom',
    'left'
  ])
}

export default Certification
