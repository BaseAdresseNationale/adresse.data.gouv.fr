'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { Table } from '@codegouvfr/react-dsfr/Table'

export const MicroToponymAddressListInfo = styled.div.attrs({ className: 'ri-information-line' })`
  display: block;
  margin: 1.5rem 0;
  font-size: 0.9em;
  font-style: italic;
  line-height: 1.5rem;
  color: var(--text-mention-grey);

  &::before {
    width: 1.25em;
    height: 1.25em;
    margin-right: 0.25em;
    vertical-align: -0.25rem;
  }
`

export const MicroToponymAddressLink = styled(Link)`
        display: inline-flex;
        gap: 0.25rem;

        span:first-child {
          min-width: 1.5rem;
          text-align: right;
        }
`

export const MicroToponymAddressListTable = styled(Table)`
  margin-top: 1.5rem;

  & > table thead {
    th:nth-child(1) {
      text-align: left;
    }

    th:nth-child(2) {
      width: 5rem;
      text-align: center;
    }
  }

  & > table tbody {
    td:nth-child(1) {
      text-align: left;
    }

    td:nth-child(2) {
      text-align: center;
    }
  }
`

export const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  margin: 1.5rem 0;
`

export const ClearInputButton = styled.button`
  position: absolute;
  right: 2rem;
  height: calc(100% - 2px);
  padding-top: 2px;
  width: 2rem;
`
