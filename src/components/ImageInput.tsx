'use client'

import styled from 'styled-components'
import { Button } from '@codegouvfr/react-dsfr/Button'

const StyledContainer = styled.div`
    margin-bottom: 1.5rem;
    
    > div {
        position: relative;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        height: 150px;
        width: 100%;

        > button {
            position: absolute;
            top: 0;
            right: 0;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            margin: 0;

            &:hover {
              color: white;
            }
        }
    }
`

interface ImageInputProps {
  label: string
  onChange: (value: string) => void
  onClear?: () => void
  value?: string
}

export function ImageInput({
  label,
  onChange,
  onClear,
  value,
}: ImageInputProps) {
  const getBase64 = () => {
    const inputElement = document.querySelector('#logo-upload-input') as HTMLInputElement
    const file = inputElement?.files && inputElement?.files[0]

    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        onChange(reader.result as string)
      })
    }
  }

  return (
    <StyledContainer className="fr-upload-group">
      <label className="fr-label" htmlFor="file">{label}</label>
      {value
        ? (
            <div style={{ backgroundImage: `url("${value}")` }}>
              <Button
                iconId="fr-icon-delete-bin-line"
                onClick={onClear}
                title="Supprimer"
              />
            </div>
          )
        : (
            <input
              required
              id="logo-upload-input"
              accept="image/png, image/jpeg, image/jpg"
              type="file"
              onChange={getBase64}
            />
          )}
    </StyledContainer>
  )
}

export default ImageInput
