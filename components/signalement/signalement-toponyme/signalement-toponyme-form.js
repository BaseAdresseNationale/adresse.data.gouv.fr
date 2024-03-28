import PropTypes from 'prop-types'

import {StyledForm} from '../signalement.styles'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import {getExistingLocationLabel} from '../use-signalement'

export default function SignalementToponymeForm({signalement, onEditSignalement, onClose, address, onSubmit}) {
  const {nom} = signalement.changesRequested

  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>
        Signalement d&apos;un problème d&apos;adressage
      </h4>
      <section>
        <h5>
          Lieu concernée
        </h5>
        <div className='form-row'>
          {getExistingLocationLabel(address)}
        </div>
        <div className='form-row'>
          {address.commune.nom}
        </div>
      </section>
      <section>
        <h5>
          Modifications demandées
        </h5>
        <div className='form-row'>
          <Input
            label='Nom'
            nativeInputProps={{
              required: true,
              value: nom,
              onChange: event => onEditSignalement('changesRequested', 'nom')(event.target.value)}}
          />
        </div>
        {/* <h6>Positions :</h6>
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
            onClick={() => onEditSignalement('changesRequested', 'positions')([...positions, {position: {type: 'Point', coordinates: initialPositionCoords}, positionType: 'entrée'}])}
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
        </div> */}
        {/* <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            type='button'
            style={{color: 'white', marginBottom: 10}}
            onClick={() => setIsEditParcellesMode(!isEditParcellesMode)}
          >
            {isEditParcellesMode ? 'Arrêter de modifier les parcelles' : 'Modifier les parcelles'}
          </Button>
        </div> */}
      </section>
      <div className='form-controls'>
        <Button
          style={{color: 'white'}}
          type='submit'
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

SignalementToponymeForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  address: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    codePostal: PropTypes.string,
    commune: PropTypes.object,
    position: PropTypes.object,
    positions: PropTypes.array,
    positionType: PropTypes.string,
    parcelles: PropTypes.array,
    displayBBox: PropTypes.array,
    lat: PropTypes.number,
    lon: PropTypes.number,
    voie: PropTypes.object
  }),
  signalement: PropTypes.object.isRequired,
  onEditSignalement: PropTypes.func.isRequired,
  // SetIsEditParcellesMode: PropTypes.func.isRequired,
  // isEditParcellesMode: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  // InitialPositionCoords: PropTypes.array
}
