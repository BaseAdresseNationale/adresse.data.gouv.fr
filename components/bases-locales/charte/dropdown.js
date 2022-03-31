import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronRight, ChevronDown} from 'react-feather'

import theme from '@/styles/theme'

function Dropdown({code, nom, numberOfCommunes, children, size, color}) {
  const [isOpen, setIsOpen] = useState(false)

  const onDropdownOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='dropdown-container'>
      <div className='visible-container'>
        <div className='dropdown-infos-container'>
          <div className='name'>{nom} - {code}</div>
          <div className='communes-length'><b>{numberOfCommunes}</b> {numberOfCommunes <= 1 ? 'commune partenaire' : 'communes partenaires'}</div>
        </div>

        {isOpen ? (
          <ChevronDown
            onClick={onDropdownOpen}
            style={{cursor: 'pointer'}}
            color={color === 'primary' ? theme.primary : theme.colors.white}
          />
        ) : (
          <ChevronRight
            onClick={onDropdownOpen}
            style={{cursor: 'pointer'}}
            color={color === 'primary' ? theme.primary : theme.colors.white}
          />
        )}
      </div>

      {isOpen && children}

      <style jsx>{`
        .dropdown-container {
          background: ${color === 'primary' ? theme.backgroundGrey : theme.primary};
          color: ${color === 'primary' ? theme.darkText : theme.colors.white};
          padding: ${size === 'large' ? '2em' : '1em'};
          width: 100%;
          border-radius: ${theme.borderRadius};
          margin: 1em 0;
          opacity: ${numberOfCommunes === 0 ? '70%' : '100%'};
          pointer-events: ${numberOfCommunes === 0 ? 'none' : 'auto'}
        }

        .visible-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${isOpen ? '2em' : '0'};
        }

        .name {
          font-size: x-large;
          font-weight: bold;
        }

        .communes-length {
          font-size: medium;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

Dropdown.propTypes = {
  code: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  numberOfCommunes: PropTypes.number.isRequired,
  children: PropTypes.node,
  size: PropTypes.oneOf(['large', 'small']),
  color: PropTypes.oneOf(['primary', 'secondary'])
}

Dropdown.defaultProps = {
  children: null,
  size: 'large',
  color: 'primary'
}

export default Dropdown

