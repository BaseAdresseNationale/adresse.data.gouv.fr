'use client'

import styled from 'styled-components'

export const MapSearchResultsWrapper = styled.div`
  min-height: 200%;
  padding: 8.5rem 1rem 1rem;
  background-color: var(--background-default-grey);
  scroll-snap-align: start;
  pointer-events: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    min-height: 100%;
    margin-top: 0;
  }
`

export const ActionWrapper = styled.div`
  display: block;
`

export const ActionList = styled.ul`
  display: block;
  padding: 0;
  margin: 0;
  list-style: none;
`

export const ItemAction = styled.li`
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.5rem;
`

export const ActionLabel = styled.span`
  display: flex;
  margin-left: 0.5rem;
  max-width: 0;
  overflow: hidden;
`

export const IconButton = styled.button.attrs({
  className: 'Mui-Not-DSFR',
})`
  border: 0.15rem solid currentColor;
  padding: 0.5rem;
  border-radius: 2rem;
  background-color: red;
  box-shadow: 0rem 0.3rem 0.7rem -0.25rem rgba(0, 0, 0, .5);
  margin: 0 0.5rem 0 0;
  color: #fff;

  &:hover {
    background-color: blue;
  }
`
