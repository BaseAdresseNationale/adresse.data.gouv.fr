'use client'

import styled, { css } from 'styled-components'

export const LegendWrapper = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  max-height: 100%;
  opacity: 1;
  transform: translate(0, 0);
  box-shadow: 0 0 .75rem rgba(0,0,0,0.25),
    0 4rem 1.5rem 0rem rgba(255, 255, 255, 0.5),
    0 -4rem 1.5rem 0rem rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease 0.3s,
    opacity 0.6s ease 0.3s,
    box-shadow 0.6s ease 0.3s,
    max-height 0.1s ease;

  ${({ $isVisible }) => !$isVisible && css`
    max-height: 0;
    opacity: 0;
    transform: translate(calc(-100% - 2rem), 0);
    box-shadow: 0 0 .75rem rgba(0,0,0,0.25),
      0 0rem 0rem 0rem rgba(255, 255, 255, 0.5),
      0 0rem 0rem 0rem rgba(255, 255, 255, 0.5);
    transition: transform 0.3s ease,
      opacity 0.6s ease,
      box-shadow 0.6s ease,
      max-height 0.3s ease 0.6s;
  `}
`

export const LegendDialog = styled.dialog`
  position: relative;
  z-index: 2310;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: self-start;
  gap: 1rem;
  width: 100%;
  margin: 1rem 0;
  padding: 1rem;
  border: 0 none;
  border-bottom: 3px solid var(--border-plain-info);
  border-radius: .25rem .25rem 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  pointer-events: auto;
`

export const LegendMessage = styled.div`
  flex: 1;
  font-weight: 600;
`
