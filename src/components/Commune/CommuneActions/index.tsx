'use client'

import { Button } from '@codegouvfr/react-dsfr/Button'

import {
  CommuneActionsActionsWrapper,
} from './CommuneActions.styles'
import Section from '@/components/Section'
interface CommuneActionProps {
  iconId: any
  linkProps: {
    href: string
    target?: string
  }
  priority: any
  value: string
}
interface CommuneActionsProps {
  actionProps: CommuneActionProps[]
}

function CommuneActions({ actionProps }: CommuneActionsProps) {
  return (
    <>
      <Section>
        <CommuneActionsActionsWrapper>
          {actionProps && actionProps.length && actionProps.map(props => (
            <Button
              key={props.value}
              iconId={props.iconId}
              linkProps={{
                href: props.linkProps.href,
                target: props.linkProps.target,
              }}
              priority={props.priority}
            >
              {props.value}
            </Button>
          ))}
        </CommuneActionsActionsWrapper>
      </Section>
    </>
  )
}

export default CommuneActions
