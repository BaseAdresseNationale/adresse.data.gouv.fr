'use client'

import { useState } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div<{ $isReadOnly?: boolean }>`
    div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        font-size: 2rem;
        gap: 0.5rem;
        margin-top: 0.5rem;
        i {
            color: #f1bf42;
            cursor: ${({ $isReadOnly }) => $isReadOnly ? 'inherit' : 'pointer'};
        }
    }
`

interface StarRatingInputProps {
  onChange?: (value: number) => void
  value: number
  label?: string
  style?: React.CSSProperties
}

export default function StarRatingInput({ onChange, value, label, style }: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const starValue = hoverValue || value

  return (
    <StyledWrapper style={style} $isReadOnly={!onChange}>
      {label && (
        <label>
          {label}
        </label>
      )}
      <div>
        {[1, 2, 3, 4, 5].map((star) => {
          const delta = starValue - star
          let icon = starValue >= star ? 'ri-star-fill' : 'ri-star-line'
          if (delta < 0) {
            const absDelta = Math.abs(delta)
            if (absDelta >= 0.8) {
              icon = 'ri-star-line'
            }
            else if (absDelta >= 0.3) {
              icon = 'ri-star-half-line'
            }
          }
          return (
            <i
              className={icon}
              key={star}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => onChange && setHoverValue(star)}
              onMouseLeave={() => onChange && setHoverValue(0)}
            />
          )
        })}
      </div>
    </StyledWrapper>
  )
}
