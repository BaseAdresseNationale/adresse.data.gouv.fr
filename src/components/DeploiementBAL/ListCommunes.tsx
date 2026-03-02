'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { groupBy } from 'lodash'

import { getStatsBals } from '@/lib/api-mes-adresses'
import { customFetch } from '@/lib/fetch'
import CommuneBALList from './CommuneBALList'
import styled from 'styled-components'
import { BaseAdresseLocale } from '@/types/api-mes-adresses.types'

const StyledWrapper = styled.div`
  margin-top: 2rem;
  text-align: left;

  .loader {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 1.5rem 0;
    color: #666;
    font-size: 14px;
  }
`

const listHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '6px 16px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f8f8f8',
}

export interface CommuneDeploiementData {
  nomClient?: string
  hasBAL: boolean
  statusBals: string
  idClient?: string
}

interface ListCommunesProps {
  filteredCodesCommmune: string[]
}

export default function ListCommunes({ filteredCodesCommmune }: ListCommunesProps) {
  const [bals, setBals] = useState<Partial<BaseAdresseLocale>[]>([])
  const [deploiementByCommune, setDeploiementByCommune] = useState<Record<string, CommuneDeploiementData>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const fields = ['id', 'commune', 'status', 'nom', 'updatedAt', 'sync']
        const deploiementUrl = new URL(`${window.location.origin}/api/deploiement-stats`)
        deploiementUrl.searchParams.append('codesCommune', filteredCodesCommmune.toString())

        const [balsFiltered, deploiementResponse] = await Promise.all([
          getStatsBals(fields, filteredCodesCommmune),
          customFetch(deploiementUrl),
        ])

        setBals(balsFiltered)

        const byCommune: Record<string, CommuneDeploiementData> = {}
        for (const feature of deploiementResponse.features) {
          const { code, nomClient, hasBAL, statusBals, idClient } = feature.properties
          byCommune[code] = { nomClient, hasBAL, statusBals, idClient }
        }
        setDeploiementByCommune(byCommune)
      }
      finally {
        setIsLoading(false)
      }
    }

    if (filteredCodesCommmune.length > 0) {
      loadData()
    }
  }, [filteredCodesCommmune])

  const balsByCommune = useMemo(() => {
    return groupBy(bals, 'commune')
  }, [bals])

  return (
    <StyledWrapper>
      <h3>Liste des Communes</h3>
      {isLoading && (
        <div className="loader">
          <div className="fr-spinner" aria-label="Chargement en cours" />
          <span>Chargement des communes...</span>
        </div>
      )}
      {!isLoading && filteredCodesCommmune.length > 0
        ? (
            <div style={{ borderTop: '1px solid #ddd' }}>
              <div style={listHeaderStyle}>
                <span>Commune — Source</span>
                <span>BALs Mes Adresses</span>
              </div>
              {filteredCodesCommmune.map((codeCommune) => {
                const balsCommune = balsByCommune[codeCommune] || []
                return (
                  <div key={codeCommune} style={{ borderBottom: '1px solid #ddd' }}>
                    <CommuneBALList
                      codeCommune={codeCommune}
                      balsCommune={balsCommune}
                      sourceData={deploiementByCommune[codeCommune]}
                    />
                  </div>
                )
              })}
            </div>
          )
        : (
            !isLoading && <p>Aucun Département ou EPCI sélectionné</p>
          )}
    </StyledWrapper>
  )
}
