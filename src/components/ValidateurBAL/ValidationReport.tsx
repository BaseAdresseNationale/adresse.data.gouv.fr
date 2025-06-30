import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Section from '../Section'
import styled from 'styled-components'
import { profiles, ValidateType, ParseFileType } from '@ban-team/validateur-bal'
import ValidationSummary from './ValidationSummary'
import { useMemo, useRef } from 'react'
import { getNbRowsRemediation } from '@/utils/remediation'
import AlertMiseEnForme from '../MiseEnForme/MiseEnFormeAlert'
import ValidationTableError from './ValidationTableError'
import ValidationStructureFile from './ValidationStructureFile'
import ValidationFields from './ValidationFields'

interface ValidationReportProps {
  file: File
  report: ParseFileType | ValidateType
  profile: string
}

function ValidationReport({ file, report, profile }: ValidationReportProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const { rows, profilesValidation } = report as ValidateType

  const nbRowsRemediation = useMemo(() => getNbRowsRemediation(rows), [rows])
  const codeCommune = useMemo(() => {
    return rows[0].parsedValues.commune_insee || rows[0].additionalValues?.cle_interop?.codeCommune
  }, [rows])

  return (
    <>
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
        <ValidationStructureFile report={report} />
      </Section>

      <Section>
        <h4>Validation générale</h4>
        <ValidationTableError report={report} />
      </Section>

      <Section theme="primary">
        <ValidationFields report={report} />
      </Section>
      {rows && (
        <Section>
          <h4>Validation ligne par ligne</h4>
          <ValidationSummary rows={rows} />
        </Section>
      )}
      <a ref={linkRef} style={{ display: 'none' }} />
    </>
  )
}

export default ValidationReport
