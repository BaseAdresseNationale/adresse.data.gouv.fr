'use client'

import styled, { css, keyframes } from 'styled-components'

export const LoaderWrapper = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  max-height: 100%;
  opacity: 1;
  transform: translate(0, 0);
  transition: transform 0.4s ease 0.3s, opacity 0.6s ease 0.3s, max-height 0.3s ease;

  ${({ $isVisible }) => $isVisible && css`
    max-height: 0;
    opacity: 0;
    transform: translate(calc(-100% - 2rem), 0);
    transition: transform 0.4s ease, opacity 0.6s ease, max-height 0.3s ease 0.6s;
  `}
`

export const LoaderDialog = styled.dialog`
  position: relative;
  z-index: 2310;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: self-start;
  gap: 1rem;
  width: calc(100% - 1rem - 1rem);
  margin: 1rem 1rem 0;
  padding: 1rem;
  border: 0 none;
  border-bottom: 3px solid var(--border-plain-info);
  border-radius: .25rem .25rem 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  pointer-events: auto;
`

const rotate = keyframes`
    from { transform: rotate(0deg) }
    to { transform: rotate(360deg) }
`

export const LoaderIconWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0;
  transition: opacity 0.25s ease .25s;

  &.loading {
    opacity: 1;
    transition: opacity 0.25s ease;
  }

  .loader-icon {
    color: var(--text-default-info);
    animation:${rotate} 2s infinite;
    animation-timing-function: cubic-bezier(0.25, 0.5, 0.25, 0.5);
  }
`

export const LoaderMessage = styled.div`
  flex: 1;
  font-weight: 600;
`
