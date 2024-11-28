'use client'

import styled from 'styled-components'
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

      a {
        display: inline-flex;
        gap: 0.25rem;

        span:first-child {
          min-width: 1.5rem;
          text-align: right;
        }
      }
    }

    td:nth-child(2) {
      text-align: center;
    }
  }
`
