import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import Page from '../../layouts/main'

import withErrors from '../../components/hoc/with-errors'
import Section from '../../components/section'
import Notification from '../../components/notification'

import {submissionsBal, getSubmissions, submitBal} from '../../lib/bal/api'

import Steps from '../../components/bases-locales/publication/steps'
import ManageFile from '../../components/bases-locales/publication/manage-file'
import Authentification from '../../components/bases-locales/publication/authentification'
import Form from '../../components/bases-locales/publication/form'
import Publishing from '../../components/bases-locales/publication/publishing'
import Published from '../../components/bases-locales/publication/published'

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

const PublicationPage = React.memo(({submission, submissionId}) => {
  const [step, setStep] = useState(getStep(submission))
  const [error, setError] = useState(null)

  const handleValidBal = balReport => {
    // TODO Allow uploading a file with submissionsBal
    setError('La fonctionnalitée de téléversement n’est pas encore disponible. Merci de bien vouloir réessayer utltérieurement.')
    // SetStep(2)
  }

  const handlePublicationRequest = () => {
    setStep(3)
  }

  const handleSendMail = () => {}

  const handlePublication = useCallback(async () => {
    try {
      await submitBal(submissionId)
      const href = `/bases-locales/publication?submissionId=${submission._id}`
      const as = href

      Router.push(href, as)
    } catch (error) {
      setError(error.message)
    }
  }, [submission, submissionId])

  useEffect(() => {
    const step = getStep(submission)
    setStep(step)
  }, [submission])

  useEffect(() => {
    if (submission) {
      if (!submissionId) {
        const href = `/bases-locales/publication?submissionId=${submission._id}`
        const as = href

        Router.push(href, as, {shallow: true})
      }

      if (submission.authenticationError) {
        setError(submission.authenticationError)
      }
    }
  }, [error, submission, submissionId])

  return (
    <Page>
      <Section>
        <h1>Publication d’une Base Adresse Locale</h1>

        {error && (
          <Notification type='error'>
            {error}
          </Notification>
        )}

        {submission && <h3>{submission.commune.nom} - {submission.commune.code}</h3>}

        <Steps step={step} />

        <div className='current-step'>
          {step === 1 && (
            <ManageFile
              url=''
              handleValidBal={handleValidBal}
            />
          )}

          {step === 2 && (
            <Authentification
              mail={null}
              authenticationUrl={submission.authenticationUrl}
              sendMail={handleSendMail}
              publicationRequest={handlePublicationRequest}
            />
          )}

          {step === 3 && (
            <Form mail='' />
          )}

          {step === 4 && (
            <Publishing
              user={submission.authentication}
              commune={submission.commune}
              publication={handlePublication}
            />
          )}

          {step === 5 && (
            <Published publicationUrl={submission.publicationUrl} />
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
    submission = await submissionsBal(decodeURIComponent(url))
  }

  return {
    submission,
    submissionId,
    user: submission && submission.authentication ? submission.authentication : null
  }
}

PublicationPage.propTypes = {
  submission: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    commune: PropTypes.object.isRequired,
    authentication: PropTypes.string,
    authenticationError: PropTypes.string,
    authenticationUrl: PropTypes.string,
    publicationUrl: PropTypes.string
  }),
  submissionId: PropTypes.string
}

PublicationPage.defaultProps = {
  submission: null,
  submissionId: null
}

export default withErrors(PublicationPage)
