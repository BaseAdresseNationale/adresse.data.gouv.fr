import PropTypes from 'prop-types'
import {X} from 'react-feather'

import theme from '@/styles/theme'

export default function SearchSelected({value, onReset}) {
  return (
    <div className='search-selected'>
      {value}
      <button title='Réinitialiser le filtrage' type='button' onClick={onReset}>
        <X alt='' aria-hidden='true' />
      </button>
      <style jsx>{`
            .search-selected {
              background-color: ${theme.colors.white};
              flex-grow: 1;
              border: 1px solid ${theme.border};
              border-radius: 2px 2px 2px 2px;
              font-weight: 600;
              height: 56px;
              display: flex;
              flex-flow: row;
              justify-content: space-between;
              align-items: center;
              padding: 1em;
            }
            .search-selected button:hover {
              background: transparent;
              color: ${theme.colors.darkGrey};
            }
            `}</style>
    </div>
  )
}

SearchSelected.propTypes = {
  value: PropTypes.string,
  onReset: PropTypes.func.isRequired
}
