/* eslint-disable unicorn/filename-case */
import PropTypes from 'prop-types'
import {Home} from 'react-feather'
import getConfig from 'next/config'
import Page from '@/layouts/main'
import Head from '@/components/head'

const {NEXT_PUBLIC_API_BAN_URL} = getConfig().publicRuntimeConfig

function Certificat({certificat = {}, id = '1234'}) {
  return (
    <Page id='page' title={`Certificat d'adressage numéro :${id}`}>
      <Head title={'Certificat d\'adressage numéro '} icon={<Home size={56} alt='' aria-hidden='true' />} />
      <section>
        {certificat.id ? (<pre>{JSON.stringify(certificat, null, 2)}</pre>) : 'Ce certificat n\'existe pas'}
      </section>
    </Page>
  )
}

export async function getServerSideProps({query}) {
  const {idCertificat} = query
  const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificat/${idCertificat}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const certificat = (response.ok) ? await response.json() : {}
  console.log(certificat)

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

export default (Certificat)
