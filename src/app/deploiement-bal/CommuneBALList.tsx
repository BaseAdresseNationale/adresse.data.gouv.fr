import styled from 'styled-components'
import { Accordion } from '@codegouvfr/react-dsfr/Accordion'

import { findCommuneName } from '@/utils/cog'
import BaseLocaleCard from './BaseLocaleCard'
import { BaseAdresseLocale } from '@/types/api-mes-adresses.types'

const StyledWrapper = styled.div`
    .section-no-bal {
         margin-bottom: -1px;
    }
    .section-no-bal p {
        font-size: 16px;
        line-height: 3em;
        margin: 0;
        text-align: left;
        padding-left: 16px;
        border-bottom: 1px solid #ddd;
    }

    .accordion {
        padding: 10px;
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
`

interface CommuneBALListProps {
  codeCommune: string
  balsCommune: Partial<BaseAdresseLocale>[]
}

export default function CommuneBALList({ codeCommune, balsCommune }: CommuneBALListProps) {
  const nomCommune = findCommuneName(codeCommune)
  const title = `${codeCommune} ${nomCommune} - ${balsCommune.length > 0 ? balsCommune.length + ' BAL(s)' : 'Aucune BAL'} `

  return (
    <StyledWrapper>
      {balsCommune.length > 0
        ? (
            <Accordion label={title} className="accordion">
              {balsCommune.map(bal => (
                <BaseLocaleCard key={bal.id} bal={bal as BaseAdresseLocale} />
              ))}
            </Accordion>
          )
        : (
            <section className="section-no-bal">
              <p>{title}</p>
            </section>
          )}
    </StyledWrapper>
  )
}
