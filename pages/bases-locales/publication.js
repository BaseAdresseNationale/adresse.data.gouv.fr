
import {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import Page from '@/layouts/main'

import Section from '@/components/section'
import Notification from '@/components/notification'

import {
  getHabilitation,
  createRevision,
  publishRevision,
  createHabilitation,
  sendAuthenticationCode
} from '@/lib/proxy-api-depot'
import {getRevision, getCurrentRevision} from '@/lib/api-depot'
import {getCommune} from '@/lib/api-geo'

import Steps from '@/components/bases-locales/publication/steps'
import ManageFile from '@/components/bases-locales/publication/manage-file'
import Authentification from '@/components/bases-locales/publication/authentification'
import Publishing from '@/components/bases-locales/publication/publishing'
import Published from '@/components/bases-locales/publication/published'
import CodeAuthentification from '@/components/bases-locales/publication/code-authentification'

const getStep = (revision, habilitation) => {
  if (revision && habilitation) {
    if (revision.status === 'published' && revision.current) {
      // La révision est publiée, fin du formulaire
      return 5
    }

    if (habilitation.status === 'accepted') {
      // Habilitation obtenue, on affiche la confirmation de publication
      return 4
    }

    if (revision.ready && habilitation.status === 'pending') {
      // Code envoyé par email, on affiche le champ de saisi
      if (habilitation?.strategy?.type === 'email') {
        return 3
      }

      // Sélection de la méthode d'authentification
      return 2
    }
  }

  // Dépôt du fichier
  return 1
}

function PublicationPage({defaultRevision, defaultHabilitation, defaultCommune, revisionError}) {
  const [habilitation, setHabilitation] = useState(defaultHabilitation)
  const [revision, setRevision] = useState(defaultRevision)
  const [commune, setCommune] = useState(defaultCommune)
  const [currentRevision, setCurrentRevision] = useState()

  const [step, setStep] = useState(getStep(revision, habilitation))
  const [error, setError] = useState(revisionError)

  const handleFile = async (file, codeCommune) => {
    try {
      const commune = await getCommune(codeCommune)
      setCommune(commune)

      const habilitation = await createHabilitation(codeCommune)
      setHabilitation(habilitation)

      const revision = await createRevision(codeCommune, file) // Gérer le cas où la révision n'est pas valide
      setRevision(revision)

      setStep(2)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCodeAuthentification = async () => {
    try {
      await sendAuthenticationCode(habilitation._id)
      setStep(3)
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchCurrentRevision = useCallback(async () => {
    const currentRevision = await getCurrentRevision(commune.code)
    setCurrentRevision(currentRevision)
  }, [commune])

  const handlePublication = async () => {
    try {
      const publishedRevision = await publishRevision(revision._id, {
        habilitationId: habilitation._id
      })
      setRevision(publishedRevision)
    } catch (error) {
      setError(`Impossible de publier la Base Adresse Locale: ${error.message}`)
    }
  }

  useEffect(() => {
    const step = getStep(revision, habilitation)
    setStep(step)
  }, [revision, habilitation])

  useEffect(() => {
    if (commune && step === 4) {
      fetchCurrentRevision()
    }
  }, [step, commune, fetchCurrentRevision])

  useEffect(() => {
    // Prevent reset revisionError at first render
    if (step !== 1) {
      setError(null)
    }
  }, [step])

  useEffect(() => {
    if (revision?.authenticationError) {
      setError(revision.authenticationError)
    }
  }, [step, revision])

  return (
    <Page>
      <Section>
        <h1>Publication d’une Base Adresse Locale</h1>

        <Steps step={step} />

        {commune && (
          <div className='commune-infos'>
            <Image src='/images/icons/commune.svg' height={60} width={60} />
            <div>{commune.nom} - {commune.code}</div>
          </div>
        )}

        {error && (
          <Notification type='error' onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        <div className='current-step'>
          {/* Hide file handler to prevent the submitmission of a different file from the original */}
          {!revisionError && step === 1 && (
            <ManageFile handleFile={handleFile} error={error} handleError={setError} />
          )}

          {step === 2 && (
            <Authentification
              communeEmail={habilitation.emailCommune}
              revisionId={revision._id}
              habilitationId={habilitation._id}
              handleCodeAuthentification={handleCodeAuthentification}
              authenticationUrl={habilitation.franceconnectAuthenticationUrl}
            />
          )}

          {step === 3 && (
            <CodeAuthentification
              habilitationId={habilitation._id}
              email={habilitation.emailCommune}
              handleValidCode={setHabilitation}
              sendBackCode={handleCodeAuthentification}
              cancel={() => setStep(2)}
            />
          )}

          {habilitation?.status === 'rejected' && (
            <Notification type='error' message='Votre demande d’habilitation a été rejetée.' />
          )}

          {step === 4 && (
            <Publishing
              user={revision.authentication}
              commune={commune}
              hasConflit={Boolean(currentRevision)}
              publication={handlePublication}
            />
          )}

          {step === 5 && (
            <Published communeCode={commune.code} />
          )}
        </div>
      </Section>

      <style jsx>{`
        .current-step {
          margin: 4em 0;
        }

        .commune-infos {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2em 0;
        }

        .commune-infos div {
          font-weight: bold;
          font-size: 24px;
          text-align: center;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
          font-style: italic;
        }
      `}</style>
    </Page>
  )
}

PublicationPage.getInitialProps = async ({query}) => {
  const {habilitationId, revisionId} = query
  let habilitation
  let revision
  let commune

  if (revisionId) {
    try {
      revision = await getRevision(revisionId)
      commune = await getCommune(revision.codeCommune)
    } catch {
      return {
        revisionError: 'Le contexte du formulaire est incorrect ou a été perdu. Merci de réessayer.'
      }
    }
  }

  if (habilitationId) {
    try {
      habilitation = await getHabilitation(habilitationId)
    } catch {
      return {
        revisionError: 'Le contexte du formulaire est incorrect ou a été perdu. Merci de réessayer.'
      }
    }
  }

  return {
    defaultRevision: revision,
    defaultHabilitation: habilitation,
    defaultCommune: commune
  }
}

PublicationPage.propTypes = {
  defaultRevision: PropTypes.object,
  defaultHabilitation: PropTypes.object,
  defaultCommune: PropTypes.object,
  revisionError: PropTypes.string
}

PublicationPage.defaultProps = {
  defaultRevision: null,
  defaultHabilitation: null,
  defaultCommune: null,
  revisionError: null
}

export default PublicationPage
