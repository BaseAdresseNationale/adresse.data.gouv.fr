'use client'

import styled from 'styled-components'

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .loader-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

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
`
