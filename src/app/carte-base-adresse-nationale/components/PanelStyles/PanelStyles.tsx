'use client'

import styled, { css } from 'styled-components'
import Image from 'next/image'

const flagSize = '1.05em'

export const mainInfo = css`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.25;
`
export const secondaryInfo = css`
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.25;
`
export const tertiaryInfo = css`
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5;
`

// ---------------
// MAIN INFO -----
// ---------------

export const PanelNumberAndMicroTopoLabel = styled.span`
  ${mainInfo}
  display: block;
  margin-bottom: 0.5rem;
`

// -------------------
// TERTIARY INFO -----
// -------------------

export const PanelMicroTopoLabelAlt = styled.span`
  ${tertiaryInfo}
  display: block;
`

export const PanelMicroTopoLabelAltFlag = styled(Image).attrs({
  width: 24,
  height: 24,
})`
  width: ${flagSize};
  height: ${flagSize};
  border-radius: 50%;
  vertical-align: -0.1em;
  border: 1px solid #fff;
  box-shadow: 0 0 0.3rem -0.1rem rgba(0, 0, 0, 0.7);
`

export const PanelAddressPostCode = styled.span`
  ${tertiaryInfo}
  display: block;
`

// --------------------
// SECONDARY INFO -----
// --------------------

export const PanelDistrictLabelPrefix = styled.span`
  ${secondaryInfo}
  display: block;
  font-size: .8em;
  font-weight: 300;
`

export const PanelDistrictLabel = styled.span<{ $historique?: boolean }>`
  display: block;
  ${secondaryInfo}
  ${({ $historique }) => $historique
    ? css`
      ${tertiaryInfo}
        font-weight: 300;
      `
    : css`
        font-weight: 600;
      `
    };
`
