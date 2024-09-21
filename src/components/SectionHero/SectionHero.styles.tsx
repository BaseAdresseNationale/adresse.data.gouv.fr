'use client'

import Image from 'next/image'
import styled from 'styled-components'

export const HeroWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
  }
`

export const HeroTextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  `

export const HeroFooter = styled.footer`
  padding: 2em 0;
`

export const HeroImage = styled(Image)`
  width: 100%;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 2rem 4rem;
    width: auto;
    max-width: 36vw;
  }
`
