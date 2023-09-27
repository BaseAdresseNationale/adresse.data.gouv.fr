import {useState} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {capitalize} from 'lodash'

import SelectInput from '@/components/common/form-inputs/select-input'
import ImageInput from '@/components/common/form-inputs/image-input'
import CommuneInput from '@/components/common/form-inputs/commune-input'
import MultiSelectInput from '@/components/common/form-inputs/multi-select-input'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import {candidateToPartenairesDeLaCharte} from '@/lib/api-bal-admin'

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: unset !important;
  margin: unset !important;

  section {
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

  .form-controls {
    display: flex;
    margin-top: 1em;

    > :last-child {
      margin-left: 1em;
    }
  }
`

const typeOptions = [
  {value: 'commune', label: 'Commune'},
  {value: 'organisme', label: 'Organisme'},
  {value: 'entreprise', label: 'Entreprise'},
]

const organismeTypeOptions = [
  {value: 'epci', label: 'EPCI'},
  {value: 'departement', label: 'Département'},
  {value: 'region', label: 'Région'},
  {value: 'autre', label: 'Autre'},
]

function CandidacyForm({onClose, partnersServices, departements}) {
  const [formData, setFormData] = useState({
    type: 'commune',
    organismeType: 'epci',
    name: '',
    picture: '',
    services: [],
    codeDepartement: [],
    isPerimeterFrance: false,

    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',

    link: '',
    charteURL: '',

    codeRegion: null,
    codeCommune: null,
    testimonyURL: '',
    balURL: '',
    infos: '',
    perimeter: '',
  })
  const [submitStatus, setSubmitStatus] = useState(null)

  const servicesOptions = Object.values(partnersServices).map(value => ({value, label: capitalize(value)}))
  const departementsOptions = departements.map(departement => ({value: departement.code, label: `${departement.code} - ${departement.nom}`}))

  const handleEdit = property => event => {
    const {value} = event.target
    setFormData(state => ({...state, [property]: value}))
  }

  const handleSelectCommune = commune => {
    if (commune) {
      setFormData(state => ({
        ...state,
        name: commune.nom,
        codeCommune: commune.code,
        codeRegion: commune.codeRegion,
        codeDepartement: [commune.codeDepartement],
      }))
    } else {
      setFormData(state => ({
        ...state,
        name: '',
        codeCommune: null,
        codeRegion: null,
        codeDepartement: [],
      }))
    }
  }

  const handleToggle = property => () => {
    setFormData(state => ({...state, [property]: !state[property]}))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      await candidateToPartenairesDeLaCharte(formData)
      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch {
      setSubmitStatus('error')
    }
  }

  const canSubmit = () => {
    const requiredCommonFields = formData.name && formData.contactFirstName && formData.contactLastName && formData.contactEmail && formData.charteURL && formData.picture

    if (formData.type === 'commune') {
      return requiredCommonFields && formData.codeCommune && formData.codeRegion
    }

    if (formData.type === 'organisme') {
      return requiredCommonFields && formData.organismeType
    }

    if (formData.type === 'entreprise') {
      return requiredCommonFields
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <section>
        <h4>
          Informations de base
        </h4>
        <div className='form-row'>
          <SelectInput
            label='Type*'
            value={formData.type}
            options={typeOptions}
            handleChange={type => {
              setFormData(state => ({
                ...state,
                type,
              }))
            }} />
          {formData.type === 'commune' && <CommuneInput value={formData.name} label='Nom*' onChange={handleSelectCommune} />}
          {formData.type === 'organisme' && <>
            <SelectInput
              label="Type d'organisme*"
              value={formData.organismeType}
              options={organismeTypeOptions}
              handleChange={organismeType => {
                setFormData(state => ({
                  ...state,
                  organismeType,
                }))
              }} />
            <Input
              label='Nom*'
              nativeInputProps={{
                required: true,
                value: formData.name,
                onChange: handleEdit('name'),
              }}
            />
          </>}
          {formData.type === 'entreprise' && <Input
            label='Nom*'
            nativeInputProps={{
              required: true,
              value: formData.name,
              onChange: handleEdit('name'),
            }}
          />}
        </div>

        <ImageInput
          label='Logo*'
          value={formData.picture}
          onClear={() => {
            setFormData(state => ({...state, picture: undefined}))
          }}
          onChange={base64Image => {
            setFormData(state => ({...state, picture: base64Image}))
          }} />

        <div className='form-row'>
          <MultiSelectInput
            label='Services'
            value={formData.services}
            options={servicesOptions}
            placeholder='Sélectionnez un ou plusieurs services'
            onChange={services => {
              setFormData(state => ({
                ...state,
                services,
              }))
            }} />
          {formData.type !== 'commune' && <MultiSelectInput
            label='Couverture géographique'
            placeholder='Sélectionnez un ou plusieurs départements'
            value={formData.codeDepartement}
            options={departementsOptions}
            onChange={codeDepartement => {
              setFormData(state => ({
                ...state,
                codeDepartement,
              }))
            }} />}
        </div>
        {formData.type === 'entreprise' && <div style={{display: 'flex'}}>
          <label>Périmètre France entière</label>
          <input
            style={{marginLeft: '1em'}}
            type='checkbox'
            checked={formData.isPerimeterFrance}
            onChange={handleToggle('isPerimeterFrance')}
          />
        </div>}
      </section>
      <section>
        <h4>Informations contact</h4>
        <div className='form-row'>
          <Input
            label='Nom*'
            nativeInputProps={{
              required: true,
              value: formData.contactLastName,
              onChange: handleEdit('contactLastName')}}
          />

          <Input
            label='Prénom*'
            nativeInputProps={{
              required: true,
              value: formData.contactFirstName,
              onChange: handleEdit('contactFirstName')}}
          />
        </div>

        <Input
          label='Email*'
          nativeInputProps={{
            required: true,
            type: 'email',
            value: formData.contactEmail,
            onChange: handleEdit('contactEmail')}}
        />
      </section>
      <section>
        <h4>Autres informations</h4>
        <div className='form-row'>
          <Input
            label='Lien vers la charte*'
            nativeInputProps={{
              value: formData.charteURL,
              type: 'url',
              onChange: handleEdit('charteURL'),
              required: true,
            }}
          />
          <Input
            label='Lien vers le site'
            nativeInputProps={{
              value: formData.link,
              type: 'url',
              onChange: handleEdit('link')}}
          />
        </div>
        {formData.type === 'commune' && (
          <div className='form-row'>
            <Input
              label='Lien vers le témoignage'
              nativeInputProps={{
                value: formData.testimonyURL,
                type: 'url',
                onChange: handleEdit('testimonyURL')}}
            />
            <Input
              label='Lien vers la BAL'
              nativeInputProps={{
                value: formData.balURL,
                type: 'url',
                onChange: handleEdit('balURL')}}
            />
          </div>)}
        {formData.type === 'organisme' && (
          <div className='form-row' style={{marginBottom: '1.5rem'}}>
            <Input
              label='Lien vers le témoignage'
              nativeInputProps={{
                value: formData.testimonyURL,
                type: 'url',
                onChange: handleEdit('testimonyURL')}}
            />
          </div>
        )}
        {formData.type !== 'commune' && (
          <div className='form-row'>
            <Input
              label='Périmètre'
              textArea
              nativeTextAreaProps={{
                value: formData.perimeter,
                onChange: handleEdit('perimeter'),
              }}
            />
            <Input
              label='Descriptif'
              textArea
              nativeTextAreaProps={{
                value: formData.infos,
                onChange: handleEdit('infos'),
              }}
            />
          </div>
        )}
      </section>
      {submitStatus === 'success' && (
        <div className='fr-alert fr-alert--success'>
          <p>
            Votre candidature a bien été envoyée. Nous vous recontacterons prochainement.
          </p>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className='fr-alert fr-alert--error'>
          <p>
            Une erreur est survenue lors de l&apos;envoi de votre candidature. Veuillez réessayer ultérieurement. SI le problème persiste, veuillez nous contacter par mail à adresse@data.gouv.fr.
          </p>
        </div>
      )}
      <div className='form-controls'>
        <Button
          disabled={!canSubmit() || submitStatus === 'loading' || submitStatus === 'success'}
          style={{color: 'white'}}
          type='submit'
        >
          Candidater
        </Button>
        <Button type='button' priority='secondary' onClick={onClose}>
          Annuler
        </Button>
      </div>
    </StyledForm>
  )
}

CandidacyForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  partnersServices: PropTypes.array.isRequired,
  departements: PropTypes.array.isRequired
}

export default CandidacyForm
