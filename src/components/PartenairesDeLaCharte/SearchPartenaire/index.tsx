'use client'

import { Pagination } from '@codegouvfr/react-dsfr/Pagination'
import TagSelect from '../../TagSelect'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PartenaireDeLaCharteTypeEnum } from '@/types/partenaire.types'
import { DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT, getPartenairesDeLaCharte, PaginatedPartenairesDeLaCharte } from '@/lib/api-bal-admin'
import { Card } from '@codegouvfr/react-dsfr/Card'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import ResponsiveImage from '../../ResponsiveImage'
import { Departement } from '@/types/api-geo.types'
import CommuneInput from '../../CommuneInput'
import { Commune } from '@/types/api-geo.types'
import { getPageFromHash, resetHash, useHash } from '@/hooks/useHash'
import { useDebounce } from '@/hooks/useDebounce'
import { StyledWrapper } from './SearchPartenaire.styles'
import CardWrapper from '@/components/CardWrapper'

export interface SearchPartenaireProps {
  services: string[]
  initialPartenaires: PaginatedPartenairesDeLaCharte
  departements: Departement[]
  filter?: { type: PartenaireDeLaCharteTypeEnum }
  searchBy: 'perimeter' | 'name'
  renderInfos?: (partenaire: PaginatedPartenairesDeLaCharte) => Promise<React.ReactNode>
}

export default function SearchPartenaire({
  services,
  initialPartenaires,
  departements,
  filter,
  searchBy,
  renderInfos,
}: SearchPartenaireProps) {
  const hash = useHash()
  const [search, onSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [info, setInfo] = useState<React.ReactNode>(null)
  const [currentPage, setCurrentPage] = useState(getPageFromHash(hash))
  const [selectedCommune, setSelectedCommune] = useState<Commune>()
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [partenaires, setPartenaires] = useState<PaginatedPartenairesDeLaCharte>(initialPartenaires)

  const updatePartenaires = useCallback(async (page: number) => {
    const updatedPartenaires = await getPartenairesDeLaCharte({
      ...filter,
      services: selectedServices,
      codeDepartement: selectedCommune?.codeDepartement ? [selectedCommune.codeDepartement] : [],
      search: debouncedSearch,
    }, page)

    setPartenaires(updatedPartenaires)
  }, [selectedServices, selectedCommune, debouncedSearch, filter])

  useEffect(() => {
    if (hash) {
      const nextPage = getPageFromHash(hash)
      updatePartenaires(nextPage)
      setCurrentPage(nextPage)
    }
    else {
      setCurrentPage(1)
    }
  }, [hash, updatePartenaires])

  useEffect(() => {
    resetHash()
    updatePartenaires(1)
  }, [selectedServices, selectedCommune, debouncedSearch, updatePartenaires])

  useEffect(() => {
    if (renderInfos) {
      renderInfos(partenaires).then(setInfo)
    }
  }, [partenaires, renderInfos])

  const count = useMemo(() => Math.ceil(partenaires.total / DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT), [partenaires.total])

  const getDepartementNom = (code: string) => {
    const departement = departements.find(departement => departement.code === code)
    return departement?.nom || ''
  }

  return (
    <StyledWrapper>
      <div className="controls">
        <div className="controls-input-wrapper">
          {searchBy === 'perimeter' && (<CommuneInput placeholder="Rechercher ma commune" value={selectedCommune} onChange={commune => setSelectedCommune(commune)} />)}
          {searchBy === 'name' && (
            <input
              className="fr-input"
              placeholder="Rechercher un partenaire"
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
          )}
          {info}
        </div>
        <TagSelect options={services} value={selectedServices} onChange={selectedServices => setSelectedServices(selectedServices)} />
      </div>
      <CardWrapper isSmallCard>
        {partenaires.data.length === 0 && <p>Aucun partenaire trouvé</p>}
        {partenaires.data.map(partenaire => (
          <Card
            key={partenaire._id}
            title={partenaire.name}
            imageComponent={<ResponsiveImage src={partenaire.picture} alt={`Logo de ${partenaire.name}`} style={{ objectFit: 'contain' }} />}
            start={<ul className="fr-badges-group">{partenaire.services.map(service => <Badge key={service} small noIcon severity="info">{service}</Badge>)}</ul>}
            detail={partenaire.codeDepartement.reduce((acc, code) => `${acc} ${getDepartementNom(code)}`, '')}
            {...(partenaire.link ? { footer: <a href={partenaire.link} target="_blank" className="fr-btn fr-btn--secondary">Site du partenaire</a> } : {})}
          />
        ))}
      </CardWrapper>
      <Pagination
        style={{ marginTop: '1rem' }}
        count={count}
        defaultPage={currentPage}
        getPageLinkProps={pageNumber => ({ href: `#page=${pageNumber}` })}
      />
    </StyledWrapper>
  )
}
