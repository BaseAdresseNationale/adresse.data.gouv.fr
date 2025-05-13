import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { autofix, ValidateType } from '@ban-team/validateur-bal'
import RemediationTable from './RemediationRows'
import Button from '@codegouvfr/react-dsfr/Button'
import { useMemo, useRef } from 'react'
import { getNbRowsRemediation } from '../../utils/remediation'

interface RemediationReportProps {
  file: File
  report: ValidateType
}

function RemediationReport({ file, report }: RemediationReportProps) {
  const { rows } = report

  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const nbRowsRemediation = useMemo(() => getNbRowsRemediation(rows), [rows])

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
                  <p>{nbRowsRemediation} ligne{nbRowsRemediation > 1 && 's'} {nbRowsRemediation > 1 ? 'ont' : 'a'} été modifiée{nbRowsRemediation > 1 && 's'}, vous pouvez télécharger le fichier BAL corrigé</p>
                  <Button
                    iconId="fr-icon-download-line"
                    onClick={handleClick}
                    title="Télécharger"
                  >Télécharger
                  </Button>
                </div>
              )}
              severity="info"
              title="Mise en forme disponible"
            />
          )}
      {nbRowsRemediation > 0
      && (
        <>
          <h3 style={{ marginTop: '32px', marginBottom: '12px' }}>Consultez les modifications</h3>
          <RemediationTable rows={rows} />
        </>
      )}
      <a ref={linkRef} style={{ display: 'none' }}>Download</a>
    </>
  )
}

export default RemediationReport
