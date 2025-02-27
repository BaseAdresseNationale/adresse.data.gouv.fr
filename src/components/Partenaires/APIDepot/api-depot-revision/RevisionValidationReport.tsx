'use client'

import { Revision } from '@/types/api-depot.types'
import { getLabel } from '@ban-team/validateur-bal'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Badge from '@codegouvfr/react-dsfr/Badge'
import styled from 'styled-components'

const StyledWrapper = styled.div`
    .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
`

interface RevisionValidationReportProps {
  validationReport: Revision['validation']
}

export default function RevisionValidationReport({ validationReport }: RevisionValidationReportProps) {
  return validationReport
    ? (
        <StyledWrapper>
          <div className="header">
            <div>Statut : {validationReport.valid ? <Badge severity="success">Valide</Badge> : <Badge severity="error">Invalide</Badge>}</div>
            <div>Version du validateur : <b>{validationReport.validatorVersion}</b></div>
          </div>
          <p>Nombre de lignes dans le fichier BAL : <b>{validationReport.rowsCount}</b></p>
          <Alert
            severity="error"
            title={`Erreur(s) bloquante(s) : ${validationReport.errors.length}`}
            description={(
              <ul>
                {validationReport.errors.map((error, index) => (
                  <li key={index}>{getLabel(error)}</li>
                ))}
              </ul>
            )}
          />
          <Alert
            severity="warning"
            title={`Avertissement(s) : ${validationReport.warnings.length}`}
            description={(
              <ul>
                {validationReport.warnings.map((warning, index) => (
                  <li key={index}>{getLabel(warning)}</li>
                ))}
              </ul>
            )}
          />
          <Alert
            severity="info"
            title={`Information(s) : ${validationReport.infos.length}`}
            description={(
              <ul>
                {validationReport.infos.map((info, index) => (
                  <li key={index}>{getLabel(info)}</li>
                ))}
              </ul>
            )}
          />
        </StyledWrapper>
      )
    : null
}
