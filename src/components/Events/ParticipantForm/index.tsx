import { FormEvent, useState } from 'react'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import { registrationToEvent } from '@/lib/api-bal-admin'
import { StyledForm } from './ParticipantForm.styles'
import { ParticipantType } from '@/types/events.types'
import Link from 'next/link'

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
          label="Email* (merci de bien vérifier votre adresse de courriel)"
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
              Votre inscription est validée. Vous allez recevoir un mail de confirmation. Le webinaire se déroulera à cette <a target="_blank" href="https://webinaire.numerique.gouv.fr/meeting/signin/invite/6605/creator/940/hash/615257ce88cf93ab6af594265d5729623aab8de3">adresse</a>.
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
      {submitStatus !== 'success'
        ? (
            <div className="form-controls">
              <Button
                disabled={!canSubmit() || submitStatus === 'loading'}
                style={{ color: 'white' }}
                type="submit"
              >
                S&apos;inscrire
              </Button>
              <Button type="button" priority="secondary" onClick={onClose}>
                Annuler
              </Button>
            </div>
          )
        : (
            <div className="form-controls">
              <Button type="button" priority="secondary" onClick={onClose}>
                Fermer
              </Button>
            </div>
          )}
      <section>
        <span>
          <i>
            Les informations recueillies sur ce formulaire sont enregistrées dans un fichier informatisé par le Programme Base Adresse Locale de l&apos;ANCT pour vous envoyer l&apos;invitation au webinaire. Pour en savoir plus consultez&nbsp;
          </i>
          <Link href="/cgu" className="fr-link--icon-right fr-icon-links-line">nos CGU</Link>
        </span>
      </section>
    </StyledForm>
  )
}

export default ParticipantForm
