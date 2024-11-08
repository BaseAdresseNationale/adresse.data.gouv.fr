/* eslint-disable @stylistic/multiline-ternary */
import { Download } from '@codegouvfr/react-dsfr/Download'
import React, { useState } from 'react'

interface DownloadCertificateProps {
  id: string
  title?: string
}

const DownloadCertificate: React.FC<DownloadCertificateProps> = ({ id, title }) => {
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [certificateId, setCertificateId] = useState<string | null>(null)

  const handleDownload = async () => {
    try {
      let downloadUrl = ''

      if (certificateId) {
        downloadUrl = `/api/certificat/pdf/${certificateId}`
      }
      else {
        const response = await fetch(`/api/certificat/${id}`)
        if (!response.ok) throw new Error('Erreur lors de la récupération du certificat')

        const result = await response.json()
        setCertificateId(result.id)
        setHasDownloaded(true)

        downloadUrl = `/api/certificat/pdf/${result.id}`
      }

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `certificat_${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    catch (error) {
      console.error('Erreur lors du téléchargement du certificat :', error)
    }
  }

  return (
    <div>
      {!hasDownloaded ? (
        <Download
          label={title || 'Télécharger le certificat'}
          details="PDF"
          linkProps={{
            href: '#',
            onClick: handleDownload,
          }}
        />
      ) : (
        <div>
          <span>Vous avez déjà téléchargé ce certificat.</span>
          <div>
            <p>ID du certificat : {certificateId}</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleDownload()
              }}
            >
              Cliquez ici pour le télécharger à nouveau
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default DownloadCertificate
