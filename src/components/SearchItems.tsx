'use client'

import { Pagination } from '@codegouvfr/react-dsfr/Pagination'
import styled from 'styled-components'
import TagSelect from './TagSelect'
import { useState } from 'react'

export interface SearchItemsProps {
  services: string[]
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default function SearchItems({
  services,
}: SearchItemsProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  return (
    <StyledWrapper>
      <div className="controls">
        <div className="fr-input-group">
          <label className="fr-label" htmlFor="commune">
            Votre commune
          </label>
          <input
            name="commune"
            className="fr-input"
          />
        </div>
        <TagSelect options={services} value={selectedServices} onChange={selectedServices => setSelectedServices(selectedServices)} />

      </div>
      <div className="content">

      </div>
      <Pagination
        count={100}
        defaultPage={1}
        getPageLinkProps={pageNumber => ({ href: `/search?page=${pageNumber}` })}
        showFirstLast
      />
    </StyledWrapper>
  )
}
