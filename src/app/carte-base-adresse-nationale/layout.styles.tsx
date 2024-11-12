'use client'

import styled, { css, keyframes } from 'styled-components'

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
    pointer-events: auto;
  }

  & > *:not(.layer) {
    border-radius: 0.25rem 0.25rem 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
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

// ---------------------------
// --- Map Legend & Config ---
// ---------------------------

export const MapParamsWrapper = styled.div.attrs({
  className: 'layer',
})`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: .5em;
  padding: 1rem 0;
  position: relative;
  z-index: 1;
`

export const RingButtonStyled = styled.button.attrs({
  className: 'Mui-Not-DSFR',
})<{
  $img?: string
  $isActive?: boolean
  $isTypeRadio?: boolean
}>`
  border: 0.15rem solid currentColor;
  padding: 0.5rem;
  border-radius: 2rem;
  background-color: var(--background-raised-grey);
  ${({ $img }) => $img && css`background-image: url(${$img})`};
  background-position: center center;
  background-size: 100%;
  box-shadow: 0rem 0.3rem 0.7rem -0.25rem rgba(0, 0, 0, .5),
    0rem 0.3rem 0.7rem -0.15rem rgba(255, 255, 255, .5),
    ${({ $isTypeRadio, $isActive }) => !$isTypeRadio || $isActive ? css`0rem 0rem 0rem -0rem rgba(0, 0, 0, .5) inset` : css`0rem 0.3rem 0.7rem -0.25rem rgba(0, 0, 0, .5) inset`},
    ${({ $isActive }) => $isActive ? css`0rem 0rem 1px 2px #fff inset` : css`0rem 0rem 0px 0px #fff inset`},
    ${({ $isActive }) => $isActive ? css`0rem 0rem 1px 3px currentColor inset` : css`0rem 0rem 0px 0px currentColor inset`};
  margin: 0 0.5rem 0 0;
  color: var(--text-action-high-blue-france);
  min-height: 3em;
  min-width: 3em;
  ${({ $isActive, $isTypeRadio }) => !$isTypeRadio || $isActive
    ? css`filter: grayscale(0) brightness(1);`
    : css`filter: grayscale(0.75) brightness(.85);`
  }
  ${({ $isActive, $isTypeRadio }) => $isTypeRadio && $isActive
    ? css`cursor: default;`
    : css`filter: pointer;`
  }
  transform-origin: center;
  transform: scale(.95);
  transition: background-color 0.15s, filter 0.15s, transform 0.15s, box-shadow 0.15s;

  &:hover {
    background-color: blue;
    filter: grayscale(0) brightness(1);
    transform: scale(1);
    ${({ $isActive }) => $isActive
      ? css`transform: scale(.95);`
      : css`transform: scale(1);`
    }
  }
`

export const LegendList = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const PointPaint = styled.div<{ $fill?: string, $stroke?: string }>`
  display: inline-block;
  align-items: center;
  background-color: ${({ $fill }) => $fill || 'transparent'};
  border-color: ${({ $stroke }) => $stroke || 'transparent'};
  border-style: solid;
  border-width: .25em;
  border-radius: 1em;
  box-sizing: content-box;
  margin-bottom: -.15em;
  width: 0.6em;
  height: 0.6em;
`
