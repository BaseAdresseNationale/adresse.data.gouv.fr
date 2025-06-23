'use client'

import styled from 'styled-components'
import Section from '../Section'
import Table from '@codegouvfr/react-dsfr/Table'
import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CommuneUpdatesSectionProps {
  lastRevisionsDetails: (string | JSX.Element | null)[][]
}

const StyledWrapper = styled.div`
    margin-top: 2rem;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    display: flex;
    flex-direction: column;

    h3 {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .fr-table {

        > table {
            > thead {
                display: none;
            }

            > tbody {
                border: 0;

                tr {
                    td:first-child {
                        text-align: center;
                        color: ${({ theme }) => theme.colors.primary.main};
                    }

                    td:nth-child(2) {
                        font-weight: bold;
                    }

                    td {
                      white-space: nowrap;
                    }
                }

                &:after {
                    background-image: none;
                }
            }
        }
    }
`

export function CommuneUpdatesSection({ lastRevisionsDetails }: CommuneUpdatesSectionProps) {
  const data = useMemo(() => {
    return lastRevisionsDetails.map((revision) => {
      return [
        revision[0],
        format(parseISO(revision[1] as string), '\'le\' dd MMMM yyyy \'à\' HH:mm', { locale: fr }),
        ...revision.slice(2),
      ]
    })
  }, [lastRevisionsDetails])

  return (
    <Section title="Les dernières mises à jour">
      <StyledWrapper>
        <Table
          headers={[
            'Révision courante',
            'Date',
            'Mode de publication',
            'Source',
            'Télécharger',
          ]}
          data={data}
        />
      </StyledWrapper>
    </Section>
  )
}
