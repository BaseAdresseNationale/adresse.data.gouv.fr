import styled from 'styled-components'

export const SharingDefList = styled.dl`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem 0.5rem;
  margin: 0;
  padding: 0;

  & > dt {
    flex: 100%;
    font-size: 0.85em;
  }

  & > dd {
    display: inline;
    margin: 0;
    padding: 0;
  }
`
