import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Section from '../Section'
import { profiles, ValidateType, ParseFileType } from '@ban-team/validateur-bal'
import ValidationSummary from './ValidationSummary'
import { useMemo, useRef } from 'react'
import { getNbRowsRemediation } from '@/utils/remediation'
import AlertMiseEnForme from '../MiseEnForme/MiseEnFormeAlert'
import ValidationTableError from './ValidationTableError'
import ValidationStructureFile from './ValidationStructureFile'
import ValidationFields from './ValidationFields'

interface ValidationErrorParseReportProps {
  report: ParseFileType
}

function ValidationErrorParseReport({ report }: ValidationErrorParseReportProps) {

  return (
    <Section>
      <Alert
        description={<>
          {report.parseErrors.map(({message, row}) => (<p>{message}{row ? ` at the line ${row}` : ''}</p>))}
        </>}
        severity="error"
        title="Le fichier n'est pas un CSV valide"
      />
    </Section>
  )
}

export default ValidationErrorParseReport
