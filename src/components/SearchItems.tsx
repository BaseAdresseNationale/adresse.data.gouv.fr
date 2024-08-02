'use client'

import { Pagination } from '@codegouvfr/react-dsfr/Pagination'
import styled from 'styled-components'
import TagSelect from './TagSelect'
import { useEffect, useState } from 'react'
import { PartenaireDeLaCharteOrganismeTypeEnum, PartenaireDeLaCharteTypeEnum, PartenaireDeLaChartType } from '@/types/partenaire.types'
import { getPartenairesDeLaCharte } from '@/lib/api-bal-admin'
import { Card } from '@codegouvfr/react-dsfr/Card'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import ResponsiveImage from './ResponsiveImage'
import { Departement } from '@/types/api-geo.types'
import CommuneInput from './CommuneInput'
import { Commune } from '@/types/api-geo.types'

export interface SearchItemsProps {
  services: string[]
  initialPartenaires: PartenaireDeLaChartType[]
  departements: Departement[]
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .controls {
    .commune-input-wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      > div {
        width: 50%;
      }

      p {
        margin: 0 0 0 1rem;
      }
    }
  }

  .content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;

    .fr-card__img {
      object-fit: contain !important;
    }
  }
`

export default function SearchItems({
  services,
  initialPartenaires,
  departements,
}: SearchItemsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [partenaires, setPartenaires] = useState<PartenaireDeLaChartType[]>(initialPartenaires)

  useEffect(() => {
    const updatePartenaires = async () => {
      const updatedPartenaires = await getPartenairesDeLaCharte({
        services: selectedServices,
        codeDepartement: selectedCommune?.codeDepartement ? [selectedCommune.codeDepartement] : [],
      })

      setPartenaires(updatedPartenaires)
    }

    updatePartenaires()
  }, [selectedServices, selectedCommune])

  const getDepartementNom = (code: string) => {
    const departement = departements.find(departement => departement.code === code)
    return departement?.nom || ''
  }

  return (
    <StyledWrapper>
      <div className="controls">
        <div className="commune-input-wrapper">
          <CommuneInput value={selectedCommune} onChange={commune => setSelectedCommune(commune)} />
          <p>{partenaires.length} partenaires : {partenaires.filter(({ type }) => type === PartenaireDeLaCharteTypeEnum.COMMUNE).length} communes, {partenaires.filter(({ type }) => type === PartenaireDeLaCharteTypeEnum.ORGANISME).length} organismes, {partenaires.filter(({ type }) => type === PartenaireDeLaCharteTypeEnum.ENTREPRISE).length} entreprises</p>
        </div>
        <TagSelect options={services} value={selectedServices} onChange={selectedServices => setSelectedServices(selectedServices)} />
      </div>
      <div className="content">
        {partenaires.map(partenaire => (
          <Card
            key={partenaire._id}
            style={{ width: 280 }}
            title={partenaire.name}
            imageComponent={<ResponsiveImage src={partenaire.picture} alt={`Logo de ${partenaire.name}`} style={{ objectFit: 'contain' }} />}
            start={<ul className="fr-badges-group">{partenaire.services.map(service => <Badge key={service} small noIcon severity="info">{service}</Badge>)}</ul>}
            detail={partenaire.codeDepartement.reduce((acc, code) => `${acc} ${getDepartementNom(code)}`, '')}
            {...(partenaire.link ? { footer: <a href={partenaire.link} target="_blank" className="fr-btn fr-btn--secondary">Site du partenaire</a> } : {})}
          />
        ))}
      </div>
      <Pagination
        count={100}
        defaultPage={1}
        getPageLinkProps={pageNumber => ({ href: `#page=${pageNumber}` })}
      />
    </StyledWrapper>
  )
}
