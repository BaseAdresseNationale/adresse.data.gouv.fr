import {useState} from 'react'
import PropTypes from 'prop-types'

import Button from '@codegouvfr/react-dsfr/Button'
import {StyledForm} from './signalement.styles'
import SignalementRecapModal from './signalement-recap-modal'
import SignalementToponymeForm from './signalement-toponyme/signalement-toponyme-form'
import SignalementNumeroForm from './signalement-numero/signalement-numero-form'
import SignalementNumeroDeleteForm from './signalement-numero/signalement-numero-delete-form'
import {getExistingLocationLabel} from './use-signalement'
import {X} from 'react-feather'

export default function SignalementForm({signalement, createSignalement, onEditSignalement, onClose, address, setIsEditParcellesMode, isEditParcellesMode}) {
  const [showRecapModal, setShowRecapModal] = useState(false)

  const getCenterCoords = () => {
    const splittedHash = window.location.hash.split('/')
    return [Number.parseFloat(splittedHash[2]), Number.parseFloat(splittedHash[1])]
  }

  const handleSubmit = e => {
    e.preventDefault()
    setShowRecapModal(true)
  }

  return (
    <>
      {!signalement && (
        <StyledForm>
          <button className='close-btn' type='button' onClick={onClose}>
            <X />
          </button>
          <section>
            <h4>
              Signalement
            </h4>
            <h5>
              Lieu concerné
            </h5>
            <div className='form-row'>
              {getExistingLocationLabel(address)}
            </div>
            <div className='form-row'>
              {address.codePostal} {address.commune.nom}
            </div>
            <br />
            <div className='form-row'>
              <Button
                type='button'
                style={{color: 'white', marginBottom: 10}}
                onClick={() => createSignalement('LOCATION_TO_UPDATE')}
              >
                Demander une modification
              </Button>
            </div>
            <div className='form-row'>
              {address.type === 'numero' &&
              <Button
                type='button'
                style={{color: 'white', marginBottom: 10}}
                onClick={() => createSignalement('LOCATION_TO_DELETE')}
              >
                Demander la suppression
              </Button>}
            </div>
          </section>
          {(address.type === 'voie') && <section>
            <h5>
              Adresse non référencée
            </h5>
            <div className='form-row'>
              <Button
                type='button'
                style={{color: 'white', marginBottom: 10}}
                onClick={() => createSignalement('LOCATION_TO_CREATE')}
              >
                Signaler un numéro manquant
              </Button>
            </div>
          </section>}
        </StyledForm>
      )}

      {signalement?.type === 'LOCATION_TO_UPDATE' && (address.type === 'voie' || address.type === 'lieu-dit') && (
        <SignalementToponymeForm
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
          signalement={signalement}
          address={address}
          // InitialPositionCoords={[address.lon, address.lat]}
          isEditParcellesMode={isEditParcellesMode}
          setIsEditParcellesMode={setIsEditParcellesMode}
        />
      )}

      {signalement?.type === 'LOCATION_TO_CREATE' && address.type === 'voie' && (
        <SignalementNumeroForm
          setIsEditParcellesMode={setIsEditParcellesMode}
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
          signalement={signalement}
          isEditParcellesMode={isEditParcellesMode}
          {...(signalement?.type === 'LOCATION_TO_UPDATE' ? {address, initialPositionCoords: [address.lon, address.lat]} : {initialPositionCoords: getCenterCoords()})}
        />)}

      {signalement?.type === 'LOCATION_TO_UPDATE' && address.type === 'numero' && (
        <SignalementNumeroForm
          setIsEditParcellesMode={setIsEditParcellesMode}
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
          signalement={signalement}
          isEditParcellesMode={isEditParcellesMode}
          {...(signalement?.type === 'LOCATION_TO_UPDATE' ? {address, initialPositionCoords: [address.lon, address.lat]} : {initialPositionCoords: getCenterCoords()})}
        />)}

      {signalement?.type === 'LOCATION_TO_DELETE' && (
        <SignalementNumeroDeleteForm
          address={address}
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
          signalement={signalement} />)}
      {showRecapModal && <SignalementRecapModal onSubmit={onClose} onClose={() => setShowRecapModal(false)} signalement={signalement} address={address} onEditSignalement={onEditSignalement} />}
    </>
  )
}

SignalementForm.propTypes = {
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
  signalement: PropTypes.object,
  onEditSignalement: PropTypes.func.isRequired,
  setIsEditParcellesMode: PropTypes.func.isRequired,
  createSignalement: PropTypes.func.isRequired,
  isEditParcellesMode: PropTypes.bool,
}
