import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Section from '../Section'
import styled from 'styled-components'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { getLabel, profiles, ProfileErrorType, NotFoundFieldLevelType, ErrorLevelEnum, ValidateType, ParseFileType } from '@ban-team/validateur-bal'
import ValidationSummary from './ValidationSummary'

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

const sortBySeverity = (a: ProfileErrorType | NotFoundFieldLevelType, b: ProfileErrorType | NotFoundFieldLevelType) => {
  const levelOrder: Record<string, number> = { E: 0, W: 1, I: 2 }
  return levelOrder[a.level!] - levelOrder[b.level!]
}

interface ValidationReportProps {
  report: ParseFileType | ValidateType
  profile: string
}

function ValidationReport({ report, profile }: ValidationReportProps) {
  const { profilErrors, fileValidation, notFoundFields, fields, rows, profilesValidation } = report as ValidateType
  const generalValidationRows = profilErrors
    .sort(sortBySeverity)
    .map(({ code, level }: ProfileErrorType) => ([level === ErrorLevelEnum.ERROR ? <Badge severity="error">Erreur</Badge> : level === ErrorLevelEnum.INFO ? <Badge severity="info">Info</Badge> : <Badge severity="warning">Avertissement</Badge>, getLabel(code)]))

  const notFoundFieldsRows = notFoundFields!.sort(sortBySeverity)
    .map(({ schemaName, level }: NotFoundFieldLevelType) => ([level === ErrorLevelEnum.ERROR ? <Badge severity="error">Erreur</Badge> : level === ErrorLevelEnum.INFO ? <Badge severity="info">Info</Badge> : <Badge severity="warning">Avertissement</Badge>, schemaName]))

  return (
    <StyledWrapper>
      <Section>
        {profilesValidation?.[profile].isValid
          ? (
              <Alert
                description={`Le fichier Bal est valide (en version ${profiles[profile].name})`}
                severity="success"
                title="Fichier valide"
              />
            )
          : (
              <Alert
                description={`Le fichier Bal n'est pas valide (en version ${profiles[profile].name})`}
                severity="error"
                title="Fichier non valide"
              />
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
        {profilErrors.length === 0
          ? (
              <p>Aucun problème détécté</p>
            )
          : (
              <div className="table-wrapper">
                <Table noCaption data={generalValidationRows} headers={['Criticité', 'Label']} />
              </div>
            )}
      </Section>

      <Section theme="primary">
        {notFoundFields && notFoundFields.length > 0 && (
          <>
            <h4>Champs non trouvés</h4>
            <div className="table-wrapper">
              <Table noCaption data={notFoundFieldsRows} headers={['Criticité', 'Nom du champ', 'Version de la spécification']} />
            </div>
          </>
        )}

        {fields && fields.length > 0 && (
          <>
            <h4>Champs présents</h4>
            <div className="present-fields-wrapper">
              {fields.map((field: { name: string }) => <Badge style={{ textTransform: 'none' }} key={field.name}>{field.name}</Badge>)}
            </div>
          </>
        )}
      </Section>
      {rows && <ValidationSummary rows={rows} /> }
    </StyledWrapper>
  )
}

export default ValidationReport
