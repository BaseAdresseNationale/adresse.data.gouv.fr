'use client'

import styled, { css } from 'styled-components'

export const LegendWrapper = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  max-height: 100%;
  opacity: 1;
  transform: translate(0, 0);
  box-shadow: 0 0 .75rem var(--shadow-color);
  transition: transform 0.3s ease 0.3s,
    opacity 0.6s ease 0.3s,
    box-shadow 0.6s ease 0.3s,
    max-height 0.1s ease;

  ${({ $isVisible }) => !$isVisible && css`
    max-height: 0;
    opacity: 0;
    transform: translate(calc(-100% - 2rem), 0);
    box-shadow: 0 0 .75rem var(--shadow-color);
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
  box-shadow: 0 0 1px , 0 0 10px var(--shadow-color);
  pointer-events: auto;
`

export const LegendMessage = styled.div`
  flex: 1;
  font-weight: 600;
`
