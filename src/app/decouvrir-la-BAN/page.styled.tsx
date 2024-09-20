'use client'

import styled from 'styled-components'

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;

    article {
      flex: 65;
      min-width: 600px;

      img {
        max-width: 100%;
      }
    }

    aside {
      flex: 35;
      min-width: 300px;
    }
`
