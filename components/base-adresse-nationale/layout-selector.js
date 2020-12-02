import React from 'react'
import PropTypes from 'prop-types'
import theme from '@/styles/theme'

function LayoutSelector({name, value, icon, isSelected, handleClick}) {
  const Icon = icon
  return (
    <div className={`layout ${isSelected ? 'selected' : ''}`} onClick={() => handleClick(value)}>
      <div>{name}</div>
      <div><Icon /></div>

      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1em;
        }

        .layout.selected {
          font-weight: bolder;
          border-top: 4px solid ${theme.primary};
        }
        `}</style>
    </div>
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
