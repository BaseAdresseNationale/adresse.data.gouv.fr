import { Alert } from '@codegouvfr/react-dsfr/Alert'
import styled from 'styled-components'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { autofix } from '@ban-team/validateur-bal'
import { useRef } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import Notice from '@codegouvfr/react-dsfr/Notice'

const AlertMiseEnFormeWrapper = styled.div`

.alert-mise-en-forme-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 12px;
}
`

interface ValidationReportProps {
  file: File
  nbRowsRemediation: number
}

function AlertMiseEnForme({ file, nbRowsRemediation }: ValidationReportProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  const handleDowloadFileAutofix = async () => {
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
      <Alert
        description={(
          <AlertMiseEnFormeWrapper>
            <div className="alert-mise-en-forme-wrapper">
              <p>{nbRowsRemediation} ligne{nbRowsRemediation > 1 && 's'} {nbRowsRemediation > 1 ? 'ont' : 'a'} été modifiée{nbRowsRemediation > 1 && 's'}, vous pouvez télécharger le fichier BAL amélioré.
                <br />Les erreurs, avertissements et informations corrigés sont indiqués ci-dessous dans la partie Validation générale
              </p>
              <Button
                iconId="fr-icon-download-line"
                onClick={handleDowloadFileAutofix}
                title="Télécharger"
              >Télécharger
              </Button>
            </div>
            <Notice
              title="Le fichier téléchargé n&apos;est pas assuré d&apos;être un fichier BAL 100% valide."
            />
          </AlertMiseEnFormeWrapper>
        )}
        severity="info"
        title={(
          <>
            Mise en forme BAL{' '}
            <Badge noIcon severity="info">BETA</Badge>
          </>
        )}
      />
      <a ref={linkRef} style={{ display: 'none' }} />
    </>
  )
}

export default AlertMiseEnForme
