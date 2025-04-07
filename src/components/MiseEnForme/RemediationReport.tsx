import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Section from '../Section'
import { ValidateType } from '@ban-team/validateur-bal'
import RemediationTable from './RemediationRows'

interface RemediationReportProps {
  file: File
  report: ValidateType
}

function RemediationReport({ file, report }: RemediationReportProps) {
  const { rows } = report

  const nbRowsRemediation = rows.reduce((acc, value) => Object.keys(value.remediations).length > 0 ? acc + 1 : acc, 0)

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
              description={`Il y a ${nbRowsRemediation} ligne(s) qui peuvent être mises en formes`}
              severity="info"
              title="Mise en forme disponible"
            />
          )}
      {rows && <RemediationTable rows={rows} /> }
    </>
  )
}

export default RemediationReport
