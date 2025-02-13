'use client'

import { Pagination } from '@codegouvfr/react-dsfr/Pagination'
import TagSelect from '../../TagSelect'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PartenaireDeLaCharteTypeEnum, PartenaireDeLaChartType } from '@/types/partenaire.types'
import { DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT, getPartenairesDeLaCharte, getPartenairesDeLaCharteServices, PaginatedPartenairesDeLaCharte } from '@/lib/api-bal-admin'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { Departement } from '@/types/api-geo.types'
import { Commune } from '@/types/api-geo.types'
import { getPageFromHash, useHash } from '@/hooks/useHash'
import { useDebounce } from '@/hooks/useDebounce'
import { StyledWrapper } from './SearchPartenaire.styles'
import CardWrapper from '@/components/CardWrapper'
import { getCommunes } from '@/lib/api-geo'
import AutocompleteInput from '@/components/Autocomplete/AutocompleteInput'
import PartenaireCard from './PartenaireCard'

export interface SearchPartenaireProps {
  initialServices: Record<string, number>
  initialPartenaires: PaginatedPartenairesDeLaCharte
  departements: Departement[]
  filter?: { type: PartenaireDeLaCharteTypeEnum }
  searchBy: 'perimeter' | 'name'
  shuffle?: boolean
  pageSize?: number
  placeholder: string
  onReview?: (partenaire: PartenaireDeLaChartType) => void
}

export default function SearchPartenaire({
  initialServices,
  initialPartenaires,
  departements,
  filter,
  searchBy,
  shuffle,
  placeholder,
  pageSize = DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT,
  onReview,
}: SearchPartenaireProps) {
  const { hash, resetHash } = useHash()
  const [search, onSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [currentPage, setCurrentPage] = useState(getPageFromHash(hash))
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [partenaires, setPartenaires] = useState<PaginatedPartenairesDeLaCharte>(initialPartenaires)
  const [services, setServices] = useState<Record<string, number>>(initialServices)

  const fetchCommunes = useCallback((query: string) => getCommunes({ q: query }), [])

  const updatePartenaires = useCallback(async (page: number) => {
    const updatedPartenaires = await getPartenairesDeLaCharte({
      ...filter,
      services: selectedServices,
      codeDepartement: selectedCommune?.codeDepartement ? [selectedCommune.codeDepartement] : [],
      search: debouncedSearch,
    }, page, pageSize)
    setPartenaires(updatedPartenaires)

    const updatedServices = await getPartenairesDeLaCharteServices({
      ...filter,
      codeDepartement: selectedCommune?.codeDepartement ? [selectedCommune.codeDepartement] : [],
      search: debouncedSearch,
    })
    setServices(updatedServices)

    setCurrentPage(page)
  }, [selectedServices, selectedCommune, debouncedSearch, filter, pageSize])

  useEffect(() => {
    if (hash) {
      const nextPage = getPageFromHash(hash)
      updatePartenaires(nextPage)
    }
  }, [hash, updatePartenaires])

  useEffect(() => {
    resetHash()
    updatePartenaires(1)
  }, [selectedServices, selectedCommune, debouncedSearch, updatePartenaires, resetHash])

  const count = useMemo(() => Math.ceil(partenaires.total / pageSize), [partenaires.total, pageSize])

  const getDepartementNom = (code: string) => {
    const departement = departements.find(departement => departement.code === code)
    return departement?.nom || ''
  }

  const tagSelectOption = useMemo(() => {
    return Object.keys(services).map(service => ({ value: service, label: <div><Badge style={{ marginRight: 5 }}>{services[service]}</Badge>{service}</div> }))
  }, [services])

  return (
    <StyledWrapper>
      <div className="controls">
        <div className="controls-input-wrapper">
          {searchBy === 'perimeter' && (
            <AutocompleteInput
              value={selectedCommune}
              fetchResults={fetchCommunes}
              onChange={commune => setSelectedCommune(commune as Commune | null)}
              placeholder={placeholder}
            />
          ) }
          {searchBy === 'name' && (
            <input
              className="fr-input"
              placeholder={placeholder}
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
          )}
        </div>
        <TagSelect options={tagSelectOption} value={selectedServices} onChange={selectedServices => setSelectedServices(selectedServices)} />
      </div>
      <CardWrapper isSmallCard>
        {partenaires.data.length === 0 && <p>Aucun partenaire trouvé</p>}
        {partenaires.data.sort(() => {
          if (shuffle) {
            return Math.random() - 0.5
          }

          return 0
        }).map(partenaire => (
          <PartenaireCard
            key={partenaire.id}
            partenaire={partenaire}
            detail={partenaire.codeDepartement.reduce((acc, code) => `${acc} ${getDepartementNom(code)}`, '')}
            onReview={onReview}
          />
        ))}
      </CardWrapper>
      {partenaires.total > pageSize && (
        <Pagination
          style={{ marginTop: '1rem', alignSelf: 'center' }}
          count={count}
          defaultPage={currentPage}
          getPageLinkProps={pageNumber => ({ href: `#page=${pageNumber}` })}
        />
      )}
    </StyledWrapper>
  )
}
