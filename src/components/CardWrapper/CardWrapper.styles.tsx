'use client'

import styled from 'styled-components'

const CardWrapper = styled.div
  .withConfig({
    shouldForwardProp: prop => prop !== 'isSmallCard',
  })<{ isSmallCard?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1rem;

  ${({ isSmallCard }) => isSmallCard && `
      grid-template-columns: repeat(auto-fill, minmax(14.5rem, 1fr));
  `}
`
export default CardWrapper
