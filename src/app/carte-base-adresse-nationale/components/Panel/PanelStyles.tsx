'use client'

import styled, { css } from 'styled-components'
import Image from 'next/image'

const flagSize = '1.05em'

export const mainInfo = css`
  font-size: 2em;
  font-weight: 700;
  line-height: 1.25;
`
export const secondaryInfo = css`
  font-size: 1.25em;
  font-weight: 400;
  line-height: 1.25;
`
export const tertiaryInfo = css`
  font-size: 1em;
  font-weight: 300;
  line-height: 1.5;
`

// ----------------------
// HEADER MAIN INFO -----
// ----------------------

export const PanelNumberAndMicroTopoLabel = styled.span`
  ${mainInfo}
  display: block;
  margin-bottom: 0.25rem;
`

// --------------------------
// HEADER TERTIARY INFO -----
// --------------------------

export const PanelMicroTopoLabelAlt = styled.span`
  ${tertiaryInfo}
  font-size: 0.5em;
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

// ---------------------------
// HEADER SECONDARY INFO -----
// ---------------------------

export const PanelDistrictLabelPrefix = styled.span`
  ${secondaryInfo}
  display: block;
  font-size: .8em;
  font-weight: 300;
`

const PanelDistrictCogPrefix = styled.span`
  white-space: nowrap;

  &::before {
    content: 'COG ';
    font-size: 0.8em;
    letter-spacing: 0.05em;
  }
`

export const PanelDistrictLabel = styled.span.attrs<{ $cog?: string }>(({ $cog, children }) => (
  {
    children: $cog
      ? (<>{children} (<PanelDistrictCogPrefix>{$cog}</PanelDistrictCogPrefix>)</>)
      : children,
  }
))<{ $historique?: boolean, $separator?: string }>`
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
  display: block;

  &::after {
    ${({ $separator }) => $separator && css`content: '${$separator}';`}
  }
`

// ------------------
// BODY DETAILS -----
// ------------------

export const PanelDetailsWrapper = styled.ul`
  padding: 0;
  margin: 0 0 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
`

export const PanelDetailsItemStyle = styled.li`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.2em;

  b {
    font-weight: 500;
    font-size: 1.1em;
  }

  &.isSuccessful {
    color: var(--text-default-success);
  }

  &.isFailed {
    color: var(--text-label-red-marianne);
  }

  &.isFormal {
    color: var(--text-label-blue-france);
  }

  &.isIsolated {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  &::before {
    margin-right: 0.5em;
    width: 1.25em;
    height: 1.25em;
    vertical-align: -0.25rem;
  }
`

export const PanelDetailsItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const PanelDetailsItemValue = styled.pre`
  font-size: small;
  font-weight: 700;
  margin-bottom: 0.5rem;
  white-space: pre-line;
`
