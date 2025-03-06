import Accordion from '@codegouvfr/react-dsfr/Accordion'
import { getLabel, ValidateRowType } from '@ban-team/validateur-bal'
import styled from 'styled-components'
import ValidationCodeTable from './ValidationCodeTable'

type ValidationAccordionProps = {
  title: string
  groups: Record<string, ValidateRowType[]>
}

const StyledWrapper = styled.div`
  margin-top: 1rem;
`

export default function ValidationAccordion({ title, groups }: ValidationAccordionProps) {
  return (
    <StyledWrapper>
      <h5>{title}</h5>
      {Object.keys(groups).map(code => (
        <Accordion
          key={code}
          label={`${getLabel(code)} - ${groups[code].length} ligne(s)`}
        >
          <ValidationCodeTable code={code} groupCode={groups[code]} />
        </Accordion>
      ))}
    </StyledWrapper>
  )
}
