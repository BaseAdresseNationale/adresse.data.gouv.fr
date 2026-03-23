'use client'

import { getFullDate } from '@/utils/date'
import styled from 'styled-components'
import StatusBadge from './StatusBadge'
import { BaseAdresseLocale } from '@/types/api-mes-adresses.types'
import { env } from 'next-runtime-env'

const StyledWrapper = styled.div`
.card {
    box-shadow: 0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47);
    border: 1px solid #E6E8F0;
    border-radius: 5px;
    margin-bottom: 12px;
    padding: 8px;
}
.card-header {
    justify-content: space-between;
    display: flex;
    margin-bottom: 12px;
}
.card-header-title h4 {
    margin: 0;
    font-size: 16px;
}
.card-header-title p {
    margin: 0;
    text-align: left;
    font-size: 12px;
}
`

interface BaseLocaleCardProps {
  bal: BaseAdresseLocale
}

export default function BaseLocaleCard({ bal }: BaseLocaleCardProps) {
  if (!env('NEXT_PUBLIC_MES_ADRESSES')) {
    console.error('NEXT_PUBLIC_MES_ADRESSES config value is not defined')
    return null
  }

  const { id, commune, nom, status, sync, updatedAt } = bal

  const balUrl = `${env('NEXT_PUBLIC_MES_ADRESSES')}/bal/${id}`

  return (
    <StyledWrapper>
      <div className="card">
        <div className="card-header">
          <div className="card-header-title">
            <h4>{commune} {nom}</h4>
            <p><i>Modifié le {getFullDate(new Date(updatedAt))}</i></p>
          </div>
          <StatusBadge status={status} sync={sync} />
        </div>
        <div className="card-body">
          <a className="fr-btn" href={balUrl} style={{ width: '100%' }} target="_blank">Consulter</a>
        </div>
      </div>
    </StyledWrapper>
  )
}
