import { FormEvent, useState } from 'react'

import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import { sendReview } from '@/lib/api-bal-admin'
import Link from 'next/link'
import styled from 'styled-components'
import { ReviewFormType } from '@/types/partenaire.types'
import Checkbox from '@codegouvfr/react-dsfr/Checkbox'
import StarRatingInput from '../StarRatingInput'
import { PartenaireDeLaChartType } from '@/types/partenaire.types'

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: unset !important;
  margin: unset !important;
  h2 {
    font-size: 1.2rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
  section:not(:first-child) {
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

interface ReviewFormProps {
  onClose: () => void
  partenaire: PartenaireDeLaChartType
}

export default function ReviewForm({ onClose, partenaire }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormType>({
    isAnonymous: false,
    email: '',
    community: '',
    rating: 1,
    comment: '',
  })
  const [submitStatus, setSubmitStatus] = useState<'loading' | 'success' | 'error' | null>(null)

  const handleEdit = (property: keyof ReviewFormType) => (event: any) => {
    const { value } = event.target
    setFormData(state => ({ ...state, [property]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      await sendReview(partenaire.id, formData)
      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
      }, 3000)
    }
    catch {
      setSubmitStatus('error')
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <section>
        <Input
          label="Email*"
          nativeInputProps={{
            required: true,
            type: 'email',
            value: formData.email,
            onChange: handleEdit('email') }}
        />
        <Input
          label="Commune ou collectivité*"
          nativeInputProps={{
            required: true,
            value: formData.community,
            onChange: handleEdit('community') }}
        />
        <Checkbox options={[
          { label: 'Je souhaite rester anonyme (mon identité ne sera pas affichée)',
            nativeInputProps: {
              checked: formData.isAnonymous,
              onChange: () => {
                setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))
              },
            },
          },
        ]}
        />
      </section>
      <section>
        <h2>Votre retour d&apos;expérience</h2>
        <StarRatingInput
          label="Votre note*"
          value={formData.rating}
          onChange={rating => setFormData(prev => ({ ...prev, rating }))}
          style={{ marginBottom: '1em' }}
        />
        <Input
          label="Commentaire*"
          textArea
          nativeTextAreaProps={{
            rows: 4,
            required: true,
            value: formData.comment,
            onChange: handleEdit('comment'),
          }}
        />
      </section>
      <section>
        <p>
          <i>
            Les commentaires seront publiés après validation par l&apos;équipe Base Adresse Locale.
          </i>
        </p>
        <p style={{ margin: 0 }}>
          <i>
            Les informations recueillies sur ce formulaire sont enregistrées dans un fichier informatisé par le Programme Base Adresse Locale de l&apos;ANCT pour nous permettre de valider les avis. Pour en savoir plus consultez&nbsp;
          </i>
          <Link href="/cgu" className="fr-link--icon-right fr-icon-links-line">nos CGU</Link>
        </p>
      </section>
      <section>
        {submitStatus === 'success' && (
          <div className="fr-alert fr-alert--success">
            <p>
              Un mail de confirmation vous a été envoyé, il nous permet de vérifier votre adresse mail. Merci pour votre avis !
            </p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="fr-alert fr-alert--error">
            <p>
              Une erreur est survenue lors de l&apos;envoi de votre avis. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez nous contacter par mail à adresse@data.gouv.fr.
            </p>
          </div>
        )}
      </section>
      <div className="form-controls">
        <Button
          disabled={submitStatus === 'loading' || submitStatus === 'success'}
          style={{ color: 'white' }}
          type="submit"
        >
          Envoyer
        </Button>
        <Button type="button" priority="secondary" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </StyledForm>
  )
}
