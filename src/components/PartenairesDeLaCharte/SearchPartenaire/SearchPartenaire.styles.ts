'use client'

import styled from 'styled-components'

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .controls {
    .controls-input-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;

      > input,div {
        flex-grow: 1;
        &:focus {
          outline: none;
        }
      }

      p {
        margin: 0 0 0 1rem;
        flex-shrink: 0;
      }


      @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        > input,div {
          width: 100%;
          margin-bottom: 0.5rem;
        }
      }
    }
  }

  .content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;

    .fr-card__img {
      object-fit: contain !important;
    }
  }
`
