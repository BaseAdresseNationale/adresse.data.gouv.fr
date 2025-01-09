'use client'

import styled, { css } from 'styled-components'

export const StyledVoieTags = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  padding: .5em;
  border-left: 1px solid var(--border-default-grey);
  border-right: 1px solid var(--border-default-grey);
  border-bottom: 1px solid var(--border-default-grey);
`

export const StyledVoieTag = styled.div<{ $isCanceled?: boolean }>`
  display: grid;
  justify-items: center;
  padding: .5em;
  margin: .5em;
  gap: .5em;
  border: 1px solid var(--border-default-grey);
  border-radius: .5em;

  ${({ $isCanceled }) => $isCanceled && css`
    color: var(--text-default-grey);
    background-color: var(--background-contrast-error);
    border-radius: .5em;
  `}

  & span {
    display: inline-flex;
    border-radius: 3.75em;
    background-color: var(--background-contrast-info-active);
    color: var(--text-default-info);
    font-size: .75em;
    line-height: 1;
    padding: .4em 1.2em;
    margin: .1em .5em;
  }
`
