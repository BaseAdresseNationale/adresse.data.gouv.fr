import Accordion from '@codegouvfr/react-dsfr/Accordion'
import { getLabel } from '@ban-team/validateur-bal'
import Table from '@codegouvfr/react-dsfr/Table'
import { ValidationRow } from './ValidationSummary'
import styled from 'styled-components'

type ValidationAccordionProps = {
  title: string
  groups: Record<string, ValidationRow[]>
}

const StyledWrapper = styled.div`
  margin-top: 1rem;
  .table-wrapper {
    max-width: calc(100vw - 5.5rem);
  }
`

export default function ValidationAccordion({ title, groups }: ValidationAccordionProps) {
  return (
    <StyledWrapper>
      <h5>{title}</h5>
      {Object.keys(groups).map((code, index) => (
        <Accordion
          key={code}
          label={`${getLabel(code)} - ${groups[code].length} ligne(s)`}
        >
          <div className="table-wrapper">
            <Table
              data={groups[code].map(row => ([row.line, ...Object.values(row.rawValues)]))}
              headers={['Ligne', ...Object.keys(groups[code][index].rawValues)]}
            />
          </div>
        </Accordion>
      ))}
    </StyledWrapper>
  )
}
