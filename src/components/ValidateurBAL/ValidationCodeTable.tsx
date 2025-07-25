import Table from '@codegouvfr/react-dsfr/Table'
import { ValidateRowFullType } from '@ban-team/validateur-bal'
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import Pagination from '@codegouvfr/react-dsfr/Pagination'

type ValidationCodeTableProps = {
  code: string
  groupCode: ValidateRowFullType[]
}

const StyledWrapper = styled.div`
  max-width: calc(100vw - 5.5rem);
  overflow: scroll;

  td {
    .error {
      color: var(--text-default-error);
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
      <Table
        data={data}
        headers={['Ligne', ...Object.keys(groupCode[0].rawValues)]}
      />
      <Pagination
        style={{ marginTop: '1rem' }}
        count={Math.ceil(groupCode.length / limit)}
        defaultPage={currentPage}
        getPageLinkProps={pageNumber => ({ href: `#`, onClick: () => setCurrentPage(pageNumber) })}
      />
    </StyledWrapper>
  )
}
