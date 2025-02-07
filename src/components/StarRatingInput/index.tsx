'use client'

import { useState } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
    margin-bottom: 1rem;
    div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        font-size: 2rem;
        gap: 0.5rem;
        margin-top: 0.5rem;
        i {
            color: yellow;
        }
    }
`

interface StarRatingInputProps {
  onChange: (value: number) => void
  value: number
  readOnly?: boolean
  label: string
}

export default function StarRatingInput({ onChange, value, readOnly, label }: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const starValue = hoverValue || value

  return (
    <StyledWrapper>
      <label>
        {label}
      </label>
      <div>
        {[1, 2, 3, 4, 5].map(star => (
          <i
            className={starValue >= star ? 'ri-star-fill' : 'ri-star-line'}
            key={star}
            onClick={() => !readOnly && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
          />
        ))}
      </div>
    </StyledWrapper>
  )
}
