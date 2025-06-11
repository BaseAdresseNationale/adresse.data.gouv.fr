import { Alert } from '@codegouvfr/react-dsfr/Alert'
import styled from 'styled-components'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { getLabel, ProfileErrorType, NotFoundFieldLevelType, ErrorLevelEnum, ValidateType, ParseFileType } from '@ban-team/validateur-bal'
import { useCallback, useMemo, useRef } from 'react'
import { getErrorsWithRemediations, getNbRowsRemediation } from '@/utils/remediation'

const StyledWrapper = styled.div`
  max-width: calc(100vw - 7rem);
`

const sortBySeverity = (a: ProfileErrorType | NotFoundFieldLevelType, b: ProfileErrorType | NotFoundFieldLevelType) => {
  const levelOrder: Record<string, number> = { E: 0, W: 1, I: 2 }
  return levelOrder[a.level!] - levelOrder[b.level!]
}

interface ValidationTableErrorProps {
  report: ParseFileType | ValidateType
}

function ValidationTableError({ report }: ValidationTableErrorProps) {
  const { profilErrors, rows } = report as ValidateType

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
      <Table noCaption data={generalValidationRows} headers={['Criticité', 'Label', 'Correction']} />
    </StyledWrapper>
  )
}

export default ValidationTableError
