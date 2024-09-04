'use client'

import CommuneInput from "@/components/CommuneInput"
import { BANCommune } from "@/types/api-ban.types"
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb"
import { useRouter } from "next/navigation"
import styled from "styled-components"

interface CommuneNavigationProps {
    commune: BANCommune
}

const StyledWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;

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

    return (
        <StyledWrapper className="fr-container">
        <Breadcrumb segments={[
            {
                label: 'Votre commune et sa base adresse locale',
                linkProps: {
                    href: '/communes/votre-commune-et-sa-base-adresse-locale'
                }
            }
        ]}
        currentPageLabel={commune.nomCommune}
              homeLinkProps={{
                href: '/',
              }} />
        <div className="commune-input-wrapper">
            <CommuneInput
                label="Rechercher une commune"
                placeholder="Nom ou code INSEE, exemple : 64256 ou Hasparren"
                onChange={commune => commune && router.push(`/communes/votre-commune-et-sa-base-adresse-locale/${commune.code}`)}
            />
        </div>
    </StyledWrapper>
    )

}