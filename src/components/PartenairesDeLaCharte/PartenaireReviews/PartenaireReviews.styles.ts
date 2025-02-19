'use client'

import Section from '@/components/Section'
import styled from 'styled-components'

export const StyledWrapper = styled(Section)`
    .review {
        border-top: 1px solid ${({ theme }) => theme.colors.grey.border};
        padding: 1rem 0;
        display: flex;
        flex-direction: column;

        @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
            flex-direction: row;
            gap: 2rem;

            .review-content {
                margin-left: 2rem;
            }
        }

        .review-header {
            flex-shrink: 0;
            p {
                margin-bottom: 0.5rem;
            }
        }

        .review-rating {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            height: fit-content;
            span {
                margin-left: 1rem;
            }
        }

        .review-content {
            flex-grow: 1;
        }
    }
`
