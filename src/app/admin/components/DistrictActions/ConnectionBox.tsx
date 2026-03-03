'use client'

import React from 'react'
import { ProConnectButton } from '@codegouvfr/react-dsfr/ProConnectButton'

import Image from 'next/image'
import styled from 'styled-components'

const ConnectionBoxWrapper = styled.div`
  font-family: var(--font-family-default);
  display: flex;
  flex-direction: column;
  max-width: 45rem;
  margin: 0 auto;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
  }
`

const TitlePictureWrapper = styled.div`
  font-family: var(--font-family-default);
  position: relative;
  text-align: center;
  padding: 1.5rem;
  padding-right: calc(1.5rem + 1.5rem - 0.5rem);

  img {
    min-width: 5em;
    height: auto;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 1rem;
      right: 0;
      bottom: 1rem;
      width: 0.0625rem;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      box-shadow: 0.0625rem 0 0.0625rem 0 ${({ theme }) => theme.colors.grey.border};
    }
  }
`

const TeaserAndButtonWrapper = styled.div`
  font-family: var(--font-family-default);
  align-self: end;
`

function ConnectionBox({ teaser, onConnect }: {
  teaser?: string
  onConnect: (connectionStatus: boolean) => void
}) {
  return (
    <ConnectionBoxWrapper>
      <TitlePictureWrapper>
        <Image
          src="/img/connection/logo_pro_connect.svg"
          alt="Connection “PRO Connect”"
          width={80}
          height={80}
        />
      </TitlePictureWrapper>
      <TeaserAndButtonWrapper>
        {teaser && <p className="fr-text--sm fr-mb-0">{teaser}</p>}
        <div>
          <ProConnectButton
            onClick={() => onConnect(true)}
          />
        </div>
      </TeaserAndButtonWrapper>
    </ConnectionBoxWrapper>
  )
}

export default ConnectionBox
