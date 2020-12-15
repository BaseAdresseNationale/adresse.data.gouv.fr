import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash'
import {Search} from 'react-feather'

import theme from '@/styles/theme'

import {byText} from '@/lib/filters'

import Loader from '@/components/loader'

import Voie from './voie'

function VoiesList({voies, nbVoies, selectVoie}) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filteredList, setFilteredList] = useState(voies)

  const debounceSearch = useCallback(debounce(input => {
    const filteredList = voies.filter(({nomVoie}) => byText(nomVoie, input))
    setFilteredList(filteredList)
    setIsLoading(false)
  }, 300), [voies])

  useEffect(() => {
    setIsLoading(true)
    debounceSearch(input)
  }, [voies, input, debounceSearch])

  return (
    <div className='voies'>
      <div className='voies-heading'>
        <div className='title'>
          <h5>Voies de la commune</h5>
          <div>{nbVoies} voies répertoriées</div>
        </div>
        <div className='search-input'>
          <div className='search-icon'><Search size={18} /></div>
          <input
            type='text'
            placeholder='Rechercher une voie'
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          {isLoading && <div className='loading'><Loader size='small' /></div>}
        </div>
      </div>

      <div className='voies-list'>
        {filteredList.length > 0 ?
          filteredList.map(voie => (
            <div key={voie.idVoie} className='voie-list'>
              <Voie {...voie} handleClick={() => selectVoie(voie)} />
            </div>
          )) : (
            <div className='no-result'>Aucune voie trouvée</div>
          )}
      </div>

      <style jsx>{`
        .voies {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .voies-list {
          display: flex;
          flex-direction: column;
        }

        .voies-heading {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0.5em 0;
        }

        .title {
          display: flex;
          justify-content: space-between;
        }

        .voies-heading h5 {
          margin-bottom: 0.5em;
        }

        input {
          height: 32px;
          text-indent: 2em;
        }

        .search-icon {
          z-index: 1;
          position: absolute;
          top: 7px;
          left: 12px;
          color: ${theme.colors.darkGrey};
        }

        .voie-list:nth-child(even) {
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

VoiesList.propTypes = {
  voies: PropTypes.array.isRequired,
  nbVoies: PropTypes.number.isRequired,
  selectVoie: PropTypes.func.isRequired
}

export default VoiesList
