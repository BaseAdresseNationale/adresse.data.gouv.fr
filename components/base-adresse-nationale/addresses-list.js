import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash'
import {Search} from 'react-feather'

import theme from '@/styles/theme'

import {byText} from '@/lib/filters'

import Loader from '@/components/loader'

function AddressesList({title, subtitle, placeholder, addresses, filterProp, addressComponent}) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filteredList, setFilteredList] = useState(addresses)

  const debounceSearch = useCallback(debounce(input => {
    const filteredList = addresses.filter(address => byText(address[filterProp], input))
    setFilteredList(filteredList)
    setIsLoading(false)
  }, 300), [addresses])

  useEffect(() => {
    setIsLoading(true)
    debounceSearch(input)
  }, [addresses, input, debounceSearch])

  return (
    <div className='addresses'>
      <div className='addresses-heading'>
        <div className='title'>
          <h5>{title}</h5>
          <div>{subtitle}</div>
        </div>
        <div className='search-input'>
          <div className='search-icon'><Search size={18} /></div>
          <input
            type='text'
            placeholder={placeholder || 'Recherche'}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          {isLoading && <div className='loading'><Loader size='small' /></div>}
        </div>
      </div>

      <div className='addresses-list'>
        {filteredList.length > 0 ?
          filteredList.map(address => (
            <div key={address.id} className='address-list'>
              {addressComponent(address)}
            </div>
          )) : (
            <div className='no-result'>Aucun résultat</div>
          )}
      </div>

      <style jsx>{`
        .addresses {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .addresses-list {
          display: flex;
          flex-direction: column;
        }

        .addresses-heading {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0.5em 0;
        }

        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.2em;
        }

        .addresses-heading h5 {
          margin: 0;
        }

        input {
          height: 32px;
          text-indent: 1.2em;
        }

        .search-icon {
          z-index: 1;
          position: absolute;
          top: 7px;
          left: 12px;
          color: ${theme.colors.darkGrey};
        }

        .address-list:nth-child(even) {
          background-color: ${theme.backgroundGrey};
        }

        .no-result {
          text-align: center;
          margin: 1em;
          font-weight: bold;
        }

        .search-input {
          position: relative;
        }

        .loading {
          position: absolute;
          top: 7px;
          left: 90%;
        }
        `}</style>
    </div>
  )
}

AddressesList.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  addresses: PropTypes.array.isRequired,
  filterProp: PropTypes.string.isRequired,
  addressComponent: PropTypes.func.isRequired
}

export default AddressesList
