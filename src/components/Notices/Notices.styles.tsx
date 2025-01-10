'use client'

import styled, { keyframes } from 'styled-components'

export const NoticeWrapper = styled.div`
  max-width: 100vw;
  overflow: hidden;
  position: relative;

  .fr-notice__title {
    position: static;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

`

const scrollText = keyframes`
  0% {
    transform: translateX(0%);
  }
  90% {
    transform: translateX(-100%);
  }
  95% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(0%);
  }
`

export const NoticeMessage = styled.span.attrs(({ children }) => ({ children: <span>{children}</span> }))`
  max-width: calc(100% - 2rem);
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: -1rem;
    bottom: -1rem;
    right: 2rem;
    width: 2rem;
    display: block;
    clear: both;
    background: linear-gradient(-90deg,var(--background-contrast-info) calc(100% - 1.5rem),transparent 100%);
    pointer-events: none;
  }

  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    top: -1rem;
    bottom: -1rem;
    left: 2rem;
    width: 2rem;
    display: block;
    clear: both;
    background: linear-gradient(90deg, var(--background-contrast-info) calc(100% - 1.5rem), transparent 100%);
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    &::after {
      width: calc(3rem);
    }
  }

  &:hover,
  &:focus {
    &::before{
      opacity: 1;
    }

    span {
      display: inline-block;
      animation-name: ${scrollText};
      animation-duration: 15s;
      animation-timing-function: linear;
      animation-delay: 0s;
      animation-iteration-count: infinite;
      animation-direction: normal;
    }
  }
`
