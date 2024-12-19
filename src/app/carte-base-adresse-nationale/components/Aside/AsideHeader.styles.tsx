'use client'

import styled from 'styled-components'

export const AsideHeader = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
  width: 100%;
  min-height: fit-content;
  padding: 0 1rem 1rem;
  font-size: 1rem;
  transform: translateY(-100%);
  scroll-snap-align: start;
  scroll-snap-stop: always;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
    padding: 8rem 1rem 1rem;
    background: var(--background-default-grey);
    margin: 0;
    transform: none;
  }

  & * {
    pointer-events: auto;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(0deg, var(--background-default-grey) 0%, rgba(0, 0, 0, 0) 100%);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: 100% center;
    pointer-events: auto;
    transform: translateY(0);
    transition: transform 0.5s ease;

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      content: none;
    }
  }
`

export const AsideHeaderContent = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-bottom: 4px solid var(--border-active-blue-france);
  background-color: var(--background-default-grey);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem 0;
  }
`

export const AsideHeaderCloseButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  pointer-events: auto;
`
