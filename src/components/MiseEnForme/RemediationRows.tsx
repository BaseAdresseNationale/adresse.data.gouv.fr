import Table from '@codegouvfr/react-dsfr/Table'
import { ParsedValues, ValidateRowFullType } from '@ban-team/validateur-bal'
import styled from 'styled-components'
import { useCallback, useMemo, useState } from 'react'
import SoftPagination from '../Pagination/soft-pagination'

type RemediationTableProps = {
  rows: ValidateRowFullType[]
}

const StyledWrapper = styled.div`
  .table-wrapper {
    overflow: scroll;

    td {
      .info {
        color: var(--text-default-info);
      }
    }
  }
`

const limit = 10

export default function RemediationTable({ rows }: RemediationTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const headers = useMemo(() => {
    return [
      'id_ban_commune',
      'id_ban_toponyme',
      'id_ban_adresse',
      'cle_interop',
      'commune_insee',
      'commune_nom',
      'commune_deleguee_insee',
      'commune_deleguee_nom',
      'voie_nom',
      'lieudit_complement_nom',
      'numero',
      'suffixe',
      'position',
      'x',
      'y',
      'long',
      'lat',
      'cad_parcelles',
      'source',
      'date_der_maj',
      'certification_commune',
    ]
  }, [])

  const getLine = useCallback((row: ValidateRowFullType, index: number) => {
    return headers.map(key => row.remediations[key as keyof ParsedValues]
      ? <p key={index} className="info">{String(row.remediations[key as keyof ParsedValues])}</p>
      : row.rawValues[key]
    )
  }, [headers])

  const data = useMemo(() => {
    const start = (currentPage - 1) * limit

    return rows.slice(start, start + limit).map((row, index) => ([
      row.line,
      ...getLine(row, index),
    ]))
  }, [rows, currentPage, getLine])

  return (
    <StyledWrapper>
      <div className="table-wrapper">
        <Table
          data={data}
          headers={['lignes', ...headers]}
        />
        <SoftPagination
          currentPage={currentPage}
          totalCount={rows.length}
          onPageChange={(page) => { setCurrentPage(page) }}
          limit={limit}
        />
      </div>
    </StyledWrapper>
  )
}
