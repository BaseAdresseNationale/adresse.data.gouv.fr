'use client'

import styled from 'styled-components'

export const CertificatAdressageOptInActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
  }
`

export const StyledIframeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`
export const StyledIframe = styled.iframe`
  display: block;
  max-width: 100%;
  width: 600px;
  height: 1200px;
  border: 1px solid;
  margin: 0;
  padding: 0;
  background: #fff;
`
