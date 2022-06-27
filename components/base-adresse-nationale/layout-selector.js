import PropTypes from 'prop-types'
import theme from '@/styles/theme'

function LayoutSelector({name, value, icon, isSelected, handleClick}) {
  const Icon = icon
  return (
    <button
      type='button'
      aria-label={`Sélectionner l'onglet ${name}`}
      className={`layout ${isSelected ? 'selected' : ''}`}
      onClick={() => handleClick(value)}
    >
      <div alt=''><Icon /></div>
      <div>{name}</div>

      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-top: 0.5em;
          gap: 5px;
          background: none;
          border: none;
          color: ${theme.darkText};
        }

        .layout.selected {
          font-weight: bolder;
          margin-top: -4px;
          border-top: 4px solid ${theme.primary};
        }
        `}</style>
    </button>
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
