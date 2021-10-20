
import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import {ArrowLeft} from 'react-feather'

import Page from '@/layouts/main'

import Section from '@/components/section'
import Notification from '@/components/notification'

import {uploadCSV, submissionsBal, getSubmissions, submitBal, askAuthentificationCode} from '@/lib/bal/api'

import ButtonLink from '@/components/button-link'
import Steps from '@/components/bases-locales/publication/steps'
import ManageFile from '@/components/bases-locales/publication/manage-file'
import Authentification from '@/components/bases-locales/publication/authentification'
import Form from '@/components/bases-locales/publication/form'
import Publishing from '@/components/bases-locales/publication/publishing'
import Published from '@/components/bases-locales/publication/published'
import CodeAuthentification from '@/components/bases-locales/publication/code-authentification'

const getStep = submission => {
  if (submission) {
    switch (submission.status) {
      case 'created':
        return 2
      case 'pending':
        return 4
      case 'published':
        return 5
      default:
        break
    }
  } else {
    return 1
  }
}

const PublicationPage = React.memo(({redirectUrl, defaultSubmission, submissionError}) => {
  const [submission, setSubmission] = useState(defaultSubmission)

  const [step, setStep] = useState(getStep(submission))
  const [authType, setAuthType] = useState()
  const [error, setError] = useState(submissionError)

  const handleFile = async file => {
    try {
      const submission = await uploadCSV(file)
      setSubmission(submission)
      setStep(2)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCodeAuthentification = async () => {
    const response = await askAuthentificationCode(submission._id)

    if (response.ok) {
      setAuthType('code')
      setStep(3)
    } else {
      const {message} = await response.json()
      setError(message)
    }
  }

  const handlePublication = useCallback(async () => {
    try {
      await submitBal(submission._id)
      setStep(5)
    } catch (error) {
      setError(`Impossible de publier la Base Adresse Locale: ${error.message}`)
    }
  }, [submission])

  useEffect(() => {
    const step = getStep(submission)
    setStep(step)
  }, [submission])

  useEffect(() => {
    // Prevent reset submissionError at first render
    if (step !== 1) {
      setError(null)
    }
  }, [step])

  useEffect(() => {
    if (submission?.authenticationError) {
      setError(submission.authenticationError)
    }
  }, [step, submission])

  return (
    <Page>
      {redirectUrl && (
        <Section background='color' style={{padding: '1em 0'}}>
          <ButtonLink href={redirectUrl} color='white' isOutlined isExternal>
            <ArrowLeft style={{marginRight: '5px', verticalAlign: 'middle'}} /> Retour à Mes Adresses
          </ButtonLink>
        </Section>
      )}

      <Section>
        <h1>Publication d’une Base Adresse Locale</h1>
        {submission && <h3>{submission.commune.nom} - {submission.commune.code}</h3>}

        <Steps step={step} />

        {error && (
          <Notification type='error' onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        <div className='current-step'>
          {/* Hide file handler to prevent the submitmission of a different file from the original */}
          {!submissionError && step === 1 && (
            <ManageFile handleFile={handleFile} error={error} handleError={setError} />
          )}

          {step === 2 && (
            <Authentification
              communeEmail={submission.commune.email}
              handleCodeAuthentification={handleCodeAuthentification}
              authenticationUrl={submission.authenticationUrl}
            />
          )}

          {step === 3 && (
            authType === 'code' ? (
              <CodeAuthentification
                submissionId={submission._id}
                email={submission.commune.email}
                handleValidCode={() => setStep(4)}
                sendBackCode={handleCodeAuthentification}
                cancel={() => setStep(2)}
              />
            ) : <Form mail='' />
          )}

          {step === 4 && (
            <Publishing
              user={submission.authentication}
              commune={submission.commune}
              publication={handlePublication}
            />
          )}

          {step === 5 && (
            <Published {...submission} redirectUrl={redirectUrl} />
          )}
        </div>
      </Section>

      <style jsx>{`
        .current-step {
          margin: 4em 0;
        }
      `}</style>
    </Page>
  )
})

PublicationPage.getInitialProps = async ({query}) => {
  const {url, redirectUrl, submissionId} = query
  let submission

  if (submissionId) {
    try {
      submission = await getSubmissions(submissionId)
    } catch {
      return {
        redirectUrl,
        submissionError: 'Aucune demande de publication n’a été trouvée'
      }
    }
  } else if (url) {
    try {
      submission = await submissionsBal(decodeURIComponent(url))
    } catch (error) {
      return {
        redirectUrl,
        submissionError: error.message
      }
    }
  }

  return {
    redirectUrl,
    defaultSubmission: submission,
  }
}

PublicationPage.propTypes = {
  redirectUrl: PropTypes.string,
  defaultSubmission: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commune: PropTypes.object.isRequired,
    authentication: PropTypes.string,
    authenticationError: PropTypes.string,
    authenticationUrl: PropTypes.string,
    publicationUrl: PropTypes.string
  }),
  submissionError: PropTypes.string
}

PublicationPage.defaultProps = {
  redirectUrl: null,
  defaultSubmission: null,
  submissionError: null
}

export default PublicationPage
