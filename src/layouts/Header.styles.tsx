'use client'

import styled, { css } from 'styled-components'

export const HeaderWrapper = styled.header<{ $size?: 'default' | 'small' }>`
  position: relative;
  z-index: 990;

  .dsfr-notice {
      ${({ $size }) => $size === 'small' ? css`position: absolute;` : css`position: static;`}
      z-index: 1;
      width: 100%;
      bottom: 0;
      transition: transform .4s ease;
      transform: translateY(0);
    }




  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    .header-spacer {
      position: relative;
      transition: height .3s ease;

      ${({ $size }) => $size === 'small' && css`z-index: 990;`}
      ${({ $size }) => $size === 'small'
          ? css`height: 7.4rem;`
          : css`height: 14.4rem;`
      }
    }

    .dsfr-notice {
      position: absolute;
    }

    .dsfr-header {
      position: absolute;
      top: 0;
      z-index: 990;

      .fr-header__body {
        margin-bottom: 0;
        ${({ $size }) => $size === 'small' && css`margin-bottom: -3.5rem;`}
        background: var(--background-raised-grey);
        transition: margin-bottom .3s ease;
      }

      .fr-header__menu {
        position: relative;
        z-index: -1;
        max-height: 3.5rem;
      }
    }

    ${({ $size }) => $size === 'small' && css`
      &:hover,
      &:focus-within {
        .dsfr-header {
          .fr-header__body {
            margin-bottom: 0;
          }
        }

        .dsfr-notice {
          transform: translateY(calc(100% + 3.4rem));
        }
      }
    `}
  }
`

export const CornerRibbons = styled.div.attrs<{
  $positionHorizontal?: 'left' | 'right'
  $positionVertical?: 'top' | 'bottom'
  $color?: string

}>(({ $positionHorizontal = 'top', $positionVertical = 'right' }) => ({
  className: `cr-${$positionVertical} cr-${$positionHorizontal}`,
}))`
  position: fixed;
  z-index: 991;
  width: 200px;
  padding: .75rem;
  color: #f0f0f0;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  opacity: 0.65;
  pointer-events: none;

  ${({ $color = 'var(--background-action-high-red-marianne)' }) => `background-color: ${$color};`}

  &::before {
    content: 'β';
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 1.5em;
    height: 1.5em;
    padding: 0 0.5em;
    margin: 0 0.25em;
    font-size: 1rem;
    font-weight: bold;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
    background-color: #f0f0f0;
    border-radius: 1.5em;

    ${({ $color = 'var(--background-action-high-red-marianne)' }) => `color: ${$color};`}

  }

  &.cr-top    { top: 25px; }
  &.cr-bottom { bottom: 25px; }
  &.cr-left   { left: -50px; }
  &.cr-right  { right: -50px; }

  &.cr-top.cr-left,
  &.cr-bottom.cr-right {
    transform: rotate(-45deg);
  }

  &.cr-top.cr-right,
  &.cr-bottom.cr-left {
    transform: rotate(45deg);
  }
`
