// pages/certificat.tsx ou un fichier similaire
import { GetServerSidePropsContext } from 'next'
import PropTypes from 'prop-types'
import Section from '@/components/Section'
import NotFoundPage from '@/app/not-found'
import {
  CertificateContainer,
  CertificateTitle,
  CertificateField,
  FieldLabel,
  FieldValue,
} from './certificat.styles' // Importer les styled components

const { NEXT_PUBLIC_API_BAN_URL } = process.env

interface CertificatProps {
  certificat: {
    id?: string
    full_address?: {
      number: string
      suffix?: string
      commonToponymDefaultLabel: string
      districtDefaultLabel: string
    }
    cadastre_ids: string[]
    createdAt: string
  }
  id: string
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { idCertificat } = query
  const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/${idCertificat}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  const certificat = response.ok ? await response.json() : {}
  return { props: { certificat, id: idCertificat } }
}

const Certificat = ({ certificat, id }: CertificatProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris', timeZoneName: 'long' }
    // return new Intl.DateTimeFormat('fr-FR', options).format(date) TODO
    return new Intl.DateTimeFormat('fr-FR').format(date)
  }

  const path = ['certificat', id]

  return (
    <>
      <Section>
        <CertificateContainer>
          <CertificateTitle>Certificat d&apos;adressage numéro {id}</CertificateTitle>
          {certificat.id
            ? (
                <>
                  <CertificateField>
                    <FieldLabel>Identifiant certificat :</FieldLabel>
                    <FieldValue>{id}</FieldValue>
                  </CertificateField>
                  <CertificateField>
                    <FieldLabel>Adresse :</FieldLabel>
                    <FieldValue>{certificat.full_address?.number} {certificat.full_address?.suffix || ''} {certificat.full_address?.commonToponymDefaultLabel}</FieldValue>
                  </CertificateField>
                  <CertificateField>
                    <FieldLabel>Commune :</FieldLabel>
                    <FieldValue>{certificat.full_address?.districtDefaultLabel}</FieldValue>
                  </CertificateField>
                  <CertificateField>
                    <FieldLabel>Parcelles :</FieldLabel>
                    <FieldValue>{certificat.cadastre_ids?.map(id => id.replace(/(\d+)([A-Z])/, '$1 $2')).join(', ')}</FieldValue>
                  </CertificateField>
                  <CertificateField>
                    <FieldLabel>Date de délivrance :</FieldLabel>
                    <FieldValue>{formatDate(certificat.createdAt)}</FieldValue>
                  </CertificateField>
                </>
              )
            : (
                <NotFoundPage />
              )}
        </CertificateContainer>
      </Section>
    </>
  )
}

Certificat.propTypes = {
  certificat: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
}

export default Certificat
