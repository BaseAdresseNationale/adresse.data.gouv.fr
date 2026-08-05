'use client'

import styled from 'styled-components'

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;

    article {
      width: 65%;
    }
`

export const TagsWrapper = styled.ul`
    line-height: 3rem;
    margin: 0.5rem 0 1.5rem;
    padding: 0;
`

export const TagWrapper = styled.li`
  display: inline;
  margin-right: 0.5rem;
`
