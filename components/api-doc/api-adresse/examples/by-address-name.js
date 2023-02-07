import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash'

import theme from '../../../../styles/theme'

import {search} from '@/lib/api-search'
import {useInput} from '@/hooks/input'

import Section from '@/components/section'

import Tuto from '../tuto'
import TryContainer from '../try-container'
import SearchInput from '../../../search-input'
import SwitchInput from '../switch-input'

const TYPES = ['housenumber', 'street', 'locality', 'municipality']

const featuresTypes = {
  housenumber: 'numéro',
  street: 'rue',
  locality: 'lieu-dit',
  hamlet: 'hameau',
  village: 'village',
  city: 'ville',
  municipality: 'commune'
}

const renderQuery = ({input, autocomplete, type}) => {
  if (input) {
    const query = search({
      q: input,
      type,
      autocomplete: autocomplete ? 1 : 0
    })

    return query
  }

  return {url: ''}
}

const renderAdresse = (item, isHighlighted) => {
  const {id, label, context, type} = item
  return (
    <div key={id} className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
      <div>
        <div className='item-label'>{label}</div>
        <div>{context}</div>
      </div>
      <div>{featuresTypes[type]}</div>
      <style jsx>{`
        .item {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          padding: 1em;
        }

        .item .item-label {
          font-weight: 600;
        }

        .item:hover {
          cursor: pointer;
        }

        .item-highlighted {
          background-color: ${theme.primary};
          color: ${theme.colors.white};
        }
        `}</style>
    </div>
  )
}

const renderList = response => {
  if (response?.features) {
    return response.features.map(feature => {
      return {
        ...feature.properties
      }
    })
  }
}

function ByAddressName({title, id, icon}) {
  const [input, setInput] = useInput('20 avenue de Ségur, Paris')
  const [type, setType] = useState('housenumber')
  const [autocomplete, setAutocomplete] = useInput(true)
  const [list, setList] = useState()
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(url))
  const [error, setError] = useState(null)

  const handleType = useCallback(_type => {
    setType(_type === type ? null : _type)
  }, [setType, type])

  const fetchApi = useCallback(debounce(async (input, type, autocomplete) => {
    setIsLoading(true)
    setError(null)

    const rendered = renderQuery({input, type, autocomplete})
    setUrl(rendered.url)

    await fetch(rendered.url)
      .then(response => response.json())
      .then(data => {
        const updatedList = renderList(data)
        setList(updatedList)
      }).catch(error => setError(error))

    setIsLoading(false)
  }, 300), [])

  useEffect(() => {
    if (input) {
      fetchApi(input, type, autocomplete)
    }
  }, [fetchApi, input, type, autocomplete])

  return (
    <Section background='grey'>
      <div id={id}>
        <Tuto
          title={title}
          description='La variable q vous permet d’effectuer une recherche par nom.'
          icon={icon}
          example={url}
          results={list}
          tips='Il est possible d’utiliser la recherche par nom pour faire de l’autocomplétion.'
          side='right'
          isLoading={isLoading}
        />

        <TryContainer error={error}>
          <div className='search-input-container'>
            <SearchInput
              onSearch={setInput}
              onSelect={item => setInput(item.label)}
              placeholder='Chercher une adresse...'
              isLoading={isLoading}
              value={input}
              renderItem={renderAdresse}
              getItemValue={item => item.label}
              results={list}
              wrapperStyle={{position: 'relative'}}
            />
            <SwitchInput handleChange={() => setAutocomplete(!autocomplete)} label='Autocomplétion' isChecked={autocomplete} />
          </div>

          <div>
            <div key='type' className='cat'>
              <h4>Type</h4>
              <div className='fields'>
                {TYPES.map(t => (
                  <div key={t} className='field'>
                    <input
                      type='checkbox'
                      value={t}
                      checked={type === t}
                      onClick={e => handleType(e.target.value)}
                      onChange={() => {}}
                    />
                    <label className='label-inline'>{featuresTypes[t]}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TryContainer>
      </div>
      <style jsx>{`
          .cat {
            margin: 1em 0;
          }

          .fields {
            display: flex;
            flex-flow: wrap;
          }

          .field {
            display: flex;
            margin: 0 1em;
          }

          .search-input-container {
            position: relative;
          }
          `}</style>
    </Section>
  )
}

ByAddressName.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
}

export default ByAddressName
