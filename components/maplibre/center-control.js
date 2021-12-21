import PropTypes from 'prop-types'
import {Crosshair} from 'react-feather'

function CenterControl({isDisabled, handleClick}) {
  return (
    <button
      disabled={isDisabled}
      type='button'
      className='maplibregl-ctrl'
      title='Recentrer la carte'
      onClick={handleClick}
    >
      <Crosshair size={18} color={isDisabled ? '#cdcdcd' : 'black'} />
    </button>
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
