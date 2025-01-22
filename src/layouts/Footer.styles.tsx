'use client'

import styled, { css } from 'styled-components'

const footerDisplayButtonHeight = '2.5rem'
const transitionDelaiOnOpen = '0.75s'
const transitionDelaiOnClose = '0.35s'

export const FooterWrapper = styled.footer<{ $isHidden: boolean, $isEventReady: boolean }>`
  display: block;
  width: 100%;

  ${({ $isHidden, $isEventReady }) => $isHidden
      ? css`
      position: fixed;
      z-index: 5;
      max-height: 75dvh;
      overflow: visible;
      bottom: 0;
      transform: translateY(calc(100% - ${footerDisplayButtonHeight}));

      .footer-display-button {
        display: flex;
      }

      ${$isEventReady && css`
        transition: transform 0.3s ease ${transitionDelaiOnClose}, z-index 0s ease ${transitionDelaiOnClose};

        &:hover,
        &:focus-within {
          overflow: auto;
          z-index: 900;
          transform: translateY(0);
          transition: transform 0.3s ease ${transitionDelaiOnOpen}, z-index 0s ease ${transitionDelaiOnOpen};

          .footer-display-button {
            max-height: 0;
            opacity: 0;
            pointer-events: none;

            &::before {
              transform: rotate(180deg);
            }
          }
        }
      `}
    `
      : css`position: static;`
  }
`

export const FooterDisplayButton = styled.button.attrs({
  className: 'footer-display-button',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${footerDisplayButtonHeight};
  max-height: ${footerDisplayButtonHeight};
  background-color: var(--background-raised-grey);
  font-size: 0.8rem;
  line-height: 1.5;
  border: none;
  opacity: 0.1;
  cursor: pointer;
  transition: max-height 0.15s ease 0s,
    opacity 0.15s ease 0s,
    transform 0.15s ease ${transitionDelaiOnClose};

  &::before {
    content: '▲';
    display: inline-block;
    margin-right: 0.5rem;
    transition: opacity 0.15s ease ${transitionDelaiOnOpen}, transform 0.15s ease ${transitionDelaiOnOpen};
  }

  display: none;
`

export const FooterBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: var(--background-raised-grey);
  width: 100%;
`
