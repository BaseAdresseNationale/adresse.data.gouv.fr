`use client`

import React from 'react'
import styled from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'

const StyledButton = styled(Button)<React.ButtonHTMLAttributes<HTMLButtonElement>>`
  display: block;
  width: 100%;
  height: fit-content;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;

  &:not(.disabled):hover:not(.foo) {
    background-color: var(--background-contrast-grey-hover);
  }

  &:disabled {
    opacity: 50%;
    cursor: not-allowed;
  }
`

interface ActionButtonLineProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  label: string
}

function ActionButtonLine({ children, label, ...props }: ActionButtonLineProps) {
  return (
    <StyledButton
      aria-label={label}
      {...props}
    >
      {children}
    </StyledButton>
  )
}

export default ActionButtonLine
