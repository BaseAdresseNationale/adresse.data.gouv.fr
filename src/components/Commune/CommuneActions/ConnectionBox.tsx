import React from 'react'
import { ProConnectButton } from '@codegouvfr/react-dsfr/ProConnectButton'

import Image from 'next/image'
import styled from 'styled-components'

const ConnectionBoxWrapper = styled.div`
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
position: relative;
text-align: center;
padding: 1.5rem;
padding-right: calc(1.5rem + 1.5rem - 8px);

@media (min-width: ${({ theme }) => theme.breakpoints.md}) {
  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 1rem;
    right: 0rem;
    bottom: 1rem;
    width: 1px;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    box-shadow: 1px 0 1px 0px ${({ theme }) => theme.colors.grey.border};
  }
}
`

const TeaserAndButtonWrapper = styled.div`
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
        {teaser && <p>{teaser}</p>}
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
