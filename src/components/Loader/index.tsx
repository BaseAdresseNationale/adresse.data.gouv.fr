'use client'

import React from 'react'
import styled from 'styled-components'

const StyledLoader = styled.div<{ $size: number }>`
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2px solid var(--background-action-high-blue-france);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
`

interface LoaderProps {
  size?: number
  style?: React.CSSProperties
}

function Loader({ size = 24, style }: LoaderProps) {
  return <StyledLoader $size={size} style={style} />
}

export default Loader
