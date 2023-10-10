import PropTypes from 'prop-types'
import styled from 'styled-components'
import {Button} from '@codegouvfr/react-dsfr/Button'

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

export function ImageInput({
  label,
  onChange,
  onClear,
  value,
}) {
  const getBase64 = () => {
    const inputElement = document.querySelector('#logo-upload-input')
    const file = inputElement.files[0]

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', () => {
      onChange(reader.result)
    })
  }

  return (
    <StyledContainer className='fr-upload-group'>
      <label className='fr-label' htmlFor='file'>{label}</label>
      {value ? <div style={{backgroundImage: `url("${value}")`}}>
        <Button iconId='fr-icon-delete-bin-line'
          onClick={onClear}
          title='Supprimer' />
      </div> : <input
        required
        id='logo-upload-input'
        accept='image/png, image/jpeg, image/jpg'
        type='file'
        onChange={getBase64}
      />}
    </StyledContainer>
  )
}

ImageInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  value: PropTypes.string,
}

export default ImageInput
