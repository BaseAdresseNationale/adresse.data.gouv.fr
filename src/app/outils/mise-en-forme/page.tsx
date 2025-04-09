'use client'

import React, { useRef, useState } from 'react'
import { autofix, ParseFileType, validate, ValidateType } from '@ban-team/validateur-bal'
import Loader from '@/components/Loader'
import DropZoneInput from '@/components/DropZoneInput'
import Section from '@/components/Section'
import Button from '@codegouvfr/react-dsfr/Button'
import RemediationReport from '@/components/MiseEnForme/RemediationReport'
import Alert from '@codegouvfr/react-dsfr/Alert'

export default function MiseEnFormePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [report, setReport] = useState<ParseFileType | ValidateType | null>(null)

  const getReport = async (value: File) => {
    if (!value) {
      throw new Error('No file selected')
    }
    try {
      setIsLoading(true)
      const report = await validate(value as any)
      setReport(report)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setReport(null)
  }

  const handleFileChange = async (value?: File) => {
    if (!value) {
      throw new Error('No file selected')
    }
    try {
      setIsLoading(true)
      setFile(value)
      getReport(value)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Section pageTitle="Mise en forme BAL">
        {isLoading
          ? <Loader />
          : (file && report)
              ? (
                  <>
                    <Button iconId="fr-icon-arrow-left-line" style={{ height: 'fit-content', marginBottom: 12 }} onClick={handleReset}>Retour à la sélection du fichier</Button>
                    {report.parseOk
                      ? (
                          <RemediationReport file={file} report={report as ValidateType} />
                        )
                      : (
                          <Alert
                            title="Erreur dans le fichier BAL"
                            severity="error"
                            description={<p>Pour plus de détail utilisez le <a href="/outils/validateur-bal">validateur</a>.</p>}
                          />
                        )}
                  </>
                )
              : (
                  <DropZoneInput
                    onChange={handleFileChange}
                    label="Déposer ou cliquer ici pour télécharger votre fichier BAL"
                    hint="Taille maximale: 50 Mo. Format supporté : CSV"
                    accept={{ 'text/csv': [], 'application/vnd.ms-excel': [] }}
                    maxSize={50 * 1024 * 1024}
                  />
                )}
      </Section>
    </>
  )
}
