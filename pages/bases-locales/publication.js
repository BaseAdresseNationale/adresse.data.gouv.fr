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

const getStep = bal => {
  if (bal) {
    switch (bal.status) {
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

const PublicationPage = React.memo(({defaultBal, initialError, submissionId}) => {
  const [bal, setBal] = useState(defaultBal)
  const [step, setStep] = useState(getStep(bal))
  const [authType, setAuthType] = useState()
  const [error, setError] = useState(initialError)

  const handleFile = async file => {
    try {
      const bal = await uploadCSV(file)
      setBal(bal)
      setStep(2)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCodeAuthentification = async () => {
    const response = await askAuthentificationCode(bal._id)

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
      Router.push(`/bases-locales/publication?submissionId=${submissionId}`)
    } catch (error) {
      setError(error.message)
    }
  }, [submissionId])

  useEffect(() => {
    const step = getStep(bal)
    setStep(step)
  }, [bal])

  useEffect(() => {
    if (bal) {
      if (!submissionId) {
        const href = `/bases-locales/publication?submissionId=${bal._id}`
        Router.push(href, {shallow: true})
      }

      if (bal.authenticationError) {
        setError(bal.authenticationError)
      }
    } else if (step > 1) {
      setError('Aucune Base Adresse Locale n’a été trouvée')
    }
  }, [step, bal, error, submissionId])

  return (
    <Page>
      <Section background='color' style={{padding: '1em 0'}}>
        <ButtonLink href='https://mes-adresses.data.gouv.fr/' color='white' isOutlined isExternal>
          <ArrowLeft style={{marginRight: '5px', verticalAlign: 'middle'}} /> Retour à Mes Adresses
        </ButtonLink>
      </Section>

      <Section>
        <h1>Publication d’une Base Adresse Locale</h1>
        {bal && <h3>{bal.commune.nom} - {bal.commune.code}</h3>}

        <Steps step={step} />

        {error && (
          <Notification type='error' onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        <div className='current-step'>
          {step === 1 && (
            <ManageFile
              url=''
              handleFile={handleFile}
            />
          )}

          {step === 2 && (
            <Authentification
              communeEmail={bal.commune.email}
              handleCodeAuthentification={handleCodeAuthentification}
              authenticationUrl={bal.authenticationUrl}
            />
          )}

          {step === 3 && (
            authType === 'code' ? (
              <CodeAuthentification
                balId={bal._id}
                email={bal.commune.email}
                handleValidCode={() => setStep(4)}
                sendBackCode={handleCodeAuthentification}
                cancel={() => setStep(2)}
              />
            ) : <Form mail='' />
          )}

          {step === 4 && (
            <Publishing
              user={bal.authentication}
              commune={bal.commune}
              publication={handlePublication}
            />
          )}

          {step === 5 && (
            <Published {...bal} />
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
  let bal

  if (submissionId) {
    bal = await getSubmissions(submissionId)
  } else if (url) {
    try {
      bal = await submissionsBal(decodeURIComponent(url))
    } catch {
      return {
        initialError: 'Une erreur est survenue lors de la récupération du fichier'
      }
    }
  }

  return {
    bal,
    submissionId,
    user: bal && bal.authentication ? bal.authentication : null
  }
}

PublicationPage.propTypes = {
  defaultBal: PropTypes.shape({
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
  defaultBal: null,
  submissionId: null,
  initialError: null
}

export default PublicationPage
