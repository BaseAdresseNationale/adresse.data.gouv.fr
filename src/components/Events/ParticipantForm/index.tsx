import { FormEvent, useState } from 'react'

import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import { registrationToEvent } from '@/lib/api-bal-admin'
import { StyledForm } from './ParticipantForm.styles'
import { ParticipantType } from '@/types/events.types'

interface ParticipantFormProps {
  onClose: () => void
  eventId: string
}

function ParticipantForm({ onClose, eventId }: ParticipantFormProps) {
  const [formData, setFormData] = useState<ParticipantType>({
    fullname: '',
    email: '',
    community: '',
    function: '',
  })
  const [submitStatus, setSubmitStatus] = useState<'loading' | 'success' | 'error' | null>(null)

  const handleEdit = (property: keyof ParticipantType) => (event: any) => {
    const { value } = event.target
    setFormData(state => ({ ...state, [property]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      await registrationToEvent(eventId, formData)
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
    return formData.fullname && formData.email
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <section>
        <Input
          label="Nom / Prénom*"
          nativeInputProps={{
            required: true,
            value: formData.fullname,
            onChange: handleEdit('fullname') }}
        />

        <Input
          label="Email*"
          nativeInputProps={{
            required: true,
            type: 'email',
            value: formData.email,
            onChange: handleEdit('email') }}
        />
        <Input
          label="Commune / Collectivité"
          nativeInputProps={{
            required: false,
            value: formData.community,
            onChange: handleEdit('community') }}
        />

        <Input
          label="Fonction / Poste"
          nativeInputProps={{
            required: false,
            value: formData.function,
            onChange: handleEdit('function') }}
        />
      </section>
      <section>
        {submitStatus === 'success' && (
          <div className="fr-alert fr-alert--success">
            <p>
              Votre inscription a bien été envoyée.
            </p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="fr-alert fr-alert--error">
            <p>
              Une erreur est survenue lors de l&apos;envoi de votre inscription. Veuillez réessayer ultérieurement. SI le problème persiste, veuillez nous contacter par mail à adresse@data.gouv.fr.
            </p>
          </div>
        )}
      </section>
      <div className="form-controls">
        <Button
          disabled={!canSubmit() || submitStatus === 'loading' || submitStatus === 'success'}
          style={{ color: 'white' }}
          type="submit"
        >
          S&apos;inscrire
        </Button>
        <Button type="button" priority="secondary" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </StyledForm>
  )
}

export default ParticipantForm
