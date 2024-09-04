'use client'

import styled from 'styled-components'

export const StyledCommunePage = styled.div`
.breacrumb-wrapper {
    > nav {
    margin-bottom: 1rem;
  }
}

.commune-info-wrapper {
    display: flex;
    margin-bottom: 2rem;

    .commune-info-card {
        border: 1px solid ${({ theme }) => theme.colors.grey.border};
        padding: 1rem;
        flex: 1 0 50%;
        
        &:first-of-type {
            margin-right: 1rem;
        }

        h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
    }
}

.modification-history-wrapper {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;

    h3 {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .fr-table {
        align-self: center;
    }
}
`
