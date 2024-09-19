'use client'

import { useState, useRef } from 'react'
import styled from 'styled-components'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'

const StyledContainer = styled.div`
  .wrapper {
    > .input {
      display: flex;
      flex-wrap: wrap;

      > div {
        position: relative;
        width: 100%;
        > .menu {
          position: absolute;
          z-index: 999;
          top: 50px;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e5e5;
          border-top: none;
          width: 100%;
          max-height: 200px;
          overflow: auto;

          > option {
            padding: 0.5em 1em;
            cursor: pointer;

            &:hover {
              background: #e5e5e5;
            }
          }
        }
      }

      .fr-badge {
        margin-bottom: 0.5em;
        &:not(:last-child) {
          margin-right: 0.5em;
        }

        button {
          background: none;

          &:hover {
            background: none;
          }
        }
      }
    }
  }
`

interface MultiSelectInputProps {
  label: string
  hint?: string
  isDisabled?: boolean
  options: { label: string, value: string }[]
  onChange: (value: string[]) => void
  value: string[]
  placeholder: string
}

export function MultiSelectInput({
  label,
  hint,
  isDisabled,
  options,
  onChange,
  value,
  placeholder,
}: MultiSelectInputProps) {
  const [search, setSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelect = (newValue: string) => {
    onChange([...value, newValue])
    setSearch('')
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleDelete = (valueToDelete: string) => {
    onChange(value.filter(v => v !== valueToDelete))
  }

  const filteredOptions = options.filter(option => !value.includes(option.value) && option.label.toLowerCase().includes(search.toLowerCase()))

  return (
    <StyledContainer className={`fr-select-group ${isDisabled ? 'fr-select-group--disabled' : ''}`}>
      <label className="fr-label" htmlFor={`select-${label}`}>
        {label}
        {hint && <span className="fr-hint-text">{hint}</span>}
      </label>
      <div className="wrapper">
        <div className="input">
          {value.map(v => (
            <Badge key={v} small>
              {v}
              <Button
                iconId="fr-icon-close-line"
                onClick={() => handleDelete(v)}
                priority="tertiary no outline"
                title="Supprimer"
              />
            </Badge>
          ))}
          <div>
            <Input
              label=""
              nativeInputProps={{
                ref: inputRef,
                placeholder,
                value: search,
                onFocus: () => setIsFocused(true),
                onBlur: () => setIsFocused(false),
                onChange: event => setSearch(event.target.value),
                type: 'text',
              }}
            />
            {isFocused && (
              <div className="menu">
                {filteredOptions.map(option => (
                  <option
                    onClick={() => handleSelect(option.value)}
                    onMouseDown={event => event.preventDefault()}
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StyledContainer>
  )
}

export default MultiSelectInput
