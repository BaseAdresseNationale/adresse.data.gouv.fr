import React, { useState, useCallback, useEffect } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'

import ActionButtonDisabled from './ActionButtonDisabled'

interface DownloadCertificateProps {
  id: string
  title?: string
  message?: React.ReactNode
  disabled?: boolean
}

interface HandleButtonDownloadEvent extends React.MouseEvent<HTMLButtonElement> {}

const ActionDownloadCertificate: React.FC<DownloadCertificateProps> = ({ id, title, message, disabled }) => {
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [certificateId, setCertificateId] = useState<string | null>(null)

  useEffect(() => {
    setHasDownloaded(false)
    setCertificateId(null)
  }, [id])

  interface CertificateResponse {
    id: string
  }
  const handleDownload = useCallback(async (evt: HandleButtonDownloadEvent) => {
    evt?.preventDefault()
    try {
      let downloadUrl = ''

      if (certificateId) {
        downloadUrl = `/api/certificat/pdf/${certificateId}`
      }
      else {
        const response = await fetch(`/api/certificat/${id}`)
        if (!response.ok) throw new Error('Erreur lors de la récupération du certificat')

        const result: CertificateResponse = await response.json()
        setCertificateId(result.id)
        setHasDownloaded(true)

        downloadUrl = `/api/certificat/pdf/${result.id}`
      }

      const link = document.createElement('a')
      link.setAttribute('href', downloadUrl)
      link.setAttribute('download', `certificat_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    catch (error) {
      console.error('Erreur lors du téléchargement du certificat :', error)
    }
  }, [certificateId, id])

  return (!disabled)
    ? (
        <Button
          iconId="ri-file-paper-2-line"
          onClick={handleDownload}
          priority="tertiary no outline"
        >
          {title || (!hasDownloaded ? 'Télécharger le certificat (PDF)' : 'Re-Télécharger le certificat (PDF)')}
        </Button>
      )
    : (
        <ActionButtonDisabled
          iconId="ri-file-paper-2-line"
          title="Certificat d’adressage"
          message={message}
        />
      )
}

export default ActionDownloadCertificate
