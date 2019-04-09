import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'

import Page from '../../layouts/main'

import Section from '../../components/section'

import Steps from '../../components/bases-locales/publication/steps'
import ManageFile from '../../components/bases-locales/publication/manage-file'
import Authentification from '../../components/bases-locales/publication/authentification'
import Form from '../../components/bases-locales/publication/form'

const PublicationPage = React.memo(({url}) => {
  const [step, setStep] = useState(2)
  const [bal, setBal] = useState(null)

  const handleValidBal = useCallback(bal => {
    setBal(bal)
    setStep(2)
  })

  const handlePublicationRequest = useCallback(() => {
    setStep(3)
  })

  const handleFranceConnect = useCallback(() => {
  })

  const handleSendMail = useCallback(() => {
  })

  return (
    <Page>
      <Section>
        <h1>Publication base adresses locales</h1>
        {bal && <h3>{bal.nom}</h3>}

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
              franceConnect={handleFranceConnect}
              sendMail={handleSendMail}
              publicationRequest={handlePublicationRequest}
            />
          )}

          {step === 3 && (
            <Form mail='d' />
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
  const {url} = query

  return {
    url
  }
}

PublicationPage.propTypes = {
  url: PropTypes.string
}

PublicationPage.defaultProps = {
  url: null
}

export default PublicationPage
