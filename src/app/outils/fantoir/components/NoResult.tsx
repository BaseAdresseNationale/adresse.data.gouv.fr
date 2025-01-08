'use client'

import styled from 'styled-components'

const NoResultStyled = styled.div`
  padding: 1em;
  font-size: 1.2em;
  text-align: center;
`

function NoResult({ isLoading }: { isLoading: boolean }) {
  return (
    <NoResultStyled>
      <i>{!isLoading ? 'Aucun résultat' : 'Chargement'}</i>
    </NoResultStyled>
  )
}

export default NoResult
