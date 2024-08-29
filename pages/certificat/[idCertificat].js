/* eslint-disable unicorn/filename-case */
import PropTypes from 'prop-types'
import {Compass} from 'react-feather'
import getConfig from 'next/config'
import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'

const {NEXT_PUBLIC_API_BAN_URL} = getConfig().publicRuntimeConfig

function Certificat({certificat = {}, id = '1234'}) {
  const formatDate = dateString => {
    const date = new Date(dateString)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short', // This will show 'UTC'
    }
    return new Intl.DateTimeFormat('fr-FR', options).format(date)
  }

  return (
    <Page title={`Certificat d'adressage numéro : ${id}`}>
      <Head
        title={'Certificat d\'adressage'}
        icon={<Compass color='white' size={56} alt='' aria-hidden='true' />}
      >
        Certificat d&apos;adressage
      </Head>

      <Section>
        <div className='certificate-container'>
          <h1 className='certificate-title'>Certificat d&apos;adressage numéro {id}</h1>
          {certificat.id ? (
            <>
              <div className='certificate-field'>
                <span className='field-label'>Identifiant certificat : </span>
                <span className='field-value'>{id}</span>
              </div>
              <div className='certificate-field'>
                <span className='field-label'>Adresse : </span>
                {certificat.full_address.suffix ?
                  <span className='field-value'>{`${certificat.full_address.number} ${certificat.full_address.suffix} ${certificat.full_address.commonToponymDefaultLabel}`}</span> :
                  <span className='field-value'>{`${certificat.full_address.number} ${certificat.full_address.commonToponymDefaultLabel}`}</span>}
              </div>
              {/*
              <div className='certificate-field'>
                <span className='field-label'>Code insee : </span>
                <span className='field-value'>{certificat.full_address.cog}</span>
              </div>
              */}
              <div className='certificate-field'>
                <span className='field-label'>Commune : </span>
                <span className='field-value'>{certificat.full_address.districtDefaultLabel}</span>
              </div>
              <div className='certificate-field'>
                <span className='field-label'>Parcelles : </span>
                <span className='field-value'>{certificat.cadastre_ids.map(id => id.replace(/(\d+)([A-Z])/, '$1 $2')).join(', ')}</span>
              </div>
              <div className='certificate-field'>
                <span className='field-label'>Date de délivrance : </span>
                <span className='field-value'>{formatDate(certificat.createdAt)}</span>
              </div>
            </>
          ) : (
            <p>Ce certificat n&apos;existe pas</p>
          )}
        </div>
      </Section>

      <style jsx>{`
        .certificate-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .certificate-title {
          color: #343a40;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .certificate-field {
          margin-bottom: 1rem;
        }
        .field-label {
          font-weight: bold;
          color: #495057;
        }
        .field-value {
          color: #212529;
        }
      `}</style>
    </Page>
  )
}

export async function getServerSideProps({query}) {
  const {idCertificat} = query
  const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/${idCertificat}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const certificat = (response.ok) ? await response.json() : {}
  return {
    props: {
      certificat,
      id: idCertificat
    }
  }
}

Certificat.propTypes = {
  certificat: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
}

export default Certificat
