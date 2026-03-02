import styled from 'styled-components'
import { Accordion } from '@codegouvfr/react-dsfr/Accordion'

import { findCommuneName } from '@/utils/cog'
import BaseLocaleCard from './BaseLocaleCard'
import { BaseAdresseLocale } from '@/types/api-mes-adresses.types'
import { toolsColors } from '@/theme/theme'
import { CommuneDeploiementData } from './ListCommunes'

const StyledWrapper = styled.div`
    .accordion {
        .fr-accordion__btn {
            font-size: 16px;
            font-weight: bold;
        }
        .fr-accordion__btn:hover {
            background: none !important;
        }
        .fr-collapse--expanded {
            padding-left: 0;
            padding-right: 0;
        }
    }

    .accordion-label {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        padding-right: 8px;
    }

    .accordion-label-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .accordion-label-count {
        font-weight: normal;
        font-size: 14px;
        color: #555;
        margin-right: 6px;
        white-space: nowrap;
    }

    .source-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: normal;
        white-space: nowrap;
        border-radius: 12px;
        padding: 2px 10px 2px 6px;
        border: 1px solid rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.8);
    }

    .source-color {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .bals-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        padding: 12px 0;

        @media (max-width: 992px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 576px) {
            grid-template-columns: 1fr;
        }
    }

    .bals-mes-adresses-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 10px;
        padding: 10px 0 0 0;
    }

    .bals-mes-adresses-header .mes-adresses-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${toolsColors.mesAdresses};
        flex-shrink: 0;
    }

    .row-no-bal {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        min-height: 3em;
        border-top: 1px solid #ddd;
    }

    .row-commune-name {
        font-size: 16px;
        font-weight: bold;
    }

    .row-no-bal-note {
        font-size: 12px;
        color: #888;
        margin-left: 8px;
        font-style: italic;
    }
`

function getSourceInfo(sourceData: CommuneDeploiementData | undefined): { label: string, color: string } {
  if (!sourceData) {
    return { label: 'Assemblage BAN', color: '#ddd' }
  }

  const { nomClient, hasBAL, statusBals } = sourceData

  if (hasBAL) {
    if (nomClient === 'Mes Adresses') return { label: 'Mes Adresses', color: toolsColors.mesAdresses }
    if (nomClient === 'Moissonneur BAL') return { label: 'Moissonneur', color: toolsColors.moissonneur }
    if (nomClient === 'Formulaire de publication') return { label: 'Formulaire', color: toolsColors.formulaire }
    return { label: 'Api', color: toolsColors.api }
  }

  if (statusBals === 'draft') return { label: 'Mes Adresses (Brouillon)', color: `${toolsColors.mesAdresses}80` }

  return { label: 'Assemblage BAN', color: '#ddd' }
}

interface CommuneBALListProps {
  codeCommune: string
  balsCommune: Partial<BaseAdresseLocale>[]
  sourceData?: CommuneDeploiementData
}

export default function CommuneBALList({ codeCommune, balsCommune, sourceData }: CommuneBALListProps) {
  const nomCommune = findCommuneName(codeCommune)
  const { label, color } = getSourceInfo(sourceData)

  const sourceBadge = (
    <span className="source-badge">
      <span className="source-color" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </span>
  )

  const accordionLabel = (
    <span className="accordion-label">
      <span className="accordion-label-left">
        <span>{codeCommune} {nomCommune}</span>
        {sourceBadge}
      </span>
      <span className="accordion-label-count">
        {balsCommune.length} BAL{balsCommune.length > 1 ? 's' : ''}
      </span>
    </span>
  )

  return (
    <StyledWrapper>
      {balsCommune.length > 0
        ? (
            <Accordion label={accordionLabel} className="accordion">
              <div className="bals-mes-adresses-header">
                <span className="mes-adresses-dot" />
                <span>BALs Mes Adresses</span>
              </div>
              <div className="bals-grid">
                {balsCommune.map(bal => (
                  <BaseLocaleCard key={bal.id} bal={bal as BaseAdresseLocale} />
                ))}
              </div>
            </Accordion>
          )
        : (
            <div className="row-no-bal">
              <span className="accordion-label-left">
                <span className="row-commune-name">{codeCommune} {nomCommune}</span>
                {sourceBadge}
              </span>
              <span className="row-no-bal-note">Aucune BAL</span>
            </div>
          )}
    </StyledWrapper>
  )
}
