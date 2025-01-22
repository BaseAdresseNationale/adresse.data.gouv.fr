import Accordion from '@codegouvfr/react-dsfr/Accordion'
import { getLabel } from '@ban-team/validateur-bal'
import Table from '@codegouvfr/react-dsfr/Table'
import { ValidationRow } from './ValidationSummary'
import styled from 'styled-components'
import { useCallback, useMemo, useState } from 'react'
import Pagination from '@codegouvfr/react-dsfr/Pagination'
import SoftPagination from '../Pagination/soft-pagination'

type ValidationCodeTableProps = {
  code: string
  groupCode: ValidationRow[]
}

const StyledWrapper = styled.div`
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

const limit = 10

export default function ValidationCodeTable({ code, groupCode }: ValidationCodeTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const data = useMemo(() => {
    const fieldError = code.split('.')?.[0]
    const start = (currentPage - 1) * limit

    return groupCode.slice(start, start + limit).map(row => ([row.line,
      ...Object.keys(row.rawValues).map((key, index) => (
        key === fieldError ? <p key={index} className="error">{row.rawValues[key]}</p> : row.rawValues[key]
      )),
    ]))
  }, [code, groupCode, currentPage])

  return (
    <StyledWrapper>
      <div className="table-wrapper">
        <Table
          data={data}
          headers={['Ligne', ...Object.keys(groupCode[0].rawValues)]}
        />
        <SoftPagination
          currentPage={currentPage}
          totalCount={groupCode.length}
          onPageChange={(page) => { setCurrentPage(page) }}
          limit={limit}
        />
      </div>
    </StyledWrapper>
  )
}
