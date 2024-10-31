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

export const CartoWrapper = styled.div`
  position: relative;
  display: flex;
  height: calc(100vh - 4.5rem - 5.8rem - 3.6rem - 5rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      height: calc(100vh - 4.5rem - 5.8rem - 3.6rem - 3.6rem);
  }

  &::before {
    content: '';
    position: absolute;
    z-index: 11;
    top: 0;
    left: -1rem;
    right: -1rem;
    bottom: 0;
    height: 100%;
    box-shadow: 0 0 .5rem rgba(0, 0, 0, 0.5) inset;
    pointer-events: none;
  }
`

export const CartoMenu = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  pointer-events: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-width: 200px;
    width: 400px;
    max-width: 25%;
  }

  & > * {
    border-radius: 0.25rem 0.25rem 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    pointer-events: auto;
  }
`

const bgColor = `var(--background-default-grey)`
const bgColorMain = `var(--text-default-grey)`
export const CartoBody = styled.div`
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
`
