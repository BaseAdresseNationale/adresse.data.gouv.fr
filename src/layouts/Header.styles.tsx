'use client'

import styled from 'styled-components'

export const CornerRibbons = styled.div.attrs<{
  $positionHorizontal?: 'left' | 'right'
  $positionVertical?: 'top' | 'bottom'
  $color?: string

}>(({ $positionHorizontal = 'top', $positionVertical = 'right' }) => ({
  className: `ri-meteor-fill cr-${$positionVertical} cr-${$positionHorizontal}`,
}))`
  width: 200px;
  padding: .75rem;
  text-align: center;
  color: #f0f0f0;
  font-size: 1rem;
  font-weight: bold;

  position: fixed;
  z-index: 1000;

  opacity: 0.65;
  pointer-events: none;

  ${({ $color = 'var(--background-action-high-red-marianne)' }) => `background-color: ${$color};`}

  &.cr-top    { top: 25px; }
  &.cr-bottom { bottom: 25px; }
  &.cr-left   { left: -50px; }
  &.cr-right  { right: -50px; }

  &.cr-top.cr-left,
  &.cr-bottom.cr-right {
    transform: rotate(-45deg);
  }

  &.cr-top.cr-right,
  &.cr-bottom.cr-left {
    transform: rotate(45deg);
  }
`
