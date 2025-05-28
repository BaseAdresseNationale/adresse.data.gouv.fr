import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Section from '../Section'
import styled from 'styled-components'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'
import { getLabel, profiles, ProfileErrorType, NotFoundFieldLevelType, ErrorLevelEnum, ValidateType, ParseFileType, autofix } from '@ban-team/validateur-bal'
import ValidationSummary from './ValidationSummary'
import { useCallback, useMemo, useRef } from 'react'
import { getErrorsWithRemediations, getNbRowsRemediation } from '@/utils/remediation'
import Button from '@codegouvfr/react-dsfr/Button'
import Notice from '@codegouvfr/react-dsfr/Notice'
import AlertMiseEnForme from '../MiseEnForme/MiseEnFormeAlert'
import ValidationTableError from './ValidationTableError'

const StyledWrapper = styled.div`
.file-structure-wrapper {
  display: flex;
  justify-content: space-around;

  .item {
    text-align: center;

    .fr-badge {
      margin-top: 0.5rem;
    }
  }
}

.table-wrapper {
    max-width: calc(100vw - 7rem);
}

.present-fields-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
`

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
  report: ParseFileType | ValidateType
  profile: string
}

function ValidationReport({ file, report, profile }: ValidationReportProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const { fileValidation, notFoundFields, fields, rows, profilesValidation } = report as ValidateType

  const nbRowsRemediation = useMemo(() => getNbRowsRemediation(rows), [rows])
  const codeCommune = useMemo(() => {
    return rows[0].parsedValues.commune_insee || rows[0].additionalValues?.cle_interop?.codeCommune
  }, [rows])

  return (
    <StyledWrapper>
      <Section>
        {profilesValidation?.[profile].isValid
          ? (
              <Alert
                description={`Le fichier BAL est valide (en version ${profiles[profile].name})`}
                severity="success"
                title="Fichier valide"
              />
            )
          : (
              <Alert
                description={`Le fichier BAL n'est pas valide (en version ${profiles[profile].name})`}
                severity="error"
                title="Fichier non valide"
              />
            )}
        {nbRowsRemediation > 0 && (
          <AlertMiseEnForme file={file} nbRowsRemediation={nbRowsRemediation} codeCommune={codeCommune} />
        )}
      </Section>
      <Section theme="primary">
        <h4>Structure du fichier</h4>
        <div className="file-structure-wrapper">
          <div className="item">
            <div><b>Encodage des caractères</b></div>
            <Badge severity={fileValidation?.encoding.isValid ? 'success' : 'error'}>
              {fileValidation?.encoding.value || ''}
            </Badge>
          </div>

          <div className="item">
            <div><b>Délimiteur</b></div>
            <Badge severity={fileValidation?.delimiter.isValid ? 'success' : 'error'}>
              {fileValidation?.delimiter.value || ''}
            </Badge>
          </div>

          <div className="item">
            <div><b>Nombre de lignes</b></div>
            <Badge severity="success">
              {rows?.length || 0}
            </Badge>
          </div>

          <div className="item">
            <div><b>Séparateur de ligne</b></div>
            <Badge severity={fileValidation?.linebreak.isValid ? 'success' : 'error'}>
              {fileValidation?.linebreak.value || ''}
            </Badge>
          </div>
        </div>
      </Section>

      <Section>
        <h4>Validation générale</h4>
        <ValidationTableError report={report} />
      </Section>

      <Section theme="primary">
        {fields && fields.length > 0 && (
          <>
            <h4>Champs présents</h4>
            <div className="present-fields-wrapper">
              {fields.map((field: { name: string }) => <Badge severity="success" style={{ textTransform: 'none' }} key={field.name}>{field.name}</Badge>)}
            </div>
          </>
        )}
        {notFoundFields && notFoundFields.length > 0 && (
          <>
            <br />
            <h4>Champs non trouvés</h4>
            <div className="present-fields-wrapper">
              {notFoundFields.filter(({ level }) => level === ErrorLevelEnum.ERROR).map(({ schemaName }: NotFoundFieldLevelType) =>
                <Badge key={schemaName} style={{ textTransform: 'none' }} severity="error">{schemaName}</Badge>
              )}
              {notFoundFields.filter(({ level }) => level === ErrorLevelEnum.WARNING).map(({ schemaName }: NotFoundFieldLevelType) =>
                <Badge key={schemaName} style={{ textTransform: 'none' }} severity="warning">{schemaName}</Badge>
              )}
              {notFoundFields.filter(({ level }) => level === ErrorLevelEnum.INFO).map(({ schemaName }: NotFoundFieldLevelType) =>
                <Badge key={schemaName} style={{ textTransform: 'none' }} severity="info">{schemaName}</Badge>
              )}
            </div>
          </>
        )}
      </Section>
      {rows && <ValidationSummary rows={rows} /> }
      <a ref={linkRef} style={{ display: 'none' }} />
    </StyledWrapper>
  )
}

export default ValidationReport
