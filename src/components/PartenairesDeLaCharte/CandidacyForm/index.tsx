import { FormEvent, useState } from 'react'
import { capitalize } from 'lodash'

import SelectInput from '../../SelectInput'
import ImageInput from '../../ImageInput'
import MultiSelectInput from '../../MultiSelectInput'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import { candidateToPartenairesDeLaCharte } from '@/lib/api-bal-admin'
import { Commune, Departement } from '@/types/api-geo.types'
import { StyledForm } from './CandidacyForm.styles'
import CommuneInput from '@/components/CommuneInput'
import { CandidatePartenaireDeLaCharteType, PartenaireDeLaCharteOrganismeTypeEnum, PartenaireDeLaCharteServiceEnum, PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'

const typeOptions = [
  { value: PartenaireDeLaCharteTypeEnum.COMMUNE, label: 'Commune' },
  { value: PartenaireDeLaCharteTypeEnum.ORGANISME, label: 'Organisme' },
  { value: PartenaireDeLaCharteTypeEnum.ENTREPRISE, label: 'Entreprise' },
]

const organismeTypeOptions = [
  { value: PartenaireDeLaCharteOrganismeTypeEnum.EPCI, label: 'EPCI' },
  { value: PartenaireDeLaCharteOrganismeTypeEnum.DEPARTEMENT, label: 'Département' },
  { value: PartenaireDeLaCharteOrganismeTypeEnum.REGION, label: 'Région' },
  { value: PartenaireDeLaCharteOrganismeTypeEnum.AUTRE, label: 'Autre' },
]

interface CandidacyFormProps {
  onClose: () => void
  services: string[]
  departements: Departement[]
}

function CandidacyForm({ onClose, services, departements }: CandidacyFormProps) {
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null)
  const [formData, setFormData] = useState<CandidatePartenaireDeLaCharteType>({
    type: PartenaireDeLaCharteTypeEnum.COMMUNE,
    organismeType: PartenaireDeLaCharteOrganismeTypeEnum.EPCI,
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
  const [submitStatus, setSubmitStatus] = useState<'loading' | 'success' | 'error' | null>(null)

  const servicesOptions = Object.values(services).map(value => ({ value, label: capitalize(value) }))
  const departementsOptions = departements.map(departement => ({ value: departement.code, label: `${departement.code} - ${departement.nom}` }))

  const handleEdit = (property: keyof CandidatePartenaireDeLaCharteType) => (event: any) => {
    const { value } = event.target
    setFormData(state => ({ ...state, [property]: value }))
  }

  const handleSelectCommune = (commune: Commune | null) => {
    if (commune) {
      setSelectedCommune(commune)
      setFormData(state => ({
        ...state,
        name: commune.nom,
        codeCommune: commune.code,
        codeRegion: commune.codeRegion,
        codeDepartement: [commune.codeDepartement],
      }))
    }
    else {
      setSelectedCommune(null)
      setFormData(state => ({
        ...state,
        name: '',
        codeCommune: null,
        codeRegion: null,
        codeDepartement: [],
      }))
    }
  }

  const handleToggle = (property: keyof CandidatePartenaireDeLaCharteType) => () => {
    setFormData(state => ({ ...state, [property]: !state[property] }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      await candidateToPartenairesDeLaCharte(formData)
      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
      }, 2000)
    }
    catch {
      setSubmitStatus('error')
    }
  }

  const canSubmit = () => {
    const requiredCommonFields = formData.name && formData.contactFirstName && formData.contactLastName && formData.contactEmail && formData.charteURL && formData.picture

    if (formData.type === PartenaireDeLaCharteTypeEnum.COMMUNE) {
      return requiredCommonFields && formData.codeCommune && formData.codeRegion
    }

    if (formData.type === PartenaireDeLaCharteTypeEnum.ORGANISME) {
      return requiredCommonFields && formData.organismeType
    }

    if (formData.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE) {
      return requiredCommonFields
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <section>
        <h5>
          Informations de base
        </h5>
        <div className="form-row">
          <SelectInput
            label="Type*"
            value={formData.type}
            options={typeOptions}
            handleChange={(type: string) => {
              setFormData(state => ({
                ...state,
                type: type as PartenaireDeLaCharteTypeEnum,
              }))
            }}
          />
          {formData.type === PartenaireDeLaCharteTypeEnum.COMMUNE && <CommuneInput label="Commune*" value={selectedCommune} onChange={handleSelectCommune} />}
          {formData.type === PartenaireDeLaCharteTypeEnum.ORGANISME && (
            <>
              <SelectInput
                label="Type d'organisme*"
                value={formData.organismeType as string}
                options={organismeTypeOptions}
                handleChange={(organismeType: string) => {
                  setFormData(state => ({
                    ...state,
                    organismeType: organismeType as PartenaireDeLaCharteOrganismeTypeEnum,
                  }))
                }}
              />
              <Input
                label="Nom*"
                nativeInputProps={{
                  required: true,
                  value: formData.name,
                  onChange: handleEdit('name'),
                }}
              />
            </>
          )}
          {formData.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE && (
            <Input
              label="Nom*"
              nativeInputProps={{
                required: true,
                value: formData.name,
                onChange: handleEdit('name'),
              }}
            />
          )}
        </div>

        <ImageInput
          label="Logo*"
          value={formData.picture}
          onClear={() => {
            setFormData(state => ({ ...state, picture: '' }))
          }}
          onChange={(base64Image) => {
            setFormData(state => ({ ...state, picture: base64Image }))
          }}
        />

        <div className="form-row">
          <MultiSelectInput
            label="Services"
            value={formData.services}
            options={servicesOptions}
            placeholder="Sélectionnez un ou plusieurs services"
            onChange={(services) => {
              setFormData(state => ({
                ...state,
                services: services as PartenaireDeLaCharteServiceEnum[],
              }))
            }}
          />
          {formData.type !== PartenaireDeLaCharteTypeEnum.COMMUNE && (
            <MultiSelectInput
              label="Couverture géographique"
              placeholder="Sélectionnez un ou plusieurs départements"
              value={formData.codeDepartement}
              options={departementsOptions}
              onChange={(codeDepartement: string[]) => {
                setFormData(state => ({
                  ...state,
                  codeDepartement,
                }))
              }}
            />
          )}
        </div>
        {formData.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE && (
          <div style={{ display: 'flex' }}>
            <label>Périmètre France entière</label>
            <input
              style={{ marginLeft: '1em' }}
              type="checkbox"
              checked={formData.isPerimeterFrance}
              onChange={handleToggle('isPerimeterFrance')}
            />
          </div>
        )}
      </section>
      <section>
        <h5>Informations contact</h5>
        <div className="form-row">
          <Input
            label="Nom*"
            nativeInputProps={{
              required: true,
              value: formData.contactLastName,
              onChange: handleEdit('contactLastName') }}
          />

          <Input
            label="Prénom*"
            nativeInputProps={{
              required: true,
              value: formData.contactFirstName,
              onChange: handleEdit('contactFirstName') }}
          />
        </div>

        <Input
          label="Email*"
          nativeInputProps={{
            required: true,
            type: 'email',
            value: formData.contactEmail,
            onChange: handleEdit('contactEmail') }}
        />
      </section>
      <section>
        <h5>Autres informations</h5>
        <div className="form-row">
          <Input
            label="Lien vers la charte sur votre site internet*"
            nativeInputProps={{
              value: formData.charteURL,
              type: 'url',
              onChange: handleEdit('charteURL'),
              required: true,
            }}
          />
          <Input
            label="Lien vers le site"
            nativeInputProps={{
              value: formData.link,
              type: 'url',
              onChange: handleEdit('link') }}
          />
        </div>
        {formData.type === 'commune' && (
          <div className="form-row">
            <Input
              label="Lien vers le témoignage"
              nativeInputProps={{
                value: formData.testimonyURL,
                type: 'url',
                onChange: handleEdit('testimonyURL') }}
            />
            <Input
              label="Lien vers la BAL"
              nativeInputProps={{
                value: formData.balURL,
                type: 'url',
                onChange: handleEdit('balURL') }}
            />
          </div>
        )}
        {formData.type === PartenaireDeLaCharteTypeEnum.ORGANISME && (
          <div className="form-row" style={{ marginBottom: '1.5rem' }}>
            <Input
              label="Lien vers le témoignage"
              nativeInputProps={{
                value: formData.testimonyURL,
                type: 'url',
                onChange: handleEdit('testimonyURL') }}
            />
          </div>
        )}
        {formData.type !== PartenaireDeLaCharteTypeEnum.COMMUNE && (
          <div className="form-row">
            <Input
              label="Périmètre"
              textArea
              nativeTextAreaProps={{
                value: formData.perimeter,
                onChange: handleEdit('perimeter'),
              }}
            />
            <Input
              label="Descriptif"
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
        <div className="fr-alert fr-alert--success">
          <p>
            Votre candidature a bien été envoyée. Nous vous recontacterons prochainement.
          </p>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="fr-alert fr-alert--error">
          <p>
            Une erreur est survenue lors de l&apos;envoi de votre candidature. Veuillez réessayer ultérieurement. SI le problème persiste, veuillez nous contacter par mail à adresse@data.gouv.fr.
          </p>
        </div>
      )}
      <div className="form-controls">
        <Button
          disabled={!canSubmit() || submitStatus === 'loading' || submitStatus === 'success'}
          style={{ color: 'white' }}
          type="submit"
        >
          Candidater
        </Button>
        <Button type="button" priority="secondary" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </StyledForm>
  )
}

export default CandidacyForm
