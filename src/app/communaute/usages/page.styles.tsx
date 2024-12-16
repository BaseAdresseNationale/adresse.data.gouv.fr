'use client'

import styled from 'styled-components'

export const Filters = styled.div`

    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: start;
    gap: 1rem;
    margin-bottom: 2rem;
    
    .filter-search {
      flex: 1;
      min-width: 15em;
    }
`
export const TagsAndBadges = styled.div`
  .fr-tags-group > li {
    line-height: 1.3rem;
  }

  .fr-badge, .fr-tag {
    margin: 0.25rem;
  }
`

export const CenteredLink = styled.div`
    margin: 40px auto;
    display: flex;
    justify-content: center;
`
