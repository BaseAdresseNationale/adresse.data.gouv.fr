'use client'

import styled, { css } from 'styled-components'

interface DrawControlProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export const ControlGroupStyle = styled.div.attrs({
  className: 'maplibregl-ctrl-group maplibregl-ctrl',
})<{ $positionH?: string, $positionV?: string }>`
  position: absolute;
  box-shadow: none;
  border: 0px solid transparent;
  z-index: 2;
  ${({ $positionV }) => $positionV && $positionV === 'bottom' ? css`bottom: 8.5rem;` : css`top: 0.5rem;`}
  ${({ $positionH }) => $positionH && $positionH === 'left' ? css`left: 0.6rem;` : css`right: 0.6rem;`}
  `

interface ControlGroupProps {
  $position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  children: React.ReactNode
}

export const ControlGroup = ({ $position, ...props }: ControlGroupProps) => {
  const [$positionV, $positionH] = $position?.split('-') || []
  return (
    <ControlGroupStyle $positionH={$positionH} $positionV={$positionV} {...props} />
  )
}
