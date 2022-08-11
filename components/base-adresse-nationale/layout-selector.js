import PropTypes from 'prop-types'
import theme from '@/styles/theme'

import ActionButtonNeutral from '@/components/action-button-neutral'

function LayoutSelector({name, value, icon, isSelected, handleClick}) {
  const Icon = icon
  return (
    <ActionButtonNeutral
      isFullSize
      label={`Sélectionner l'onglet ${name}`}
      onClick={() => handleClick(value)}
    >
      <div className={`layout ${isSelected ? 'selected' : ''}`}>
        <div alt><Icon /></div>
        <div>{name}</div>
      </div>

      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-top: 0.5em;
          gap: 5px;
          color: ${theme.darkText};
        }

        .layout.selected {
          font-weight: bolder;
          margin-top: -4px;
          border-top: 4px solid ${theme.primary};
        }
        `}</style>
    </ActionButtonNeutral>
  )
}

LayoutSelector.defaultProps = {
  isSelected: false
}

LayoutSelector.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  handleClick: PropTypes.func.isRequired
}

export default LayoutSelector
