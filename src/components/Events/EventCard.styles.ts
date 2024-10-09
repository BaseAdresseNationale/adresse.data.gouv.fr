'use client'

import styled from 'styled-components'

export const StyledEventCard = styled.div<{ $isPassed?: boolean }>`
    padding: 32px;
    border: 1px solid ${({ theme }) => theme.colors.grey.border};
    ${({ $isPassed }) => $isPassed && 'opacity: 0.5;'}

    .event-details {
        color: ${({ theme }) => theme.colors.primary.main};
        font-size: 0.9rem;
        font-weight: bold;
        margin: 10px 0;

        span[class^="fr-icon"] {
            margin-right: 5px;
            color: ${({ theme }) => theme.colors.grey.main};
        }
    }

    .clamp {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;  
        overflow: hidden;    
    }

    h3 {
        font-size: 1.5rem;
    }

    .fr-btn {
        &::after {
            display: none;
        }
    }
`
