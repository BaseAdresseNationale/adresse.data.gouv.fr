'use client'

import Button from '@codegouvfr/react-dsfr/Button'
import styled from 'styled-components'

const ActionButtonWrapper = styled.div<{ $isFullSize: boolean }>`

        .button {
          width: ${({ $isFullSize }) => $isFullSize ? '100%' : 'fit-content'};
          height: fit-content;
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
        }

        button:disabled {
          opacity: 55%;
          cursor: not-allowed;
        }
      `
interface ActionButtonNeutralPropTypes {
  children: React.ReactNode
  label: string
  isFullSize: boolean
  [key: string]: any
}

export default function ActionButtonNeutral({ children, label, isFullSize = false, ...props }: ActionButtonNeutralPropTypes) {
  return (
    <ActionButtonWrapper $isFullSize={isFullSize}>
      <Button aria-label={label} {...props}>
        {children}
      </Button>
    </ActionButtonWrapper>
  )
}
