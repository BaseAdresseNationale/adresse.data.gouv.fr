import {useState, useMemo} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import {sendSignalement} from '@/lib/api-signalement'
import SelectInput from '@/components/common/form-inputs/select-input'

const StyledForm = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: unset !important;
  margin: unset !important;
  overflow: scroll;

  section:not(:first-of-type) {
    margin-top: 2em;
  }

  .form-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      width: 100%;

      &:not(:first-child) {
        margin-left: 1em;
      }
    }
  }

  .fr-alert {
    margin-top: 15px;
  }

  .form-controls {
    display: flex;
    margin-top: 1em;

    > :last-child {
      margin-left: 1em;
    }
  }
`

const positionTypeOptions = [
  {value: 'entrée', label: 'Entrée'},
  {value: 'délivrance postale', label: 'Délivrance postale'},
  {value: 'bâtiment', label: 'Bâtiment'},
  {value: 'cage d’escalier', label: 'Cage d’escalier'},
  {value: 'logement', label: 'Logement'},
  {value: 'parcelle', label: 'Parcelle'},
  {value: 'segment', label: 'Segment'},
  {value: 'service technique', label: 'Service technique'},
  {value: 'inconnue', label: 'Inconnu'}
]

function getExistingLocationType(type) {
  switch (type) {
    // In this case type = LOCATION_TO_CREATE
    case 'commune':
      return ''
    case 'voie':
      return 'VOIE'
    case 'lieu-dit':
      return 'TOPONYME'
    default:
      return 'NUMERO'
  }
}

function getExistingLocationLabel(address) {
  switch (address.type) {
    // In this case type = LOCATION_TO_CREATE
    case 'commune':
      return ''
    case 'voie':
      return 'VOIE'
    case 'lieu-dit':
      return 'TOPONYME'
    default:
      return `${address.numero} ${address.voie.nomVoie}`
  }
}

function SignalementForm({onClose, address}) {
  const [formData, setFormData] = useState({
    codeCommune: address.commune.code,
    type: 'LOCATION_TO_UPDATE',
    existingLocation: {
      type: getExistingLocationType(address.type),
      label: getExistingLocationLabel(address),
    },
    author: {
      firstName: '',
      lastName: '',
      email: ''
    },
    changesRequested: {
      numero: address.numero,
      suffixe: address.suffixe,
      position: address.position,
      positionType: address.positionType,
      nomVoie: address.voie.nomVoie
    }
  })
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleEdit = (property, key) => event => {
    const {value} = event.target
    setFormData(state => ({...state, [property]: {
      ...state[property],
      [key]: value
    }}))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      await sendSignalement(formData)
      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch {
      setSubmitStatus('error')
    }
  }

  const SignalementFields = useMemo(() => {
    switch (address.type) {
      case 'commune':
        return null
      case 'voie':
        return <div className='form-row' />
      case 'lieu-dit':
        return <div className='form-row' />
      default:
        return (
          <>
            <div className='form-row'>
              <p>Ajuster la <b>position</b> de cette adresse en déplaçant le point rouge sur la carte.
              </p>
            </div>
            <div className='form-row'>
              <p>Corriger les informations qui vous semblent erronées.
              </p>
            </div>
            <div className='form-row'>

              <Input
                label='Numéro*'
                nativeInputProps={{
                  required: true,
                  type: 'number',
                  value: formData.changesRequested.numero,
                  onChange: handleEdit('changesRequested', 'numero')}}
              />
              <Input
                label='Suffixe'
                nativeInputProps={{
                  value: formData.changesRequested.suffixe,
                  onChange: handleEdit('changesRequested', 'suffixe')}}
              />
              <SelectInput
                label='Type de position*'
                value={formData.changesRequested.positionType}
                options={positionTypeOptions}
                handleChange={type => {
                  setFormData(state => ({...state, changesRequested: {
                    ...state.changesRequested,
                    positionType: type
                  }}))
                }} />
            </div>
            <div className='form-row'>
              <Input
                label='Nom de la voie'
                nativeInputProps={{
                  required: true,
                  value: formData.changesRequested.nomVoie,
                  onChange: handleEdit('changesRequested', 'nomVoie')}}
              />
            </div>
          </>
        )
    }
  }, [address, formData])

  return (
    <StyledForm onSubmit={handleSubmit}>
      <section>
        <h4>
          Signalement d&apos;un problème pour l&apos;adresse : <em>{getExistingLocationLabel(address)}</em>
        </h4>
        {SignalementFields}
      </section>
      <section>
        <h4>Votre contact</h4>

        <div className='form-row'>
          <Input
            label='Nom'
            nativeInputProps={{
              value: formData.author.lastName,
              onChange: handleEdit('contactLastName')}}
          />

          <Input
            label='Prénom'
            nativeInputProps={{
              value: formData.author.firstName,
              onChange: handleEdit('contactFirstName')}}
          />
        </div>

        <Input
          label='Email'
          nativeInputProps={{
            type: 'email',
            value: formData.author.email,
            onChange: handleEdit('contactEmail')}}
        />
      </section>
      {submitStatus === 'success' && (
        <div className='fr-alert fr-alert--success'>
          <p>
            Votre signalement a bien été envoyée.
          </p>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className='fr-alert fr-alert--error'>
          <p>
            Une erreur est survenue lors de l&apos;envoi de votre signalement. Veuillez réessayer ultérieurement.
          </p>
        </div>
      )}
      <div className='form-controls'>
        <Button
          disabled={submitStatus === 'loading' || submitStatus === 'success'}
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

SignalementForm.propType = {
  onClose: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired
}

export default SignalementForm
