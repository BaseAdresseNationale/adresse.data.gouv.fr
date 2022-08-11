import PropTypes from 'prop-types'
import {Crosshair} from 'react-feather'

import ActionButtonNeutral from '@/components/action-button-neutral'

function CenterControl({isDisabled, handleClick}) {
  return (
    <ActionButtonNeutral
      isFullSize
      disabled={isDisabled}
      title='Recentrer la carte'
      label='Recentrer la carte'
      onClick={handleClick}
    >
      <div className='maplibregl-ctrl cross-icon'>
        <Crosshair size={18} color={isDisabled ? '#cdcdcd' : 'black'} alt />
      </div>

      <style jsx>{`
        .cross-icon {
          width: 29px;
          height: 29px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </ActionButtonNeutral>
  )
}

CenterControl.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
}

CenterControl.defaultProps = {
  isDisabled: false
}

export default CenterControl
