
import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

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

const PublicationPage = React.memo(({isRedirected, defaultSubmission, initialError, submissionId}) => {
  const [submission, setSubmission] = useState(defaultSubmission)
  const [step, setStep] = useState(getStep(submission))
  const [authType, setAuthType] = useState()
  const [error, setError] = useState(initialError)

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
      await submitBal(submissionId)
      setStep(5)
    } catch (error) {
      setError(`Impossible de publier la Base Adresse Locale: ${error.message}`)
    }
  }, [submissionId])

  useEffect(() => {
    const step = getStep(submission)
    setStep(step)
  }, [submission])

  useEffect(() => {
    setError(null)
  }, [step])

  useEffect(() => {
    if (submission) {
      if (!submissionId) {
        const href = `/bases-locales/publication?submissionId=${submission._id}`
        Router.push(href, {shallow: true})
      }

      if (submission.authenticationError) {
        setError(submission.authenticationError)
      }
    } else if (step > 1) {
      setError('Aucune Base Adresse Locale n’a été trouvée')
    }
  }, [step, submission, error, submissionId])

  return (
    <Page>
      {isRedirected && (
        <Section background='color' style={{padding: '1em 0'}}>
          <ButtonLink href='https://mes-adresses.data.gouv.fr/' color='white' isOutlined isExternal>
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
          {step === 1 && (
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
            <Published {...submission} />
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
  const {url, submissionId} = query
  let submission

  if (submissionId) {
    submission = await getSubmissions(submissionId)
  } else if (url) {
    try {
      submission = await submissionsBal(decodeURIComponent(url))
    } catch (error) {
      return {
        initialError: error.message
      }
    }
  }

  return {
    isRedirected: Boolean(url),
    defaultSubmission: submission,
    submissionId,
    user: {}
  }
}

PublicationPage.propTypes = {
  isRedirected: PropTypes.bool,
  defaultSubmission: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commune: PropTypes.object.isRequired,
    authentication: PropTypes.string,
    authenticationError: PropTypes.string,
    authenticationUrl: PropTypes.string,
    publicationUrl: PropTypes.string
  }),
  submissionId: PropTypes.string,
  initialError: PropTypes.string
}

PublicationPage.defaultProps = {
  isRedirected: false,
  defaultSubmission: null,
  submissionId: null,
  initialError: null
}

export default PublicationPage
