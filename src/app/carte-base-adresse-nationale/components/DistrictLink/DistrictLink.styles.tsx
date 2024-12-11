'use client'

import styled from 'styled-components'
import Link from 'next/link'

export const DistrictLinkWrapper = styled.span`
  position: relative;
  font-size: 1em;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  line-height: 1.5;
  text-decoration: none;
`

export const DistrictName = styled.span`
  font-size: 1em;
`

export const DistrictLinkLabel = styled(Link).attrs({
  className: 'fr-link fr-link--icon-right fr-icon-arrow-right-line --force-DSFR-overload',
})`
  &[class]:is(.--force-DSFR-overload) {
    font-size: 1em;
    line-height: inherit;
    position: relative;
    z-index: 2;
    display: inline-block;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    will-change: max-height, opacity;
    transition: max-height .3s ease,
      opacity .3s ease;

    ${DistrictLinkWrapper}:hover &,
    ${DistrictLinkWrapper}:focus-within & {
      --underline-hover-width: var(--underline-max-width);  /* --force-DSFR-hover-link-style */
      max-height: 2em;
      opacity: 1;
    }

    a {
      font-size: 1em;
    }
  }
`
