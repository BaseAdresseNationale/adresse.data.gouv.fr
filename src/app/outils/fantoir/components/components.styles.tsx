'use client'

import styled, { css } from 'styled-components'

export const StyledLine = styled.div<{ $isOpen?: boolean, $isCanceled?: boolean }>`
  display: flex;
  padding: .5em;
  font-size: 14px;
  color: var(--text-default-grey);
  border-top: 1px solid rgba(0, 0, 0, 0);
  border-left: 1px solid var(--border-default-grey);
  border-right: 1px solid var(--border-default-grey);
  border-bottom: 1px solid var(--border-default-grey);

  ${({ $isOpen }) => $isOpen && css`
    color: var(--text-default-grey);
    background-color: var(--background-contrast-grey);
  `}

  transition: background-color .3s ease, color .3s ease;

  ${({ $isCanceled }) => $isCanceled && css`
    color: var(--text-default-grey);
    background-color: var(--background-contrast-error);
  `}

  &:hover {
    color: var(--text-default-grey);
    background-color: var(--background-contrast-grey-hover);

    ${({ $isCanceled }) => $isCanceled && css`
      background-color: var(--background-contrast-error-hover);
    `}
  }
`

export const StyledInfos = styled.div`
  flex: 1;
  text-align: center;
`
