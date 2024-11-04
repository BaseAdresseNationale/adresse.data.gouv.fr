import Section from '@/components/Section'
import NotFoundPage from '@/app/not-found'
import {
  CertificateContainer,
  CertificateTitle,
  CertificateField,
  FieldLabel,
  FieldValue,
} from './page.styles'

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

// const Certificat = ({ certificat, id }: CertificatProps) => {
async function Certificat({ params }: { params: { idCertificat: string } }) {
  const { idCertificat } = params
  const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/${idCertificat}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  const certificat = response.ok ? await response.json() : {}

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Paris',
      timeZoneName: 'longGeneric',
    }
    return new Intl.DateTimeFormat('fr-FR', options).format(date)
  }

  const path = ['certificat', idCertificat]

  return (
    <>
      <Section>
        <CertificateContainer>
          <CertificateTitle>Certificat d&apos;adressage</CertificateTitle>
          {certificat.id
            ? (
                <>
                  <p>
                    La Base Adresse Nationale certifie que le certificat d’adressage
                    n°<b><code>{idCertificat}</code></b> a été emit par ses services,
                    et contient les informations suivantes :
                  </p>
                  <CertificateField>
                    <FieldLabel>Adresse&nbsp;:</FieldLabel>{' '}
                    <FieldValue>{certificat.full_address?.number} {certificat.full_address?.suffix || ''} {certificat.full_address?.commonToponymDefaultLabel}</FieldValue>
                  </CertificateField>
                  <CertificateField>
                    <FieldLabel>Commune&nbsp;:</FieldLabel>{' '}
                    <FieldValue>{certificat.full_address?.districtDefaultLabel}</FieldValue>
                  </CertificateField>
                  <CertificateField>
                    <FieldLabel>Parcelles&nbsp;:</FieldLabel>{' '}
                    <FieldValue><code>{certificat.cadastre_ids?.map((id: string) => id.replace(/(\d+)([A-Z])/, '$1 $2')).join(', ')}</code></FieldValue>
                  </CertificateField>
                  <CertificateField>
                    <FieldLabel>Identifiant de certificat&nbsp;:</FieldLabel>{' '}
                    <FieldValue><code>{idCertificat}</code></FieldValue>
                  </CertificateField>
                  <CertificateField>
                    <FieldLabel>Date de délivrance&nbsp;:</FieldLabel>{' '}
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

export default Certificat
