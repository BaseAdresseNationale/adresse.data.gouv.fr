'use client'

import styled from 'styled-components'

export const AddressDetailsWrapper = styled.ul`
  padding: 0;
  margin: 2rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
`

const AddressDetailsItemStyle = styled.li`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.2em;

  b {
    font-weight: normal;
    font-size: 1.1em;
  }

  &::before {
    margin-right: 0.5em;
    width: 1.25em;
    height: 1.25em;
    vertical-align: -0.25rem;
  }
`

interface AddressDetailsItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
}

export const AddressDetailsItem = ({ children, ...props }: AddressDetailsItemProps) => (
  <AddressDetailsItemStyle {...props}>
    <div>
      {children}
    </div>
  </AddressDetailsItemStyle>
)

export const AddressDetailsItemValue = styled.pre`
  font-size: small;
  font-weight: 700;
  margin-bottom: 0.5rem;
  white-space: pre-line;
`
