import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Section from '../Section'
import { autofix, ValidateType } from '@ban-team/validateur-bal'
import RemediationTable from './RemediationRows'
import Button from '@codegouvfr/react-dsfr/Button'
import { useRef } from 'react'

interface RemediationReportProps {
  file: File
  report: ValidateType
}

function RemediationReport({ file, report }: RemediationReportProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const { rows } = report

  const nbRowsRemediation = rows.reduce((acc, value) => Object.keys(value.remediations).length > 0 ? acc + 1 : acc, 0)

  const handleClick = async () => {
    if (!file) {
      throw new Error('No file selected')
    }
    try {
      const buffer = await autofix(file as any)
      const blob = new Blob([buffer], { type: 'application/octet-stream' })

      const url = URL.createObjectURL(blob)

      if (linkRef.current) {
        linkRef.current.href = url
        linkRef.current.download = 'bal-mise-en-forme.csv'
        linkRef.current.click()
      }

      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)
    }
    catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {nbRowsRemediation <= 0
        ? (
            <Alert
              description={`Aucune mise en forme n'est détecté pour améliorer le fichier`}
              severity="success"
              title="Mise en forme non disponible"
            />
          )
        : (
            <Alert
              description={(
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                  <p>Il y a {nbRowsRemediation} ligne(s) qui peuvent être mises en formes</p>
                  <Button
                    iconId="fr-icon-download-line"
                    onClick={handleClick}
                    title="Télécharger"
                  />
                </div>
              )}
              severity="info"
              title="Mise en forme disponible"
            />
          )}
      {rows && <RemediationTable rows={rows} /> }
      <a ref={linkRef} style={{ display: 'none' }}>Download</a>
    </>
  )
}

export default RemediationReport
