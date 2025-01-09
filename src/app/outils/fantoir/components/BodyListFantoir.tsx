'use client'

import ActionButtonLine from './ActionButtonLine'
import {
  StyledLine,
  StyledInfos,
} from './components.styles'

interface BodyListFantoirProps {
  contents: string[]
  onSelect: () => void
  isCanceled?: boolean
}

function BodyListFantoir({ contents, onSelect, isCanceled }: BodyListFantoirProps) {
  return (
    <ActionButtonLine
      label={`Accéder aux données de ${contents[0]}`}
      onClick={onSelect}
    >
      <StyledLine $isCanceled={isCanceled}>
        {contents.map((item, i) => (
          <StyledInfos key={i}>{item}</StyledInfos>
        ))}
      </StyledLine>
    </ActionButtonLine>
  )
}

export default BodyListFantoir
