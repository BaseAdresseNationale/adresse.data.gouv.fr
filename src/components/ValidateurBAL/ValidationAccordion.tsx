import Accordion from '@codegouvfr/react-dsfr/Accordion'
import { getLabel } from '@ban-team/validateur-bal'
import Table from '@codegouvfr/react-dsfr/Table'
import { ValidationRow } from './ValidationSummary'
import styled from 'styled-components'
import { useCallback, useMemo } from 'react'

type ValidationAccordionProps = {
  title: string
  groups: Record<string, ValidationRow[]>
}

const StyledWrapper = styled.div`
  margin-top: 1rem;
  .table-wrapper {
    max-width: calc(100vw - 5.5rem);
    overflow: scroll;

    td {
      .error {
        color: var(--text-default-error);
      }
    }
  }
`

export default function ValidationAccordion({ title, groups }: ValidationAccordionProps) {
  const data = useCallback((code: string) => {
    const fieldError = code.split('.')?.[0]
    return groups[code].map(row => ([row.line,
      ...Object.keys(row.rawValues).map((key, index) => (
        key === fieldError ? <p key={index} className="error">{row.rawValues[key]}</p> : row.rawValues[key]
      )),
    ]))
  }, [groups])

  return (
    <StyledWrapper>
      <h5>{title}</h5>
      {Object.keys(groups).map(code => (
        <Accordion
          key={code}
          label={`${getLabel(code)} - ${groups[code].length} ligne(s)`}
        >
          <div className="table-wrapper">
            <Table
              data={data(code)}
              headers={['Ligne', ...Object.keys(groups[code][0].rawValues)]}
            />
          </div>
        </Accordion>
      ))}
    </StyledWrapper>
  )
}
