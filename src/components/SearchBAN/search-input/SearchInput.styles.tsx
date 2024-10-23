'use client'

import styled, { css, keyframes } from 'styled-components'

export const SearchComboboxWrapper = styled.div`
  position: relative;
`

export const SearchComboboxInputWrapper = styled.div`
  position: relative;
`

const rotate = keyframes`
    from { transform: rotate(0deg) }
    to { transform: rotate(360deg) }
`

export const SearchComboboxInputLoader = styled.div`
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  width: 2.5em;
  height: 2.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transform: translateX(-1.5em);
  transition: opacity 0.25s ease .25s;

  &.loading {
    opacity: 1;
    transition: opacity 0.25s ease;
  }

  .search-combobox-input-loader-icon {
    animation:${rotate} 2s infinite;
    animation-timing-function: cubic-bezier(0.25, 0.5, 0.25, 0.5);
  }
`

export const SearchComboboxDialog = styled.dialog`
  width: 100%;
  z-index: 10;
  padding: 0;
  border: none;
  overflow: visible;
`

export const SearchComboboxMenu = styled.ul`
  left: 0;
  right: 0;
  background: var(--background-default-grey);
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 0 7px -2px rgba(0, 0, 0, 0.75);
`

export const SearchComboboxMenuItem = styled.li<{ $isHighlighted?: boolean, $isSelected?: boolean }>`
  margin: 0;
  padding: 0;
  ${css`container-type: inline-size`};
  ${({ $isHighlighted }) => $isHighlighted && css`
    background-color: var(--text-default-info);
    color: white;
  `};
  ${({ $isSelected }) => $isSelected && css`
    border-left: 2px solid var(--text-default-info);
  `};
`
