import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { ValidateType } from '@ban-team/validateur-bal'
import RemediationTable from './RemediationRows'
import { useMemo, useRef } from 'react'
import { getNbRowsRemediation } from '../../utils/remediation'
import AlertMiseEnForme from './MiseEnFormeAlert'
import ValidationTableError from '../ValidateurBAL/ValidationTableError'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  margin-top: 12px;
`

interface RemediationReportProps {
  file: File
  report: ValidateType
}

function RemediationReport({ file, report }: RemediationReportProps) {
  const { rows } = report
  const nbRowsRemediation = useMemo(() => getNbRowsRemediation(rows), [rows])
  const codeCommune = useMemo(() => {
    return rows[0].parsedValues.commune_insee || rows[0].additionalValues?.uid_adresse?.codeCommune
  }, [rows])

  return (
    <StyledWrapper>
      {nbRowsRemediation <= 0
        ? (
            <Alert
              description={`Le fichier BAL n'a pas été corrigé ou amélioré.`}
              severity="info"
              title="Mise en forme non disponible"
            />
          )
        : (
            <>
              <AlertMiseEnForme file={file} nbRowsRemediation={nbRowsRemediation} codeCommune={codeCommune} />
              <br />
              <h4>Consultez les erreurs</h4>
              <ValidationTableError report={report} />
              <h4>Consultez les modifications</h4>
              <RemediationTable rows={rows} />
            </>
          )}
    </StyledWrapper>
  )
}

export default RemediationReport
