'use client'

import Section from '@/components/Section'
import styled from 'styled-components'

export const StyledWrapper = styled(Section)`
    .review {
        border-top: 1px solid ${({ theme }) => theme.colors.grey.light};
        padding: 1rem 0;
        display: flex;

        .review-header {
            flex-shrink: 0;

            p {
                margin-bottom: 0.5rem;
            }
        }

        .review-content {
            flex-grow: 1;
            margin-left: 2rem;
        }
    }
`
