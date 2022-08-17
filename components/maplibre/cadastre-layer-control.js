import PropTypes from 'prop-types'
import {Layout} from 'react-feather'

import theme from '@/styles/theme'

import ActionButtonNeutral from '@/components/action-button-neutral'

function CadastreLayerControl({isDisabled, isActived, handleClick}) {
  return (
    <ActionButtonNeutral
      disabled={isDisabled}
      className='maplibregl-ctrl'
      title={`${isActived ? 'Masquer' : 'Afficher'} le cadastre`}
      label={`${isActived ? 'Masquer' : 'Afficher'} le cadastre`}
      onClick={handleClick}
    >
      <div className='maplibregl-ctrl layout-icon'>
        <Layout color={isDisabled ? '#cdcdcd' : (isActived ? theme.primary : theme.darkText)} size={18} alt aria-hidden='true' />
      </div>

      <style jsx>{`
        .layout-icon {
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

CadastreLayerControl.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isActived: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default CadastreLayerControl
