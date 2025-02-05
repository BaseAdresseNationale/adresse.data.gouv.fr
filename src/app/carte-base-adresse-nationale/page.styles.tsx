'use client'

import styled, { keyframes } from 'styled-components'

const INIT_BG_SIZE = '40%'

const animate = keyframes`
  0%, 100% {
    background-position: left top;
    background-size: ${INIT_BG_SIZE};
  }
  25%{
    background-position: right bottom;
    background-size: 60%;
   }
  50% {
    background-position: left bottom;
    background-size: 50%;
  }
  75% {
    background-position: right top;
    background-size: 35%;
  }
`

const bgColor = `var(--background-default-grey)`
const bgColorMain = `var(--text-default-grey)`
export const MapWrapper = styled.div`
  flex: 1;
  background-color: ${bgColor};
  background: url('/img/map-bg-pattern.svg'),
    radial-gradient(circle, transparent 20%, ${bgColor} 20%, ${bgColor} 80%, transparent 80%, transparent),
    radial-gradient(circle, transparent 20%, ${bgColor} 20%, ${bgColor} 80%, transparent 80%, transparent) 27.5px 27.5px,
    linear-gradient(${bgColorMain} 2.2px, transparent 2.2px) 0 -1.1px,
    linear-gradient(90deg, ${bgColorMain} 2.2px, ${bgColor} 2.2px) -1.1px 0;
  background-image: url('/img/map-bg-pattern.svg');
  background-size: ${INIT_BG_SIZE},  55px, 55px 55px, 27.5px 27.5px, 27.5px 27.5px;
  animation: ${animate} 20s ease-in-out 5 1s;
  animation-play-state: paused;

  &.loading {
    animation-play-state: running;
  }
`

export const MapSearchResultsWrapper = styled.div`
  padding: 1rem;
  scroll-snap-align: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
    min-height: 100%;
    margin-top: 0;
  }
`

export const MapSearchResultsHead = styled.div``
export const MapSearchResultsBody = styled.div``
