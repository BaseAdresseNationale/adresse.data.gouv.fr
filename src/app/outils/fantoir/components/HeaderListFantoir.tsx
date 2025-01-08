import styled from 'styled-components'

const StyledTitle = styled.div`
  background-color: var(--background-action-high-blue-france);
  color: var(--text-inverted-grey);
  display: flex;
  padding: .5em;
  border-top: 1px solid var(--border-default-grey);
  border-left: 1px solid var(--border-default-grey);
  border-right: 1px solid var(--border-default-grey);
`

const StyledInfos = styled.div`
  flex: 1;
  text-align: center;
`

const StyledMargin = styled.div`
  width: 35px;
`

interface HeaderListFantoirProps {
  headers: string[]
  hasToggleContent?: boolean
}

function HeaderListFantoir({ headers, hasToggleContent }: HeaderListFantoirProps) {
  return (
    <StyledTitle>
      {headers.map(header => (
        <StyledInfos key={header}>{header}</StyledInfos>
      ))}
      {hasToggleContent && (
        <StyledMargin />
      )}
    </StyledTitle>
  )
}

export default HeaderListFantoir
