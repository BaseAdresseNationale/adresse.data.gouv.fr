
import PropTypes from 'prop-types'
import {Fragment, useRef, useState, useCallback} from 'react'
import {useCombobox} from 'downshift'
import {debounce} from 'lodash'
import {fr} from '@codegouvfr/react-dsfr'
import {Input} from '@codegouvfr/react-dsfr/Input'

import SearchResultHeader from './search-result-header'
import SearchResultItem from './search-result-item'

export default function SearchInput({
  children,
  placeholder,
  itemMenuFormater,
  onSearch,
  onSelect,
  onError,
  hasLoader,
}) {
  const controller = useRef(null)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const onSearchAsync = useCallback(async (...args) => {
    setIsLoading(true)
    const results = await onSearch(...args)
    setIsLoading(false)
    return results
  }, [onSearch])
  const stateReducer = useCallback((state, actionAndChanges) => {
    const {type, changes} = actionAndChanges
    switch (type) {
      case useCombobox.stateChangeTypes.InputChange:
        return {
          ...changes,
          inputValue: changes.inputValue?.trimLeft(),
        }
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
        onSelect(changes.selectedItem)
        return {
          ...changes,
          ...(changes.selectedItem && {
            inputValue: changes.selectedItem.properties.name,
          }),
        }
      default:
        return changes
    }
  }, [onSelect])

  const {
    highlightedIndex,
    selectedItem,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    isOpen,
  } = useCombobox({
    onInputValueChange: debounce(async ({inputValue}) => {
      if (controller.current) {
        controller.current.abort()
      }

      controller.current = new AbortController()
      try {
        const results = await onSearchAsync(inputValue.trim(), controller.current.signal)
        setItems(results)
      } catch (err) {
        if (onError) {
          onError(err)
        }
      }
    }, 500),
    items,
    itemToString: item => item ? item.properties.name : '',
    stateReducer,
  })

  return (
    <>
      <div className='search-combobox-wrapper'>
        {children && <label {...getLabelProps()}>{children}</label>}
        <div className='search-combobox-input-wrapper'>
          <div className={`search-combobox-input-loader ${hasLoader && isLoading ? 'loading' : ''}`}>
            <i className={fr.cx('search-combobox-input-loader-icon', 'ri-refresh-line')} />
          </div>
          <Input
            iconId='fr-icon-search-line'
            nativeInputProps={{
              autoComplete: 'off',
              placeholder: placeholder || 'Recherche',
              ...getInputProps()
            }}
            state='default'
          />
        </div>
        <dialog className='search-combobox-dialog' open={isOpen}>
          <ul
            className={`search-combobox-menu ${!(isOpen) && 'hidden'}`}
            {...getMenuProps()}
          >
            {isOpen &&
          items.map((item, index) => {
            const {id, header, label, details} = itemMenuFormater ? itemMenuFormater(item) : item
            return (
              <Fragment key={id || `header-${header}`}>
                {
                  header && (
                    <li className='search-combobox-menu-header'>
                      <SearchResultHeader header={header} />
                    </li>
                  )
                }
                <li
                  className={`search-combobox-menu-item ${
                    highlightedIndex === index && 'search-combobox-menu-item-highlighted'} ${
                    selectedItem === item && 'search-combobox-menu-item-selected'
                  }`}
                  {...(getItemProps({item, index}))}
                >
                  <SearchResultItem label={label} details={details} />
                </li>
              </Fragment>
            )
          })}
          </ul>
        </dialog>

      </div>
      <style jsx>{`
      .search-combobox-wrapper {
        position: relative;
      }
      .search-combobox-input-wrapper {
        position: relative;
      }
      .search-combobox-input-wrapper :global(*.fr-input-wrap)::before {
        z-index: 1;
      }
      .search-combobox-input-loader {
        position: absolute;
        content: '';
        right: 0;
        top: 0;
        z-index: 1;
        width: 2.5em;
        height: 2.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(-1.5em);
        opacity: 0;
        transition: opacity 0.25s ease .25s;
      }
      .search-combobox-input-loader.loading {
        opacity: 1;
        transition: opacity 0.25s ease;
      }
      .search-combobox-input-loader .search-combobox-input-loader-icon {
        animation:rotate 2s infinite;
        animation-timing-function: cubic-bezier(0.25, 0.5, 0.25, 0.5);
      }
      @keyframes rotate {
          from { -webkit-transform: rotate(0deg) }
          to { -webkit-transform: rotate(360deg) }
      }
      .search-combobox-dialog {
        width: 100%;
        z-index: 1;
        padding: 0;
        border: none;
        overflow: visible;
      }
      .search-combobox-menu {
        left: 0;
        right: 0;
        background: white;
        list-style: none;
        padding: 0;
        margin: 0;
        box-shadow: 0 0 7px -2px rgba(0, 0, 0, 0.75)
      }
      .search-combobox-menu-header,
      .search-combobox-menu-item {
        margin: 0;
        padding: 0;
      }
      .search-combobox-menu-item-highlighted {
        background-color: #3182ce;
        color: white;
      }
      .search-combobox-menu-item-selected {
        border-left: 2px solid #3182ce;
      }
    `}</style>`
    </>
  )
}

SearchInput.propTypes = {
  children: PropTypes.node,
  placeholder: PropTypes.string,
  itemMenuFormater: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onError: PropTypes.func,
  hasLoader: PropTypes.bool,
}
