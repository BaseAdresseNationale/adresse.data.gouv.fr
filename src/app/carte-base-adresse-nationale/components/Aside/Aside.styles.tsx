'use client'

import styled, { css } from 'styled-components'

export const AsideWrapper = styled.div<{
  $isOpen?: boolean
  $withTogglerButton: boolean
  $isVisible?: boolean
  $isTypeInfo?: boolean
}>`
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 9;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  pointer-events: none;

  &::before {
    ${({ $isTypeInfo }) => !$isTypeInfo && css`content: ''`};
    display: block;
    height: calc(100% - 2.5rem);
    scroll-snap-align: start;
    transition: height 0.5s ease;

    ${({ $isVisible }) => css`
      height: ${$isVisible ? 'calc(100% - 2.5rem)' : '100%'};
    `}
  }

  .body {
    height: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 0 .5rem -0.125rem rgba(0, 0, 0, 0.7);
    scroll-snap-align: start;

    ${({ $isTypeInfo }) => $isTypeInfo && css`
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 4rem;      `
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: row-reverse;
    min-width: 200px;
    width: calc(400px + 2rem);
    max-width: calc(25% + 2rem);
    overflow: hidden;
    transition: transform 0.5s ease;

    ${({ $withTogglerButton }) => $withTogglerButton
      ? css`
        width: calc(400px + 2rem);
        max-width: calc(25% + 2rem);
      `
      : css`
        width: 400px;
        max-width: 25%;
      `
    }

    ${({ $isOpen, $isVisible }) => css`
      transform: translate(${$isVisible && $isOpen ? '0' : 'calc(-100% + 2rem)'}, 0) translate(${$isVisible ? '0' : '-2rem'}, 0);
    `}

    &::before {
      content: none;
    }

    .body {
      justify-content: flex-start;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      scroll-snap-type: x mandatory;

      ${({ $isTypeInfo }) => $isTypeInfo && css`padding-top: 4rem;`};
    }
  }
`

export const AsideTogglerButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  max-height: 2.5rem;
  pointer-events: auto;

  &::after {
    content: '';
    height: 0.15rem;
    width: 85%;
    background: rgba(0, 0, 0, 0);
    box-shadow: 0rem 0.1rem 0.2rem -0.05rem rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 0.2rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    position: sticky;
    top: 0;
    width: 2rem;
    max-height: none;
    height: 100%;
    border-radius: 0 0.5rem 0.5rem 0;

    &::after {
      left: -0.2rem;
      bottom: auto;
      width: 0.15rem;
      height: 100%;
      max-height: 52%;
      box-shadow: -0.1rem 0rem 0.2rem -0.05rem rgba(0, 0, 0, 0.5);
    }
  }
`

export const AsideWrapperTogglerButton = styled.button.attrs<{ $isOpen: boolean }>(
  ({ $isOpen, className }) => ({
    'type': 'button',
    'aria-label': 'Open/Close',
    'className': `${className} ${$isOpen ? 'open' : ''}`,
  })
)<{ $isOpen: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  width: 100%;
  height: 100%;
  color: var(--text-mention-grey);
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: var(--background-default-grey);
  background-image: linear-gradient(to top, transparent, var(--hover-tint));
  background-size: 1px 100%;
  background-position: 0 -3rem;
  background-repeat: repeat-x;
  transform: rotateX(0deg) rotateY(0deg);
  transition: background 0.5s ease, transform 0.5s ease;

  &.md {
    display: none;
  }

  &.sm {
    display: block;
  }

  &.open::before {
    transform: rotateX(180deg) rotateY(0deg);
  }

  button&:not(:disabled):hover {
    background-color: var(--background-default-grey);
    background-position: 0 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: calc(100% - 0.5rem);
    max-height: 60%;
    margin-right: 0.5rem;
    border-radius: 0 0.5rem 0.5rem 0;
    background-image: linear-gradient(to right, transparent, var(--hover-tint));
    background-size: 100% 1px;
    background-position: 2rem 0;
    background-repeat: repeat-y;
    box-shadow: 0.3rem 0rem 0.3rem -0.35rem rgba(0, 0, 0, 0.7);

    &.md {
      display: block;
    }

    &.sm {
      display: none;
    }

    &.open::before {
      transform: rotateX(0deg) rotateY(180deg);
    }
  }
`