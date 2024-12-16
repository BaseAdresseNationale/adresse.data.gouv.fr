'use client'

import styled, { css, keyframes } from 'styled-components'

const loadingAnimation = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`

export const LoadingBar = styled.div<{ $isLoading: boolean }>`
  --loading-bar-size: 5px;
  --loading-bg-color: var(--background-action-high-blue-france);
  --loading-bg-color-strength: var(--background-default-grey);

  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-image: linear-gradient(
      90deg,
      var(--loading-bg-color) 0,
      var(--loading-bg-color) 18%,
      var(--loading-bg-color-strength) 20%,
      var(--loading-bg-color-strength) 50%,
      var(--loading-bg-color) 52%,
      var(--loading-bg-color)
    );
    background-size: 200% 100%;
    opacity: 0.6;
    animation: ${loadingAnimation} 4s infinite;
  }

  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 0;
  height: var(--loading-bar-size);
  background-color: var(--loading-bg-color);
  transform: translateY(calc(-1 * var(--loading-bar-size)));
  opacity: 0;
  transition: transform 0.3s ease,
    width 1.5s ease,
    opacity 0.3s ease;

  ${({ $isLoading }) => $isLoading && css`
    transform: translateY(0);
    width: 100%;
    opacity: 0.9;
  `}
`
