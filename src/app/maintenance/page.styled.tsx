'use client'

import styled from 'styled-components'

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;

    article {
      overflow: hidden;

      img {
        max-width: 100%;
        margin: 2rem auto;
      }
    }

    aside {
      flex: 35;
      min-width: 300px;
    }
`
