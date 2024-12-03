'use client'

import styled from 'styled-components'

export const AsideFooterWrapper = styled.div``

export const ActionWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const ActionList = styled.ul`
  display: block;
  padding: 0;
  margin: 0;
  list-style: none;
`

export const ActionMessage = styled.div`
  font-size: 0.8rem;
  font-weight: 300;
  line-height: 1.5;
  color: var(--text-default-grey);
  margin: 0.5em 1em;
  border-left: 1px solid;
  padding: 0 1em;
`
