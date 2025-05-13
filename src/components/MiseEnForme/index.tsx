'use client'

import React, { useState } from 'react'
import { autofix, ParseFileType, validate, ValidateType } from '@ban-team/validateur-bal'
import Loader from '@/components/Loader'
import DropZoneInput from '@/components/DropZoneInput'
import Section from '@/components/Section'
import Button from '@codegouvfr/react-dsfr/Button'
import RemediationReport from '@/components/MiseEnForme/RemediationReport'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Badge from '@codegouvfr/react-dsfr/Badge'
import MiseEnFormeDocumentation from './MiseEnFormeDocumentation'

export default function MiseEnFormeBAL() {
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<ParseFileType | ValidateType | null>(null)
  const [fileMiseEnForme, setFileMiseEnForme] = useState<Blob | null>(null)
  const [reportMiseEnForme, setReportMiseEnForme] = useState<ValidateType | null>(null)

  const handleReset = () => {
    setReport(null)
    setFileMiseEnForme(null)
    setReportMiseEnForme(null)
  }

  const handleFileChange = async (file?: File) => {
    if (!file) {
      throw new Error('No file selected')
    }
    try {
      setIsLoading(true)
      const report = await validate(file as any)
      setReport(report)
      const buffer = await autofix(file as any)
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      setFileMiseEnForme(blob)
      const reportAutofix = await validate(blob as any)
      if (reportAutofix.parseOk) {
        setReportMiseEnForme(reportAutofix as ValidateType)
      }
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
      <Section
        pageTitle={(
          <>
            Mise en forme BAL{' '}
            <Badge noIcon severity="info">BETA</Badge>
          </>
        )}
        title="Améliorez votre BAL grâce à une mise forme automatique"
      >
        {isLoading
          ? <Loader />
          : (report)
              ? (
                  <>
                    <Button iconId="fr-icon-arrow-left-line" style={{ height: 'fit-content', marginBottom: 12 }} onClick={handleReset}>Retour à la sélection du fichier</Button>
                    {report.parseOk
                      ? (
                          <RemediationReport report={report as ValidateType} fileMiseEnForme={fileMiseEnForme} reportMiseEnForme={reportMiseEnForme} />
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
      <MiseEnFormeDocumentation />
      <Section>
        <Alert title="Télécharger l'outil de mise en forme" severity="info" description={<p> Pour une utilisation avancée, vous pouvez télécharger le validateur sur cette <a href="https://github.com/BaseAdresseNationale/validateur-bal/releases" target="_blank" rel="noreferrer">page</a>.</p>} />
      </Section>
    </>
  )
}
