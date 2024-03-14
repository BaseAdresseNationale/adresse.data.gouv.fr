import {useMemo} from 'react'
import PropTypes from 'prop-types'

import {StyledForm} from '../signalement.styles'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import PositionInput from '../position-input'
import {getExistingLocationLabel, getInitialSignalement} from '../use-signalement'

export default function SignalementNumeroUpdateForm({signalement, onEditSignalement, onClose, address, setIsEditParcellesMode, isEditParcellesMode, onSubmit}) {
  const isSubmitDisabled = useMemo(() => {
    return JSON.stringify(getInitialSignalement(address)) === JSON.stringify(signalement)
  }, [address, signalement])

  const {numero, suffixe, nomVoie, positions, parcelles} = signalement.changesRequested

  return (
    <StyledForm >
      <h4>
        Signalement d&apos;un problème d&apos;adressage
      </h4>
      <section>
        <h5>
          Adresse concernée
        </h5>
        <div className='form-row'>
          {getExistingLocationLabel(address)}
        </div>
        <div className='form-row'>
          {address.codePostal} {address.commune.nom}
        </div>
      </section>
      <section>
        <h5>
          Modifications demandées
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
            onClick={() => onEditSignalement('changesRequested', 'positions')([...positions, {position: {type: 'Point', coordinates: [address.lon, address.lat]}, positionType: 'entrée'}])}
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
          disabled={isSubmitDisabled}
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

SignalementNumeroUpdateForm.propTypes = {
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
  }).isRequired,
  signalement: PropTypes.object.isRequired,
  onEditSignalement: PropTypes.func.isRequired,
  setIsEditParcellesMode: PropTypes.func.isRequired,
  isEditParcellesMode: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired
}
