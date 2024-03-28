import PropTypes from 'prop-types'
import {positionTypeOptions} from './use-signalement'
import Input from '@codegouvfr/react-dsfr/Input'
import SelectInput from '@/components/common/form-inputs/select-input'
import {X} from 'react-feather'
import styled from 'styled-components'

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    
`

export default function PositionInput({position, positionType, onDelete, onEditPositionType}) {
  return (
    <StyledContainer>
      <SelectInput
        label='Type de position*'
        value={positionType}
        options={positionTypeOptions}
        handleChange={type => onEditPositionType({
          position,
          positionType: type,
        })} />
      <Input
        label='Longitude'
        disabled
        nativeInputProps={{
          style: {width: 90, padding: 5, marginLeft: 10, marginRight: 10},
          value: position.coordinates[0]}}
      />
      <Input
        label='Latitude'
        disabled
        nativeInputProps={{
          style: {width: 90, padding: 5},
          value: position.coordinates[1]}}
      />
      <button type='button' onClick={onDelete} style={{marginTop: 5, marginLeft: 5}}>
        <span className='icon'><X size={20} /></span>
      </button>
    </StyledContainer>
  )
}

PositionInput.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onEditPositionType: PropTypes.func.isRequired,
  position: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  positionType: PropTypes.string.isRequired,
}
