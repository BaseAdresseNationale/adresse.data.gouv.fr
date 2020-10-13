import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import {ArrowLeft} from 'react-feather'

import Page from '../../layouts/main'

import withErrors from '../../components/hoc/with-errors'
import Section from '../../components/section'
import Notification from '../../components/notification'

import {submissionsBal, getSubmissions, submitBal} from '../../lib/bal/api'

import ButtonLink from '../../components/button-link'
import Steps from '../../components/bases-locales/publication/steps'
import ManageFile from '../../components/bases-locales/publication/manage-file'
import Authentification from '../../components/bases-locales/publication/authentification'
import Form from '../../components/bases-locales/publication/form'
import Publishing from '../../components/bases-locales/publication/publishing'
import Published from '../../components/bases-locales/publication/published'

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

const PublicationPage = React.memo(({bal, submissionId}) => {
  const [step, setStep] = useState(getStep(bal))
  const [error, setError] = useState(null)

  const handleValidBal = () => {
    setStep(2)
  }

  const handlePublicationRequest = () => {
    setStep(3)
  }

  const handleSendMail = () => {}

  const handlePublication = useCallback(async () => {
    try {
      await submitBal(submissionId)
      const href = `/bases-locales/publication?submissionId=${bal._id}`
      const as = href

      Router.push(href, as)
    } catch (error) {
      setError(error.message)
    }
  }, [bal._id, submissionId])

  useEffect(() => {
    const step = getStep(bal)
    setStep(step)
  }, [bal])

  useEffect(() => {
    if (bal) {
      if (!submissionId) {
        const href = `/bases-locales/publication?submissionId=${bal._id}`
        const as = href

        Router.push(href, as, {shallow: true})
      }

      if (bal.authenticationError) {
        setError(bal.authenticationError)
      }
    } else {
      setError('Aucune base adresses locales n’a été trouvée')
    }
  }, [bal, error, submissionId])

  if (error) {
    return (
      <Page>
        <Section>
          <h1>Publication d’une Base Adresse Locale</h1>
          <Notification type='error'>
            {error}
          </Notification>
        </Section>
      </Page>
    )
  }

  return (
    <Page>
      <Section background='color' style={{padding: '1em 0'}}>
        <ButtonLink href='https://editeur.adresse.data.gouv.fr/' color='white' isOutlined isExternal>
          <ArrowLeft style={{marginRight: '5px', verticalAlign: 'middle'}} /> Retour à l’éditeur de Base Adresse Locale
        </ButtonLink>
      </Section>

      <Section>
        <h1>Publication d’une Base Adresse Locale</h1>
        {bal && <h3>{bal.commune.nom} - {bal.commune.code}</h3>}

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
              authenticationUrl={bal.authenticationUrl}
              sendMail={handleSendMail}
              publicationRequest={handlePublicationRequest}
            />
          )}

          {step === 3 && (
            <Form mail='' />
          )}

          {step === 4 && (
            <Publishing
              user={bal.authentication}
              commune={bal.commune}
              publication={handlePublication}
            />
          )}

          {step === 5 && (
            <Published publicationUrl={bal.publicationUrl} />
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
    bal = await submissionsBal(decodeURIComponent(url))
  }

  return {
    bal,
    submissionId,
    user: bal && bal.authentication ? bal.authentication : null
  }
}

PublicationPage.propTypes = {
  bal: PropTypes.shape({
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
  bal: null,
  submissionId: null
}

export default withErrors(PublicationPage)
