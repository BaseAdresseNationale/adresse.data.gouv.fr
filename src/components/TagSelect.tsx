import styled from 'styled-components'
import { Tag } from '@codegouvfr/react-dsfr/Tag'

export interface TagSelectProps {
  value: string[]
  options: string[]
  onChange: (value: string[]) => void
}

const StyledWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;

    > button {
        margin-right: 1rem;
        margin-bottom: 1rem;
    }
`

export default function TagSelect({ options, value, onChange }: TagSelectProps) {
  return (
    <StyledWrapper>
      {options.map(tag => (
        <Tag
          key={tag}
          nativeButtonProps={{
            onClick: () => {
              if (value.includes(tag)) {
                onChange(value.filter(t => t !== tag))
              }
              else {
                onChange([...value, tag])
              }
            },
          }}
          pressed={value.includes(tag)}
        >
          {tag}
        </Tag>
      ))}
    </StyledWrapper>
  )
}
