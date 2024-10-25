import PropTypes from 'prop-types'
import { fr } from '@codegouvfr/react-dsfr'

import { Button } from '@codegouvfr/react-dsfr/Button'

function CadastreLayerControl({ isDisabled, isActived, handleClick }) {
  return (
    <Button
      iconId="ri-layout-line"
      disabled={isDisabled}
      className="maplibregl-ctrl"
      title={`${isActived ? 'Masquer' : 'Afficher'} le cadastre`}
      label={`${isActived ? 'Masquer' : 'Afficher'} le cadastre`}
      onClick={handleClick}
    >
      <div className="maplibregl-ctrl">
        <span className={fr.cx('fr-icon-table-line')} size={18} alt="" aria-hidden="true" />
      </div>

      <style jsx>{`
        .layout-icon {
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

CadastreLayerControl.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isActived: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default CadastreLayerControl
