'use client'

import { FormEvent, useState, useCallback, useEffect } from 'react'
import { env } from 'next-runtime-env'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Select from '@codegouvfr/react-dsfr/Select'

const ALTCHA_API_KEY = env('NEXT_PUBLIC_ALTCHA_API_KEY')

const sujetOptions = [
  { value: '', label: 'Sélectionnez un sujet', disabled: true },
  { value: 'Questions sur la BAN', label: 'Questions sur la BAN' },
  { value: 'Questions sur la BAL', label: 'Questions sur la BAL' },
  { value: 'Autre', label: 'Autre' },
]

export default function ContactForm() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    sujet: '',
    message: '',
  })

  const [submitStatus, setSubmitStatus] = useState<'loading' | 'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isAltchaVerified, setIsAltchaVerified] = useState(false)
  const [altchaElement, setAltchaElement] = useState<HTMLElement | null>(null)
  const [isAltchaLoaded, setIsAltchaLoaded] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [altchaKey, setAltchaKey] = useState(0)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [waitingForVerification, setWaitingForVerification] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && showCaptcha) {
      import('altcha').then(() => {
        setIsAltchaLoaded(true)
      })
    }
  }, [showCaptcha])

  const onRefChange = useCallback((node: HTMLElement) => {
    setAltchaElement(node)
  }, [])

  useEffect(() => {
    if (!altchaElement) return

    const eventHandler = (ev: any) => {
      if (ev.detail.state === 'verified') {
        setIsAltchaVerified(true)
      }
    }

    altchaElement.addEventListener('statechange', eventHandler)

    return () => {
      altchaElement.removeEventListener('statechange', eventHandler)
    }
  }, [altchaElement])

  const sendMessage = useCallback(async () => {
    setSubmitStatus('loading')
    setErrorMessage('')
    setWaitingForVerification(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }

      setSubmitStatus('success')
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        sujet: '',
        message: '',
      })
      setIsAltchaVerified(false)
      setTouched({})
      setShowCaptcha(false)
      setAltchaKey(prev => prev + 1)

      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Message non envoyé')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [formData])

  useEffect(() => {
    if (waitingForVerification && isAltchaVerified) {
      sendMessage()
    }
  }, [isAltchaVerified, waitingForVerification, sendMessage])

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleBlur = (field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setTouched({
      prenom: true,
      nom: true,
      email: true,
      sujet: true,
      message: true,
    })

    if (!showCaptcha) {
      setShowCaptcha(true)
      setWaitingForVerification(true)
      return
    }

    if (!isAltchaVerified) {
      setWaitingForVerification(true)
      return
    }

    sendMessage()
  }

  const getPrenomState = () => {
    if (!touched.prenom || !formData.prenom) return 'default'
    return formData.prenom.trim().length >= 2 ? 'success' : 'error'
  }

  const getNomState = () => {
    if (!touched.nom || !formData.nom) return 'default'
    return formData.nom.trim().length >= 2 ? 'success' : 'error'
  }

  const getEmailState = () => {
    if (!touched.email || !formData.email) return 'default'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(formData.email) ? 'success' : 'error'
  }

  const getSujetState = () => {
    if (!touched.sujet || !formData.sujet) return 'default'
    return formData.sujet ? 'success' : 'error'
  }

  const getMessageState = () => {
    if (!touched.message || !formData.message) return 'default'
    return formData.message.trim().length >= 10 ? 'success' : 'error'
  }

  const isFormDataValid = () => {
    return (
      formData.prenom.trim().length >= 2
      && formData.nom.trim().length >= 2
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      && formData.sujet
      && formData.message.trim().length >= 10
    )
  }

  const isDisabled = submitStatus === 'loading'

  return (
    <>
      {submitStatus === 'success' && (
        <Alert
          severity="success"
          title="Message envoyé"
          description="Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
          className="fr-mb-4w"
          closable
          onClose={() => setSubmitStatus(null)}
        />
      )}

      {submitStatus === 'error' && (
        <Alert
          severity="error"
          title="Erreur"
          description={errorMessage || 'Message non envoyé'}
          className="fr-mb-4w"
          closable
          onClose={() => setSubmitStatus(null)}
        />
      )}

      {waitingForVerification && showCaptcha && !isAltchaVerified && submitStatus !== 'success' && submitStatus !== 'error' && (
        <Alert
          severity="info"
          title="Vérification en attente"
          description="Veuillez compléter la vérification anti-spam ci-dessous"
          className="fr-mb-4w"
          closable
          onClose={() => setWaitingForVerification(false)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <fieldset className="fr-fieldset">
          <legend className="fr-fieldset__legend">
            <h3 className="fr-h6">Vos informations</h3>
          </legend>

          <div className="fr-fieldset__element">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-6">
                <Input
                  label="Prénom"
                  state={getPrenomState()}
                  stateRelatedMessage={
                    getPrenomState() === 'error'
                      ? 'Le prénom doit contenir au moins 2 caractères'
                      : undefined
                  }
                  nativeInputProps={{
                    required: true,
                    value: formData.prenom,
                    onChange: handleChange('prenom'),
                    onBlur: handleBlur('prenom'),
                    disabled: isDisabled,
                    autoComplete: 'given-name',
                  }}
                />
              </div>

              <div className="fr-col-12 fr-col-md-6">
                <Input
                  label="Nom"
                  state={getNomState()}
                  stateRelatedMessage={
                    getNomState() === 'error'
                      ? 'Le nom doit contenir au moins 2 caractères'
                      : undefined
                  }
                  nativeInputProps={{
                    required: true,
                    value: formData.nom,
                    onChange: handleChange('nom'),
                    onBlur: handleBlur('nom'),
                    disabled: isDisabled,
                    autoComplete: 'family-name',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="fr-fieldset__element">
            <Input
              label="Adresse e-mail"
              hintText="Format attendu : nom@domaine.fr"
              state={getEmailState()}
              stateRelatedMessage={
                getEmailState() === 'error'
                  ? 'Veuillez saisir une adresse e-mail valide'
                  : undefined
              }
              nativeInputProps={{
                required: true,
                type: 'email',
                value: formData.email,
                onChange: handleChange('email'),
                onBlur: handleBlur('email'),
                disabled: isDisabled,
                autoComplete: 'email',
              }}
            />
          </div>
        </fieldset>

        <fieldset className="fr-fieldset fr-mt-4w">
          <legend className="fr-fieldset__legend">
            <h3 className="fr-h6">Votre message</h3>
          </legend>

          <div className="fr-fieldset__element">
            <Select
              label="Sujet"
              state={getSujetState()}
              stateRelatedMessage={
                getSujetState() === 'error'
                  ? 'Veuillez sélectionner un sujet'
                  : undefined
              }
              nativeSelectProps={{
                required: true,
                value: formData.sujet,
                onChange: handleChange('sujet'),
                onBlur: handleBlur('sujet'),
                disabled: isDisabled,
              }}
            >
              {sujetOptions.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="fr-fieldset__element">
            <Input
              label="Message"
              hintText="Minimum 10 caractères"
              textArea
              state={getMessageState()}
              stateRelatedMessage={
                getMessageState() === 'error'
                  ? 'Le message doit contenir au moins 10 caractères'
                  : undefined
              }
              nativeTextAreaProps={{
                required: true,
                value: formData.message,
                onChange: handleChange('message'),
                onBlur: handleBlur('message'),
                rows: 8,
                disabled: isDisabled,
              }}
            />
          </div>
        </fieldset>

        {showCaptcha && (
          <fieldset className="fr-fieldset fr-mt-4w">
            <legend className="fr-fieldset__legend">
              <h3 className="fr-h6">Vérification anti-spam</h3>
            </legend>

            <div className="fr-fieldset__element">
              <div className="fr-grid-row fr-grid-row--center">
                <div className="fr-col-12 fr-col-md-8">
                  {isAltchaLoaded
                    ? (
                        <altcha-widget
                          ref={onRefChange as any}
                          test
                          challengeurl={`https://eu.altcha.org/api/v1/challenge?apiKey=${ALTCHA_API_KEY}`}
                          spamfilter={true}
                          blockspam={true}
                          maxnumber={1000000}
                          auto="onsubmit"
                        />
                      )
                    : (
                        <div className="fr-callout">
                          <p className="fr-callout__text">
                            <span className="fr-icon-refresh-line fr-icon--sm" aria-hidden="true"></span>
                            {' '}Chargement de la vérification anti-spam...
                          </p>
                        </div>
                      )}
                </div>
              </div>
            </div>
          </fieldset>
        )}

        <ul className="fr-btns-group fr-mt-4w">
          <li>
            <Button
              disabled={!isFormDataValid() || isDisabled || (waitingForVerification && !isAltchaVerified)}
              type="submit"
            >
              {isDisabled
                ? 'Envoi en cours...'
                : waitingForVerification && !isAltchaVerified
                  ? 'Vérification en cours...'
                  : 'Envoyer le message'}
            </Button>
          </li>
        </ul>
      </form>
    </>
  )
}
