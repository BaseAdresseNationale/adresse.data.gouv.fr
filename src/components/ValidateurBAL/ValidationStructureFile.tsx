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
  display: flex;
  justify-content: space-around;

  .item {
    text-align: center;

    .fr-badge {
      margin-top: 0.5rem;
    }
  }
`

interface ValidationStructureFileProps {
  report: ParseFileType | ValidateType
}

function ValidationStructureFile({ report }: ValidationStructureFileProps) {
  const { fileValidation, rows } = report as ValidateType

  return (
    <StyledWrapper>
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
    </StyledWrapper>
  )
}

export default ValidationStructureFile
