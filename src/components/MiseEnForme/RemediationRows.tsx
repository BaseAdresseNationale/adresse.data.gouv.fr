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
      .new {
        color: var(--text-default-success);
        font-weight: bold;
      }
    }
  }
`

const limit = 10

export default function RemediationTable({ rows }: RemediationTableProps) {
  const rowsWithRemediation = rows.filter(row => Object.keys(row.remediations).length > 0)
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
  }, []) as Array<keyof ParsedValues>

  const getValueBanIds = useCallback(({ additionalValues }: ValidateRowFullType, key: keyof ParsedValues) => {
    if (key === 'id_ban_commune') {
      return additionalValues.uid_adresse.idBanCommune
    }
    else if (key === 'id_ban_toponyme') {
      return additionalValues.uid_adresse.idBanToponyme
    }
    else if (key === 'id_ban_adresse') {
      return additionalValues.uid_adresse.idBanAdresse
    }
  }, [])

  const getLine = useCallback((row: ValidateRowFullType, index: number) => {
    return headers.map(key => row.remediations[key]
      ? <p key={index} className="new">{String(row.remediations[key])}</p>
      : row.rawValues[key] || getValueBanIds(row, key)
    )
  }, [headers, getValueBanIds])

  const data = useMemo(() => {
    const start = (currentPage - 1) * limit

    return rowsWithRemediation.slice(start, start + limit).map((row, index) => ([
      row.line + 1,
      ...getLine(row, index),
    ]))
  }, [rowsWithRemediation, currentPage, getLine])

  return (
    <StyledWrapper>
      <div className="table-wrapper">
        <Table
          data={data}
          headers={['lignes', ...headers]}
        />
        <SoftPagination
          currentPage={currentPage}
          totalCount={rowsWithRemediation.length}
          onPageChange={(page) => { setCurrentPage(page) }}
          limit={limit}
        />
      </div>
    </StyledWrapper>
  )
}
