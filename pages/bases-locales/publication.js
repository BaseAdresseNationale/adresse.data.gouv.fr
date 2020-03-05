import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import Page from '../../layouts/main'

import withErrors from '../../components/hoc/with-errors'
import Section from '../../components/section'
import Notification from '../../components/notification'

import {BACKEND_URL, submissionsBal, getSubmissions, getMandat, submitBal} from '../../lib/bal/api'

import Steps from '../../components/bases-locales/publication/steps'
import ManageFile from '../../components/bases-locales/publication/manage-file'
import Authentification from '../../components/bases-locales/publication/authentification'
import Form from '../../components/bases-locales/publication/form'
import Publishing from '../../components/bases-locales/publication/publishing'
import Published from '../../components/bases-locales/publication/published'

const PublicationPage = React.memo(({submissionId, submission}) => {
  const [step, setStep] = useState(null)
  const [error, setError] = useState(null)
  const [mandat, setMandat] = useState(null)

  const handleValidBal = () => {
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
    async function getCurrentMandat() {
      const mandat = await getMandat(submission.commune.code)
      setMandat(mandat)
    }

    getCurrentMandat()
  }, [submission])

  useEffect(() => {
    let step = 1

    if (submission) {
      const {status} = submission
      if (status === 'published') {
        step = 5
      }

      step = mandat ? 4 : 2
    }

    setStep(step)
  }, [mandat, submission])

  useEffect(() => {
    if (submission) {
      if (!submissionId) {
        const href = `/bases-locales/publication?submissionId=${submission._id}`
        const as = href

        Router.push(href, as, {shallow: true})
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
              authenticationUrl={`${BACKEND_URL}/publication/fc/authenticate`}
              sendMail={handleSendMail}
              publicationRequest={handlePublicationRequest}
            />
          )}

          {step === 3 && (
            <Form mail='' />
          )}

          {step === 4 && (
            <Publishing
              mandat={mandat}
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
    submissionId
  }
}

PublicationPage.defaultProps = {
  submissionId: null,
  submission: null
}

PublicationPage.propTypes = {
  submission: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.oneOf([
      'pending',
      'published'
    ]).isRequired,
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    publicationUrl: PropTypes.string
  }),
  submissionId: PropTypes.string
}

export default withErrors(PublicationPage)
