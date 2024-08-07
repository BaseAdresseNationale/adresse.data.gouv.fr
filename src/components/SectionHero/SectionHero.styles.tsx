'use client'

import Image from 'next/image'
import styled from 'styled-components'

export const HeroWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`

export const HeroFooter = styled.footer`
  padding: 2em 0;
`

export const HeroImage = styled(Image)`
  width: 100%;

  @media screen and (min-width: 768px) {
    margin: 2rem 6rem;
    width: auto;
    max-width: 30vw;
  }
`
