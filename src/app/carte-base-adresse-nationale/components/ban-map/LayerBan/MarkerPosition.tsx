'use client'

import styled, { css } from 'styled-components'

import type { RuleSet } from 'styled-components'
import type { PositionAnchor } from 'maplibre-gl'

import { theme } from '../theme'
import { positionsConfigs } from '../layers'

interface PositionType {
  className: string
  style?: RuleSet<object>
  icon?: string
  iconPosition?: PositionAnchor
}

const defaultColor = positionsConfigs['inconnue'].color

export const positionTypes: Record<string, PositionType> = {
  'acces voie': {
    className: 'thoroughfare-access',
    style: css`
      --color-type: ${positionsConfigs?.['acces voie']?.color || defaultColor};
    `,
    icon: 'ri-map-pin-5-line',
    iconPosition: 'bottom',
  },
  'entrée': {
    className: 'entrance',
    style: css`
      --color-type: ${positionsConfigs?.['entrée']?.color || defaultColor};
    `,
    icon: 'ri-door-open-line',
    iconPosition: 'center',
  },
  'bâtiment': {
    className: 'building',
    style: css`
      --color-type: ${positionsConfigs?.['bâtiment']?.color || defaultColor};
    `,
    icon: 'ri-community-line',
    iconPosition: 'center',
  },
  'délivrance postale': {
    className: 'postal-delivery',
    style: css`
      --color-type: ${positionsConfigs?.['délivrance postale']?.color || defaultColor};
    `,
    icon: 'ri-mail-send-line',
    iconPosition: 'center',
  },
  'parcelle': {
    className: 'parcel',
    style: css`
      --color-type: ${positionsConfigs?.['parcelle']?.color || defaultColor};
    `,
    icon: 'ri-collage-line',
    iconPosition: 'center',
  },
  'service technique': {
    className: 'utility-service',
    style: css`
      --color-type: ${positionsConfigs?.['service technique']?.color || defaultColor};
    `,
    icon: 'ri-settings-5-line',
    iconPosition: 'center',
  },
  'cage d’escalier': {
    className: 'stairwell',
    style: css`
      --color-type: ${positionsConfigs?.['cage d’escalier']?.color || defaultColor};
    `,
    icon: 'ri-stairs-line',
    iconPosition: 'center',
  },
  'logement': {
    className: 'lodging',
    style: css`
      --color-type: ${positionsConfigs?.['logement']?.color || defaultColor};
    `,
    icon: 'ri-home-2-line',
    iconPosition: 'center',
  },
  'segment': {
    className: 'segment',
    style: css`
      --color-type: ${positionsConfigs?.['segment']?.color || defaultColor};
    `,
    icon: 'ri-puzzle-2-line',
    iconPosition: 'center',
  },
  'inconnue': {
    className: 'unknow',
    style: css`
      --color-type: ${positionsConfigs?.['inconnue']?.color || defaultColor};
    `,
    icon: 'ri-focus-line',
    iconPosition: 'center',
  },
}

interface MarkerPositionProps {
  $positionType: string
  $isMain?: boolean
  $isBal?: boolean
  $isCertified?: boolean
}

export const MarkerPosition = styled.i.attrs<MarkerPositionProps>(
  ({ $positionType, $isMain }) => ({
    className: `${positionTypes[$positionType]?.icon || 'ri-focus-line'} ${$isMain ? 'main-position' : ''}`,
  })
)<MarkerPositionProps>`
  --marker-icon-size: 1.1em;
  --size: calc(var(--marker-icon-size) + 0.5em);
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  color: ${defaultColor};
  color: var(--color-type);

  &:not(.main-position) {
    border: 0.15em solid var(--color-type);
    background-color: color-mix(in srgb, var(--color-type) 15%, rgba(255, 255, 255, 0.5) 50%);
  }

  &.main-position {
    ${({ $isBal, $isCertified }) => css`
      --color-source-data: ${$isBal ? theme.bal : theme.noBal};
      --color-is-certified: ${$isCertified ? theme.certified : theme.noCertified};
    `}
    --size: calc(var(--marker-icon-size) + 1.15em);
    border: 0.25em solid var(--color-is-certified);
    background-color: var(--color-source-data);
    color: #fff;
  }

  &::before {
    --icon-size: var(--marker-icon-size);
  }

  ${({ $positionType }) => positionTypes[$positionType]?.style || ''}
`
