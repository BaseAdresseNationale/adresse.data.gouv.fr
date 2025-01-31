'use client'

import AutocompleteInput from '@/components/Autocomplete/AutocompleteInput'
import { SeasonSketch } from '@/components/SeasonSketch'
import Section from '@/components/Section'
import { getCommunes } from '@/lib/api-geo'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function VotreCommuneEtSaBALPage() {
  const router = useRouter()
  const fetchCommunes = useCallback((query: string) => getCommunes({ q: query }), [])

  return (
    <>
      <Section pageTitle="Consulter la page d'une commune">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <div style={{ maxWidth: 600, flexGrow: 1 }}>
            <AutocompleteInput
              label="Rechercher une commune :"
              value={null}
              fetchResults={fetchCommunes}
              onChange={commune => commune && router.push(`/commune/${commune.code}`)}
              placeholder="Nom ou code INSEE, exemple : 64256 ou Hasparren"
            />
          </div>
        </div>
      </Section>
      <Section>
        <SeasonSketch />
      </Section>
    </>
  )
}
