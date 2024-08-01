'use client'

import Image from 'next/image'
import styled from 'styled-components'

export interface VerbatimProps {
  text: string
  author: string
  link: string
}

const StyledWrapper = styled.div`
  border-left: 1px solid #dddddd;
  padding: 10px 30px;

  > p {
    font-size: 16px;
    font-weight: bold;
  }

  > div {
    font-size: 12px;
    font-weight: bold;
  }

  > a {
    font-size: 12px !important;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    &:first-of-type {
      margin-bottom: 20px;
    }
  }
`

export default function Verbatim({ text, author, link }: VerbatimProps) {
  return (
    <StyledWrapper className="fr-col-md-5">
      <Image
        src="/programme-bal/verbatim.svg"
        alt="icone verbatim"
        width={30}
        height={30}
      />
      <p>« {text} »</p>
      <div>{author}</div>
      <a href={link}>Consulter l&apos;article entier</a>
    </StyledWrapper>
  )
}
