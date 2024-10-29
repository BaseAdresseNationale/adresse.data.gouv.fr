import { Download } from '@codegouvfr/react-dsfr/Download'
import React from 'react'

interface DownloadCertificateProps {
  id: string
  title?: string
}

const DownloadCertificate: React.FC<DownloadCertificateProps> = ({ id, title }) => {
  return (
    <Download
      label={title}
      details="PDF"
      linkProps={{
        href: `/api/certificat/${id}`,
        target: '_blank',
      }}
    />
  )
}

export default DownloadCertificate
