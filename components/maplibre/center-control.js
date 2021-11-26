import PropTypes from 'prop-types'
import {Crosshair} from 'react-feather'

function CenterControl({isDisabled, handleClick, isMultiPositions}) {
  return (
    <button
      disabled={isDisabled}
      type='button'
      className='maplibregl-ctrl'
      title={`Recentrer la carte sur ${isMultiPositions ? 'la position principale' : 'l’adresse'}`}
      onClick={handleClick}
    >
      <Crosshair size={18} color={isDisabled ? '#cdcdcd' : 'black'} />
    </button>
  )
}

CenterControl.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isMultiPositions: PropTypes.bool
}

CenterControl.defaultProps = {
  isDisabled: false,
  isMultiPositions: false
}

export default CenterControl
