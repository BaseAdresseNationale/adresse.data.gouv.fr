import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Section from '../Section'
import styled from 'styled-components'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { getLabel, profiles, ProfileErrorType, NotFoundFieldLevelType, ErrorLevelEnum, ValidateType, ParseFileType } from '@ban-team/validateur-bal'
import ValidationSummary from './ValidationSummary'
import { useCallback, useMemo } from 'react'
import { getErrorsWithRemediations, getNbRowsRemediation } from '@/utils/remediation'
import Button from '@codegouvfr/react-dsfr/Button'

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
  margin-bottom: 22px;
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

  const nbRowsRemediation = useMemo(() => getNbRowsRemediation(rows), [rows])
  const errorsWithRemediations = useMemo(() => getErrorsWithRemediations(rows), [rows])

  const getBadgeLevel = (level: ErrorLevelEnum) => {
    return level === ErrorLevelEnum.ERROR
      ? <Badge severity="error">Erreur</Badge>
      : level === ErrorLevelEnum.INFO
        ? <Badge severity="info">Info</Badge>
        : <Badge severity="warning">Avertissement</Badge>
  }

  const getHasRemediation = useCallback((code: string) => {
    const nbRows = errorsWithRemediations[code]

    return nbRows && <Badge>{`${nbRows} ligne${nbRows > 1 ? 's' : ''} corrigée${nbRows > 1 ? 's' : ''}`}</Badge>
  }, [errorsWithRemediations])

  const generalValidationRows = useMemo(() => {
    return profilErrors
      .sort(sortBySeverity)
      .map(({ code, level }: ProfileErrorType) =>
        ([
          getBadgeLevel(level),
          getLabel(code),
          getHasRemediation(code)]))
  }, [profilErrors, getHasRemediation])

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
                <Table noCaption data={generalValidationRows} headers={['Criticité', 'Label', 'Correction']} />
              </div>
            )}
        {nbRowsRemediation > 0 && (
          <Alert
            description={(
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <p>{nbRowsRemediation} ligne{nbRowsRemediation > 1 && 's'} {nbRowsRemediation > 1 ? 'ont' : 'a'} été modifiée{nbRowsRemediation > 1 && 's'}, vous pouvez télécharger le fichier BAL améliorer.
                  <br />Les erreurs, avertissements et informations indiqués ci-dessus ont été corrigés
                </p>
                <Button
                  iconId="fr-icon-download-line"
                  // onClick={handleClick}
                  title="Télécharger"
                >Télécharger
                </Button>
              </div>
            )}
            severity="info"
            title={(
              <>
                Mise en forme BAL{' '}
                <Badge noIcon severity="info">BETA</Badge>
              </>
            )}
          />
        )}
      </Section>

      <Section theme="primary">
        {fields && fields.length > 0 && (
          <>
            <h4>Champs présents</h4>
            <div className="present-fields-wrapper">
              {fields.map((field: { name: string }) => <Badge severity="success" key={field.name}>{field.name}</Badge>)}
            </div>
          </>
        )}
        {notFoundFields && notFoundFields.length > 0 && (
          <>
            <h4>Champs non trouvés</h4>
            <div className="present-fields-wrapper">
              {notFoundFields.filter(({ level }) => level === ErrorLevelEnum.ERROR).map(({ schemaName, level }: NotFoundFieldLevelType) =>
                <Badge key={schemaName} severity="error">{schemaName}</Badge>
              )}
            </div>
            <div className="present-fields-wrapper">
              {notFoundFields.filter(({ level }) => level === ErrorLevelEnum.WARNING).map(({ schemaName, level }: NotFoundFieldLevelType) =>
                <Badge key={schemaName} severity="warning">{schemaName}</Badge>
              )}
            </div>
            <div className="present-fields-wrapper">
              {notFoundFields.filter(({ level }) => level === ErrorLevelEnum.INFO).map(({ schemaName, level }: NotFoundFieldLevelType) =>
                <Badge key={schemaName} severity="info">{schemaName}</Badge>
              )}
            </div>
          </>
        )}
      </Section>
      {rows && <ValidationSummary rows={rows} /> }
    </StyledWrapper>
  )
}

export default ValidationReport
