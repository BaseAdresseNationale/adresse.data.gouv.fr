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
import Loader from '@/components/Loader'

export interface SearchPartenaireProps {
  departements: Departement[]
  filter?: { type: PartenaireDeLaCharteTypeEnum }
  searchBy: 'perimeter' | 'name'
  pageSize?: number
  placeholder: string
  onReview?: (partenaire: PartenaireDeLaChartType) => void
  onLoaded?: () => void
}

export default function SearchPartenaire({
  departements,
  filter,
  searchBy,
  placeholder,
  pageSize = DEFAULT_PARTENAIRES_DE_LA_CHARTE_LIMIT,
  onReview,
  onLoaded,
}: SearchPartenaireProps) {
  const { hash, resetHash } = useHash()
  const [search, onSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const debouncedSearch = useDebounce(search, 500)
  const [currentPage, setCurrentPage] = useState(getPageFromHash(hash))
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [partenaires, setPartenaires] = useState<PaginatedPartenairesDeLaCharte>()
  const [services, setServices] = useState<Record<string, number>>()

  const fetchCommunes = useCallback((query: string) => getCommunes({ q: query }), [])

  const updatePartenaires = useCallback(async (page: number) => {
    try {
      const updatedPartenaires = await getPartenairesDeLaCharte({
        ...filter,
        services: selectedServices,
        codeDepartement: selectedCommune?.codeDepartement ? [selectedCommune.codeDepartement] : [],
        search: debouncedSearch,
        shuffleResults: filter?.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE,
      }, page, pageSize)

      setPartenaires(updatedPartenaires)

      const updatedServices = await getPartenairesDeLaCharteServices({
        ...filter,
        codeDepartement: selectedCommune?.codeDepartement ? [selectedCommune.codeDepartement] : [],
        search: debouncedSearch,
      })
      setServices(updatedServices)

      setCurrentPage(page)
      onLoaded && onLoaded()
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setIsLoading(false)
    }
  }, [selectedServices, selectedCommune, debouncedSearch, filter, pageSize, onLoaded])

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

  const count = useMemo(() => {
    if (!partenaires) {
      return 0
    }

    return Math.ceil(partenaires.total / pageSize)
  }, [partenaires, pageSize])

  const getDepartementNom = (code: string) => {
    const departement = departements.find(departement => departement.code === code)
    return departement?.nom || ''
  }

  const tagSelectOption = useMemo(() => {
    if (!services) {
      return []
    }

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
      {isLoading
        ? (
            <div className="loader-wrapper">
              <Loader size={50} />
            </div>
          )
        : partenaires?.data.length === 0
          ? <p>Aucun partenaire trouvé</p>
          : (
              <CardWrapper isSmallCard>
                {partenaires?.data.map(partenaire => (
                  <PartenaireCard
                    key={partenaire.id}
                    partenaire={partenaire}
                    detail={partenaire.codeDepartement.reduce((acc, code) => `${acc} ${getDepartementNom(code)}`, '')}
                    onReview={onReview}
                  />
                ))}
              </CardWrapper>
            )}

      {partenaires && partenaires.total > pageSize && (
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
