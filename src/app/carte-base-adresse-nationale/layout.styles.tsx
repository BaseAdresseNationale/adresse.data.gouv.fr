'use client'

import styled, { css } from 'styled-components'

export const CartoWrapper = styled.div`
  position: relative;
  display: flex;
  height: calc(100vh - 10.3rem);
  height: calc(100dvh - 10.3rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      height: calc(100vh - 7.4rem - 3.5rem + 3.5rem);
      height: calc(100dvh - 7.4rem - 3.5rem + 3.5rem);
  }

  &::before {
    content: '';
    position: absolute;
    z-index: 11;
    inset: 0;
    height: 100%;
    box-shadow: 0 0 .5rem rgba(0, 0, 0, 0.5) inset;
    pointer-events: none;
  }

  // ---------------------------------
  // --- Fix for MaplibreGL styles ---
  // ---------------------------------

  .maplibregl-map{
    font:1rem/1.5 "Marianne", arial, sans-serif;
  }
  .maplibregl-popup-content {
    background: var(--background-default-grey);
    border-radius: 0.5rem;
    padding: 0.75rem;
    width: 280px;
  }

  .maplibregl-popup-anchor-top-left .maplibregl-popup-content {
    border-radius: 0 0.5rem 0.5rem 0.5rem;
  }
  .maplibregl-popup-anchor-top-right .maplibregl-popup-content {
    border-radius: 0.5rem 0 0.5rem 0.5rem;
  }
  .maplibregl-popup-anchor-bottom-left .maplibregl-popup-content {
    border-radius: 0.5rem 0.5rem 0.5rem 0;
  }
  .maplibregl-popup-anchor-bottom-right .maplibregl-popup-content {
    border-radius: 0.5rem 0.5rem 0 0.5rem;
  }

  .maplibregl-popup-anchor-top,
  .maplibregl-popup-anchor-top-left,
  .maplibregl-popup-anchor-top-right {
    .maplibregl-popup-tip {
      border-bottom-color: var(--background-default-grey);
    }
  }

  .maplibregl-popup-anchor-bottom,
  .maplibregl-popup-anchor-bottom-left,
  .maplibregl-popup-anchor-bottom-right {
    .maplibregl-popup-tip {
      border-top-color: var(--background-default-grey);
    }
  }

  .maplibregl-popup-anchor-left .maplibregl-popup-tip {
      border-right-color: var(--background-default-grey);
  }

  .maplibregl-popup-anchor-right .maplibregl-popup-tip {
      border-left-color: var(--background-default-grey);
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
    min-width: 340px;
    width: 400px;
    max-width: 25%;
    background-color: transparent;
  }

  & > * {
    pointer-events: auto;
  }

  & > *:not(.layer) {
    border-radius: 0.25rem 0.25rem 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
`

export const CartoMenuWrapper = styled.div.attrs({ className: 'layer' })``

// ---------------------------
// --- Map Legend & Config ---
// ---------------------------

export const MapParamsWrapper = styled.div.attrs({
  className: 'layer',
})<{ $isHidden?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: .5em;
  padding: 1rem 0;
  position: relative;
  z-index: 1;
  transition: transform 0.5s ease, opacity 0.5s ease, z-index 0s ease 0.5s;

  ${({ $isHidden }) => $isHidden && css`
    transform: translateY(-100%);
    opacity: 0;
    z-index: -1;
    transition: transform 0.5s ease, opacity 0.5s ease, z-index 0s ease 0s;
  `}

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: space-between;
  }
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
    ${({ $isActive }) => $isActive ? css`0rem 0rem 1px 2px var(--background-raised-grey) inset` : css`0rem 0rem 0px 0px var(--background-raised-grey) inset`},
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
