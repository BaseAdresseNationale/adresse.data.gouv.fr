'use client'

import styled, { css } from 'styled-components'

export const ParcelsWrapper = styled.div`
  display: flex;
  gap: .5rem;
  margin-top: 0.5rem;

  & > button {
    margin-top: .5rem;
  }

  & > * {
    flex: 1;
  }
`

export const ListParcelsWrapper = styled.div<{ $isSmall?: boolean }>`
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  ${({ $isSmall }) => $isSmall ? css`max-height: 20rem` : ''};

  &::before,
  &::after {
    content: '';
    pointer-events: none;
    display: block;
    position: sticky;
    z-index: 1;
    left: 0;
    right: 0;
  }

  &::before {
    top: 0;
    height: 1.5rem;
    background: linear-gradient(
      to top,
      transparent 0%,
      #fff 100%
    );
  }

  &::after {
    bottom: 0;
    height: 3rem;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      #fff 50%,
      #fff
    );
  }
`
