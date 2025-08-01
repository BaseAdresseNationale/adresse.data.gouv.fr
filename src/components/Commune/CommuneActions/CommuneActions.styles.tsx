'use client'

import styled from 'styled-components'

export const CommuneActionsSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  line-height: 2.25;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    //justify-content: flex-end;
    flex-wrap: wrap;
  }

  .resume-card {
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.grey.border};
    border-radius: 5px;

    > i {
      margin-right: 0.5rem;
    }
  }
`

export const CommuneActionsActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  line-height: 2.25;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .resume-card {
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.grey.border};
    border-radius: 5px;

    > i {
      margin-right: 0.5rem;
    }
  }
`

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

export const CommuneInfosActionsWrapper = styled.div`
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

export const CommuneConfigItem = styled.div`
  display: block;
  margin-bottom: 0.2em;

  b {
    font-weight: 500;
    font-size: 1.1em;
  }

  &::before {
    width: 1.25em;
    height: 1.25em;
    margin-right: 0.5em;
    vertical-align: -0.25rem;
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
