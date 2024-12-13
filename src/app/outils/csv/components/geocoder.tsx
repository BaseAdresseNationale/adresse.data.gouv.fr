import React, { useState } from 'react'

import { geocodeCsv } from '@/lib/api-adresse'

import Button from '@codegouvfr/react-dsfr/Button'
import Loader from '@/components/Loader'

function geocodedFileName(originalFileName = 'file') {
  if (originalFileName.toLowerCase().endsWith('.csv')) {
    originalFileName = originalFileName.slice(0, -4)
  }

  return originalFileName + '.geocoded.csv'
}

interface GeocodeurPropTypes {
  file: File
  columns: string[]
  filter?: string
}

export default function Geocoder({ file, columns, filter }: GeocodeurPropTypes) {
  const [status, setStatus] = useState<string | undefined>()
  const [blob, setBlob] = useState<Blob>()
  const [error, setError] = useState<Error | undefined>()

  const handleGeocodeClick = async () => {
    const filters = []

    if (filter) {
      filters.push({
        name: 'citycode',
        value: filter,
      })
    }

    try {
      const blob: Blob = await geocodeCsv(file, filters, columns)
      setBlob(blob)
      setStatus('done')
    }
    catch (error: any) {
      setStatus(undefined)
      setError(error)
    }
  }
  return (
    <div className="geocoder" style={{ margin: '2em 0', textAlign: 'center' }}>
      {!status && (
        <Button onClick={handleGeocodeClick}>Lancer le géocodage</Button>
      )}

      {status === 'pending' && (
        <Button>
          <div className="col">
            En cours de géocodage…
            <Loader />
          </div>
        </Button>
      )}

      {status === 'done' && (
        <a href={blob && URL.createObjectURL(blob)} download={geocodedFileName(file.name)}>
          <Button>Télécharger</Button>
        </a>
      )}

      {error && (
        <p className="error"><b>{error.message}</b><br /><i>Code erreur : {error.name}</i></p>
      )}
    </div>
  )
}
