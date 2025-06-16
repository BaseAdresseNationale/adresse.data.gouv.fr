'use client'

import styled from 'styled-components'
import Section from '../Section'
import { useEffect, useState } from 'react'
import { profiles, validate, ValidateType } from '@ban-team/validateur-bal'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import Alert from '@codegouvfr/react-dsfr/Alert'
import ValidationStructureFile from '../ValidateurBAL/ValidationStructureFile'
import ValidationTableError from '../ValidateurBAL/ValidationTableError'
import ValidationFields from '../ValidateurBAL/ValidationFields'
import ValidationSummary from '../ValidateurBAL/ValidationSummary'
import { getCurrentRevisionFile } from '@/lib/api-depot'
import Loader from '../Loader'

interface CommuneValidationSectionProps {
  codeCommune: string
}

const StyledWrapper = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: column;

  > .fr-accordion > h3 {
    button {
      position: relative;
      height: 88px;
      .fr-alert {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
    }
  }
`

const PROFILE = '1.4'

export function CommuneValidationSection({ codeCommune }: CommuneValidationSectionProps) {
  const [report, setReport] = useState<ValidateType | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentRevisionFile = async () => {
      const buffer = await getCurrentRevisionFile(codeCommune)
        .then(res => res.arrayBuffer())

      try {
        const file = new Blob([buffer], { type: 'text/csv' })
        const reportFile = await validate(file as any, { profile: PROFILE })
        if (reportFile.parseOk) {
          setReport(reportFile as ValidateType)
        }
        setIsLoading(false)
      }
      catch (e) {
        console.error(e)
      }
    }

    fetchCurrentRevisionFile()
  }, [codeCommune])

  return (
    <Section title="Validation de la dernière BAL">
      <StyledWrapper>
        {isLoading && <Loader />}
        {report && (
          <Accordion
            id="validation-bal"
            label={report?.profilesValidation?.[PROFILE]?.isValid
              ? (
                  <Alert
                    description={`Le fichier BAL est valide en version ${profiles[PROFILE].name}`}
                    severity="success"
                    title="Fichier valide"
                  />
                )
              : (
                  <Alert
                    description={`Le fichier BAL n'est pas valide en version ${profiles[PROFILE].name}`}
                    severity="error"
                    title="Fichier non valide"
                  />
                )}
          >
            <Section theme="primary">
              <Section>
                <h4>Structure du fichier</h4>
                <ValidationStructureFile report={report} />
              </Section>
              <hr />
              <Section>
                <h4>Validation générale</h4>
                <ValidationTableError report={report} />
              </Section>
              <hr />
              <Section>
                <ValidationFields report={report} />
              </Section>
              <hr />

              <Section>
                <h4>Validation ligne par ligne</h4>
                <ValidationSummary rows={report.rows || []} />
              </Section>
            </Section>
          </Accordion>
        )}
      </StyledWrapper>
    </Section>
  )
}
