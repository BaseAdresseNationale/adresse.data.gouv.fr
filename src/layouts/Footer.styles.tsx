'use client'

import styled, { css, createGlobalStyle } from 'styled-components'

function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

const footerDisplayButtonHeight = '2.5rem'
const transitionDelaiOnOpen = '0.75s'
const transitionDelaiOnClose = '0.35s'

const followIcons = {
  Bluesky: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 11.3884C11.0942 9.62673 8.62833 6.34423 6.335 4.7259C4.13833 3.17506 3.30083 3.4434 2.75167 3.69256C2.11583 3.9784 2 4.95506 2 5.52839C2 6.10339 2.315 10.2367 2.52 10.9276C3.19917 13.2076 5.61417 13.9776 7.83917 13.7309C4.57917 14.2142 1.68333 15.4017 5.48083 19.6292C9.65833 23.9542 11.2058 18.7017 12 16.0392C12.7942 18.7017 13.7083 23.7651 18.4442 19.6292C22 16.0392 19.4208 14.2142 16.1608 13.7309C18.3858 13.9784 20.8008 13.2076 21.48 10.9276C21.685 10.2376 22 6.10256 22 5.52923C22 4.95423 21.8842 3.97839 21.2483 3.6909C20.6992 3.44256 19.8617 3.17423 17.665 4.72423C15.3717 6.34506 12.9058 9.62756 12 11.3884Z'%3E%3C/path%3E%3C/svg%3E")`,
  RSS: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M3 3C12.9411 3 21 11.0589 21 21H18C18 12.7157 11.2843 6 3 6V3ZM3 10C9.07513 10 14 14.9249 14 21H11C11 16.5817 7.41828 13 3 13V10ZM3 17C5.20914 17 7 18.7909 7 21H3V17Z'%3E%3C/path%3E%3C/svg%3E")`,
}

const followIconsEntries = Object.entries(followIcons)
const followIconsStyles = css`${
  followIconsEntries.map(([name, url]) => `
      .fr-follow .fr-btn--${toKebabCase(name)}:before {
        -webkit-mask-image: ${url};
        mask-image: ${url};
      }
    `
  ).join('\n')
}`

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
      transform: translateY(100%);

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

  ${followIconsStyles}
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
