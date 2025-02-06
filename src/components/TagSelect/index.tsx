import styled from 'styled-components'
import { Tag } from '@codegouvfr/react-dsfr/Tag'
import { ReactNode } from 'react'

export interface TagSelectProps {
  value: string[]
  options: { label: ReactNode, value: string }[]
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
      {options.map(({ label, value: _value }) => (
        <Tag
          key={_value}
          nativeButtonProps={{
            onClick: () => {
              if (value.includes(_value)) {
                onChange(value.filter(t => t !== _value))
              }
              else {
                onChange([...value, _value])
              }
            },
          }}
          pressed={value.includes(_value)}
        >
          {label}
        </Tag>
      ))}
    </StyledWrapper>
  )
}
