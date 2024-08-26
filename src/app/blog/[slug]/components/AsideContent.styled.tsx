'use client'

import styled from 'styled-components'

export const AsideLinkList = styled.ul`
  padding: 0;
  margin: 0 0 1.5rem;
  list-style: none;
  display: flex;
  flex-direction: column;

  li {
    margin-bottom: 0.25rem;
  }
`

export const AsideFollowList = styled.ul`
  padding: 0;
  margin: 0 0 1.5rem;
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  li {
    flex: 50%;
    margin-bottom: 0.25rem;
  }
`
