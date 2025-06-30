import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Section from '../Section'
import styled from 'styled-components'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'
import { getLabel, profiles, ProfileErrorType, NotFoundFieldLevelType, ErrorLevelEnum, ValidateType, ParseFileType, autofix } from '@ban-team/validateur-bal'
import ValidationSummary from './ValidationSummary'
import { useMemo, useRef } from 'react'
import { getNbRowsRemediation } from '@/utils/remediation'
import Button from '@codegouvfr/react-dsfr/Button'
import Notice from '@codegouvfr/react-dsfr/Notice'
import AlertMiseEnForme from '../MiseEnForme/MiseEnFormeAlert'
import ValidationTableError from './ValidationTableError'
import ValidationStructureFile from './ValidationStructureFile'

const StyledWrapper = styled.div`
.present-fields-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
`

interface ValidationFieldsProps {
  report: ParseFileType | ValidateType
}

function ValidationFields({ report }: ValidationFieldsProps) {
  const { notFoundFields, fields } = report as ValidateType

  return (
    <StyledWrapper>
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
    </StyledWrapper>
  )
}

export default ValidationFields
