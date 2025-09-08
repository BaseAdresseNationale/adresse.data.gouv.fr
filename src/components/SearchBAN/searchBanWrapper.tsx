'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { env } from 'next-runtime-env'
import SearchBAN from '@/components/SearchBAN'

const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')
export default function SearchBANWrapper() {
  const router = useRouter()
  const defaultHandleSelect = useCallback((feature: GeoJSON.Feature) => {
    const { id } = feature?.properties || {}
    router.push(`${URL_CARTOGRAPHY_BAN}?id=${id}`)
  }, [router])

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <SearchBAN onSelect={defaultHandleSelect}>
        <p style={{ margin: 0 }}>
          Saisissez votre adresse, une voie, un lieu-dit ou une commune
        </p>
      </SearchBAN>
    </div>
  )
}
