import PropTypes from 'prop-types'

import {StyledForm} from '../signalement.styles'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import PositionInput from '../position-input'

export default function SignalementNumeroCreateForm({signalement, onEditSignalement, onClose, setIsEditParcellesMode, isEditParcellesMode, onSubmit, center}) {
  const {numero, suffixe, nomVoie, positions, parcelles} = signalement.changesRequested

  return (
    <StyledForm >
      <section>
        <h5>
          Demande de création d&apos;un numéro
        </h5>
        <div className='form-row'>
          <Input
            label='Numéro*'
            nativeInputProps={{
              required: true,
              type: 'number',
              value: numero,
              onChange: event => onEditSignalement('changesRequested', 'numero')(event.target.value)}}
          />
          <Input
            label='Suffixe'
            nativeInputProps={{
              value: suffixe,
              placeholder: 'bis, ter...',
              onChange: event => onEditSignalement('changesRequested', 'suffixe')(event.target.value)}}
          />
        </div>
        <h6>Positions :</h6>
        {positions.map(({position, positionType}, index) => (
          <PositionInput
            key={index} // eslint-disable-line react/no-array-index-key
            position={position}
            positionType={positionType}
            onEditPositionType={updatedPosition => {
              const newPositions = [...positions]
              newPositions[index] = updatedPosition
              onEditSignalement('changesRequested', 'positions')(newPositions)
            }}
            onDelete={() => {
              onEditSignalement('changesRequested', 'positions')(positions.filter((_, i) => i !== index))
            }} />
        ))}
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            type='button'
            style={{color: 'white', marginBottom: 10}}
            onClick={() => onEditSignalement('changesRequested', 'positions')([...positions, {position: {type: 'Point', coordinates: center}, positionType: 'entrée'}])}
          >
            Ajouter une position
          </Button>
        </div>
        <h6>Parcelles cadastrales :</h6>
        <div className='parcelles-wrapper'>
          {parcelles.map(parcelle => (
            <div key={parcelle}>
              {parcelle}
            </div>
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            type='button'
            style={{color: 'white', marginBottom: 10}}
            onClick={() => setIsEditParcellesMode(!isEditParcellesMode)}
          >
            {isEditParcellesMode ? 'Arrêter de modifier les parcelles' : 'Modifier les parcelles'}
          </Button>
        </div>
        <div className='form-row'>
          <Input
            label='Nom de la voie'
            nativeInputProps={{
              required: true,
              value: nomVoie,
              onChange: event => onEditSignalement('changesRequested', 'nomVoie')(event.target.value)}}
          />
        </div>
      </section>
      <div className='form-controls'>
        <Button
          onClick={onSubmit}
          style={{color: 'white'}}
          type='button'
        >
          Envoyer le signalement
        </Button>
        <Button type='button' priority='secondary' onClick={onClose}>
          Annuler
        </Button>
      </div>
    </StyledForm>
  )
}

SignalementNumeroCreateForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  signalement: PropTypes.object.isRequired,
  onEditSignalement: PropTypes.func.isRequired,
  setIsEditParcellesMode: PropTypes.func.isRequired,
  isEditParcellesMode: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  center: PropTypes.array
}
