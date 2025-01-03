'use client'

import styled from 'styled-components'

import { mainInfo } from '../PanelStyles'

export const DistrictHeaderWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1.25rem;
    font-size: 1rem;
`

export const DistrictLogoWrapper = styled.div`
  position: relative;
`

export const DistrictLogoBadge = styled.div.attrs({ className: 'ri-award-fill' })`
  --color-gradient-from: var(--background-contrast-success-hover);
  --color-gradient-to: var(--background-contrast-success);
  --color: var(--background-contrast-success-active);
  --color-contrast: var(--text-default-success);

  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(20%,-5%);
  background-color: var(--background-default-grey);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: linear-gradient(to bottom, var(--color-gradient-from), var(--color-gradient-to));
    border: 1px solid var(--color-contrast);
    box-shadow: 0 0 0 2px var(--background-default-grey),
      0 0 0 4px var(--color-contrast);

  &::before {
    font-size: 1rem;
    color: var(--color);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background-color: var(--color-contrast);
    opacity: 0.75;
  }
`

export const DistrictLabelWrapper = styled.div``

export const DistrictLabelPrefix = styled.span`
  display: block;
  font-size: .8em;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 0.25rem;
`

export const DistrictLabel = styled.span`
  ${mainInfo}
  display: block;
  margin-bottom: 0.5rem;
  line-height: 1;
`

export const DistrictLabelCode = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9em;
  font-weight: 700;
`
