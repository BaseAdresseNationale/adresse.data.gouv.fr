import PropTypes from 'prop-types'

import Button from '@codegouvfr/react-dsfr/Button'

function CenterControl({ isDisabled, handleClick }) {
  return (
    <Button
      iconId="ri-focus"
      disabled={isDisabled}
      title="Recentrer la carte"
      label="Recentrer la carte"
      onClick={handleClick}
    >
      <div className="maplibregl-ctrl cross-icon">
        <span size={18} color={isDisabled ? '#cdcdcd' : 'black'} alt="" aria-hidden="true" />
      </div>

      <style jsx>{`
        .cross-icon {
          width: 29px;
          height: 29px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}
      </style>
    </Button>
  )
}

CenterControl.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
}

CenterControl.defaultProps = {
  isDisabled: false,
}

export default CenterControl
