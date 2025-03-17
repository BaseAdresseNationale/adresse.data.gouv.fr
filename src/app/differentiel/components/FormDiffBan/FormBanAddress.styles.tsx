'use client'

import styled from 'styled-components'

import { Input } from '@codegouvfr/react-dsfr/Input'

export const AddressNumberWrapper = styled.div`
  display: flex;
  gap: .5rem;

  & > .fr-input-group {
    flex: 1;

    &:first-child {
      max-width: 5.5rem;
    }
  }
`

export const InputCP = styled(Input)`
    display: flex;
    flex-flow: row wrap;
    white-space: nowrap;
    align-items: baseline;
    gap: .5rem;

    & > .fr-input {
      flex: 1;
    }

    & > .fr-messages-group {
      flex-basis: 100%;
    }
`
