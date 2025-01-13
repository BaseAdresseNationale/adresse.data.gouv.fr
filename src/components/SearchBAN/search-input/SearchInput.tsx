import { Fragment, useRef, useState, useCallback } from 'react'
import { useCombobox } from 'downshift'
import { Input } from '@codegouvfr/react-dsfr/Input'

import { useDebouncedCallback } from '@/hooks/useDebounce'

import SearchResultHeader from './SearchResultHeader'
import SearchResultItem from './SearchResultItem'

import {
  SearchComboboxWrapper,
  SearchComboboxInputWrapper,
  SearchComboboxInputLoader,
  SearchComboboxDialog,
  SearchComboboxMenu,
  SearchComboboxMenuItem,
} from './SearchInput.styles'

import type {
  UseComboboxStateChangeOptions,
  UseComboboxState,
} from 'downshift'

interface SearchInputProps {
  children?: React.ReactNode
  placeholder?: string
  itemMenuFormater?: (item: any) => { id: string, header: string, label: string, details: string }
  onSearch: (inputValue: string, signal: AbortSignal) => Promise<any[]>
  onSelect: (selectedItem: any) => void
  onError?: (error: Error) => void
  hasLoader?: boolean
}

interface TypeItem {
  id: string
  header: string
  label: string
  details: string
  properties: { name: string }
}

interface TypeActionAndChanges extends UseComboboxStateChangeOptions<TypeItem> {
  props: { items: TypeItem[] }
}

export default function SearchInput({
  children,
  placeholder,
  itemMenuFormater,
  onSearch,
  onSelect,
  onError,
  hasLoader,
}: SearchInputProps) {
  const controller = useRef<AbortController | null>(null)
  const [items, setItems] = useState<TypeItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onSearchAsync = useCallback(async (...args: [string, AbortSignal]) => {
    setIsLoading(true)
    const results = await onSearch(...args)
    setIsLoading(false)
    return results
  }, [onSearch])

  const stateReducer = useCallback<(state: any, actionAndChanges: UseComboboxStateChangeOptions<TypeItem>) => Partial<UseComboboxState<TypeItem>>>(
    (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          return {
            ...changes,
            inputValue: (changes.inputValue as string).trimStart(),
          }
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
          const selectedValue = changes.selectedItem || (actionAndChanges as TypeActionAndChanges)?.props?.items?.[0]
          onSelect(selectedValue)
          return {
            ...changes,
            ...(selectedValue
              ? {
                  inputValue: selectedValue.properties.name,
                }
              : null),
          }
        default:
          return changes
      }
    },
  [onSelect]
  )

  const onInputValueChange = useDebouncedCallback(async ({ inputValue }: { inputValue: string }) => {
    if (controller.current) {
      controller.current.abort()
    }

    controller.current = new AbortController()

    try {
      const results = await onSearchAsync(inputValue.trim(), controller.current.signal)
      setItems(results)
    }
    catch (err: unknown) {
      if (onError) {
        onError(err as Error)
      }
    }
  }, 300)

  const {
    highlightedIndex,
    selectedItem,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    isOpen,
  } = useCombobox<TypeItem>({
    onInputValueChange,
    items,
    itemToString: item => item ? item.properties.name : '',
    stateReducer,
  })

  return (
    <SearchComboboxWrapper>
      {children && <label {...getLabelProps()}>{children}</label>}

      <SearchComboboxInputWrapper>
        <SearchComboboxInputLoader className={`${hasLoader && isLoading ? 'loading' : ''}`}>
          <i className="search-combobox-input-loader-icon ri-refresh-line" />
        </SearchComboboxInputLoader>

        <Input
          iconId="fr-icon-search-line"
          nativeInputProps={{
            placeholder: placeholder || 'Recherche',
            ...getInputProps(),
          }}
          state="default"
          label={null}
        />
      </SearchComboboxInputWrapper>

      <SearchComboboxDialog open={isOpen}>
        <SearchComboboxMenu
          className={`${!(isOpen) && 'hidden'}`}
          {...getMenuProps()}
        >
          {isOpen
          && items.map((item, index) => {
            const { id, header, label, details }: { id: string, header: string, label: string, details: string } = itemMenuFormater ? itemMenuFormater(item) : item
            return (
              <Fragment key={id || `header-${header}`}>
                {
                  header && (
                    <SearchComboboxMenuItem>
                      <SearchResultHeader header={header} />
                    </SearchComboboxMenuItem>
                  )
                }
                <SearchComboboxMenuItem
                  $isHighlighted={highlightedIndex === index}
                  $isSelected={selectedItem === item}
                  {...(getItemProps({ item, index }))}
                >
                  <SearchResultItem label={label} details={details} />
                </SearchComboboxMenuItem>
              </Fragment>
            )
          })}
        </SearchComboboxMenu>
      </SearchComboboxDialog>
    </SearchComboboxWrapper>
  )
}
