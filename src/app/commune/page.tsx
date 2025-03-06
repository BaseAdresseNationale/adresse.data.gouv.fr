'use client'

import { SeasonSketch } from '@/components/SeasonSketch'
import Section from '@/components/Section'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import SearchBAN from '@/components/SearchBAN'

export default function VotreCommuneEtSaBALPage() {
  const router = useRouter()

  const handleSelectDistrict = useCallback((feature: GeoJSON.Feature) => {
    const { citycode: codeCommune } = feature?.properties || {}
    router.push(`/commune/${codeCommune}`)
  }, [router])

  return (
    <>
      <Section pageTitle="Consulter la page d'une commune">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <div style={{ maxWidth: 600, flexGrow: 1 }}>
            <SearchBAN
              placeholder="Nom ou code INSEE, exemple : 64256 ou Hasparren"
              filter={{ type: 'municipality' }}
              onSelect={handleSelectDistrict}
            >
              <label style={{ marginBottom: '.5em' }} className="fr-label" htmlFor="autocomplete-search-ban">Rechercher une commune :</label>
            </SearchBAN>
          </div>
        </div>
      </Section>
      <Section>
        <SeasonSketch />
      </Section>
    </>
  )
}
