'use client'

import styled from 'styled-components'

import { mainInfo, PanelHeaderWrapper } from '../Panel'

export const DistrictHeaderWrapper = styled(PanelHeaderWrapper)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.25rem;
`

export const DistrictLogoWrapper = styled.div`
  position: relative;

  img {
    max-width: 100%;
    width: auto;
    height: auto;
    height: 5em;
  }
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
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: linear-gradient(to bottom, var(--color-gradient-from), var(--color-gradient-to));
    border: 1px solid var(--color-contrast);
    box-shadow: 0 0 0 2px var(--background-default-grey),
      0 0 0 4px var(--color-contrast);

  &::before,
  &::after {
    --icon-size: 1.5em;
  }

  &::before {
    font-size: 1em;
    color: var(--color);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0.15em;
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
