'use client'

import { getCommunes } from '@/lib/api-geo'
import { BANCommune } from '@/types/api-ban.types'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import styled from 'styled-components'
import AutocompleteInput from '../Autocomplete/AutocompleteInput'

interface CommuneNavigationProps {
  commune: BANCommune
}

const StyledWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    margin-bottom: 2rem;

    > nav {
        margin-bottom: 0;
    }

    .commune-input-wrapper {
        max-width: 400px;
        flex: 1;
        margin-left: 1rem;
    }

    @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        justify-content: center;

        .commune-input-wrapper {
            max-width: 100%;
            margin-top: 1rem;
            margin-left: 0;
        }
  }
`

export function CommuneNavigation({ commune }: CommuneNavigationProps) {
  const router = useRouter()
  const fetchCommunes = useCallback((query: string) => getCommunes({ q: query }), [])

  return (
    <StyledWrapper className="fr-container">
      <Breadcrumb
        segments={[
          {
            label: 'Consulter la page commune',
            linkProps: {
              href: '/commune',
            },
          },
        ]}
        currentPageLabel={commune.nomCommune}
        homeLinkProps={{
          href: '/',
        }}
      />
      <div className="commune-input-wrapper">
        <AutocompleteInput
          value={null}
          fetchResults={fetchCommunes}
          onChange={commune => commune && router.push(`/commune/${commune.code}`)}
          placeholder="Rechercher une commune"
        />
      </div>
    </StyledWrapper>
  )
}
