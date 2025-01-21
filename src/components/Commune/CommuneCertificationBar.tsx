'use client'

import styled from 'styled-components'
import CardWrapper from '../CardWrapper'
import { formatFr } from '@/lib/array'
import { assemblageSources } from '@/lib/api-ban'
import { BANCommune } from '@/types/api-ban.types'
import formatNumber from '@/app/carte-base-adresse-nationale/tools/formatNumber'

interface CommuneCertificationBarProps {
  commune: BANCommune
  lastRevisionsDetails: (string | JSX.Element)[][] | null
  certificationPercentage: number
  communeHasBAL: boolean
}

const StyledWrapper = styled.div<{ $certificationPercentage: number }>`
        background: ${({ theme, $certificationPercentage }) => $certificationPercentage === 0 ? `${theme.colors.grey.bg};` : $certificationPercentage === 100 ? `var(--background-contrast-success);` : `linear-gradient(90deg, var(--background-contrast-success) ${$certificationPercentage - 5}%, ${theme.colors.grey.bg} ${$certificationPercentage + 5}%);`};
        border-radius: 5px;
        margin-bottom: 2rem;
        width: 100%;

        > div {
            &:not(:first-of-type) {
                margin-top: 1rem;
            }

            .adresse-recap {
                flex: 1 0 33%;
                padding: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;

                div {
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-right: 1rem;
                    white-space: nowrap;
                }

                label {
                    font-size: 1.3rem;
                    > i {
                      margin-left: 1rem; 
                    }
                }
            }

            .publication-recap {
                flex: 1 0 33%;
                padding: 1rem;
                display: flex;
                flex-direction: column;

                div {
                    background-color: white;
                    border-radius: 5px;
                    padding: 1rem;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    margin-top: 1rem;
                }

                label {
                    font-size: 1.3rem;

                    > i {
                      margin-left: 1rem; 
                    }
                }
            }
        }


@media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {

    > div {
        .adresse-recap {
            justify-content: flex-start;
        }

        .publication-recap {
            padding: 0 1rem;

            div {
                background-color: white;
                border-radius: 10px;
                padding: 1rem;
                font-size: 1.5rem;
                margin-bottom: 1rem;
                margin-top: 1rem;
            }

            label {
                font-size: 1.3rem;
            }
        }
    }
}


`

export function CommuneCertificationBar({ commune, certificationPercentage, communeHasBAL, lastRevisionsDetails }: CommuneCertificationBarProps) {
  return (
    <StyledWrapper $certificationPercentage={certificationPercentage}>
      <CardWrapper>
        <div className="adresse-recap">
          <div>
            {commune.nbVoies}
          </div>
          <label>
            voies, places et lieux-dits adressés
          </label>
        </div>
        <div className="adresse-recap">
          <div>
            {commune.nbNumeros}
          </div>
          <label>
            adresses
          </label>
        </div>
        <div className="adresse-recap">
          <div>
            {certificationPercentage} %
          </div>
          <label>
            d&apos;adresses certifiées
          </label>
        </div>
      </CardWrapper>
      <CardWrapper>
        <div className="publication-recap">
          <label>
            <i className="fr-icon-send-plane-line" />
            Mode de publication
          </label>
          <div>
            {!communeHasBAL && 'Assemblage'}
            {communeHasBAL && lastRevisionsDetails && lastRevisionsDetails[0][2]}
          </div>
        </div>
        <div className="publication-recap">
          <label>
            <i className="ri-plug-line" />
            Source
          </label>
          <div>
            {!communeHasBAL && formatFr(assemblageSources(commune.voies))}
            {communeHasBAL && lastRevisionsDetails && lastRevisionsDetails[0][3]}
          </div>
        </div>
        <div className="publication-recap">
          <label>
            <i className="fr-icon-refresh-line" />
            Dernière mise à jour
          </label>
          <div>
            {!communeHasBAL && '-'}
            {communeHasBAL && lastRevisionsDetails && (lastRevisionsDetails[0][1] as string).split(' à ')[0]}
          </div>
        </div>
      </CardWrapper>
      <CardWrapper>
        <div className="publication-recap">
          <label>
            <i className="ri-key-line" />
            Code INSEE
          </label>
          <div>
            {commune.codeCommune}
          </div>
        </div>
        <div className="publication-recap">
          <label>
            <i className="ri-signpost-line" />
            {
              Number(commune.codesPostaux.length) > 1
                ? <><b>{formatNumber(commune.codesPostaux.length)}</b>&nbsp;codes Postaux</>
                : <>{commune.codesPostaux.length || 'Aucune'} code Postal</>
            }{' '}
          </label>
          <div>
            {commune.codesPostaux.join(', ')}
          </div>
        </div>
        <div className="publication-recap">
          <label>
            <i className="ri-key-line" />
            Code BAN :
          </label>
          <div>
            {commune.banId || '-'}
          </div>
        </div>
      </CardWrapper>
    </StyledWrapper>
  )
}
