'use client'

import styled from 'styled-components'
import Link from 'next/link'

const fileTypeIcons: { [key: string]: string } = {
  dir: 'fr-icon-folder-2-fill',
  pdf: 'fr-icon-file-pdf-line',
  json: 'ri-file-code-line',
  file: 'fr-icon-file-line',
  download: 'fr-icon-file-download-line',
  txt: 'fr-icon-file-text-line',
  md: 'fr-icon-file-text-line',
  gz: 'ri-file-zip-line',
  zip: 'ri-file-zip-line',
  tar: 'ri-file-zip-line',
  rar: 'ri-file-zip-line',
}

const getIcon = (fileType?: string) => fileType && fileTypeIcons[fileType] ? fileTypeIcons[fileType] : fileTypeIcons.download

export const ExplorerLink = styled(Link)`
  display: flex;
  text-decoration: none;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.3rem;
  border-radius: 0.25rem;
  padding: 0.1rem 0.25rem;

  &[href] {
    background: none;
    background-color: #cecece00;
    transition: background-color 0.25s ease-in-out;
  }
  &[href]:hover,
  &[href]:focus {
    background-color: #cecece33;
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 35em;
    flex-direction: row;
  }
`

export const ExplorerLinkLabel = styled.span.attrs<{ $fileType?: string }>(({ $fileType }) => ({
  className: `fr-link--icon-left ${getIcon($fileType)}`,
}))`
  display: inline;
  font-size: 1rem;
  line-height: 1.5rem;
  padding: 0 0;
  color: var(--text-action-high-blue-france);

  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex: 1;

  &.unknown-type {
    padding-left: 1.5em;
  }
`
export const ExplorerLinkLabelWrapper = styled.span`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
  }
`
export const ExplorerLinkLabelHuman = styled.span`
  padding-right: .5em;
  color: #777;

  &:first-letter {
    text-transform: uppercase;
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: .5em;
  }
`
export const ExplorerLinkLabelText = styled.span<{ $withHumanDateDirName: boolean }>`
  padding-right: .5em;
  text-decoration: underline;

  ${({ $withHumanDateDirName }) => $withHumanDateDirName && `
    display: inline-block;
    width: 7em;
  `}
`
export const ExplorerLinkLabelSize = styled.span`
  display: flex;
  align-self: flex-end;
  flex-wrap: nowrap;
  white-space: nowrap;
  align-items: end;
  line-height: 1em;
  padding-bottom: 0.2em;
  font-size: 0.8em;
  font-style: italic;
  color: #777;
`
export const ExplorerLinkDatetime = styled.span`
  display: flex;
  min-width: 5em;
  align-items: end;
  line-height: 1em;
  padding-bottom: 0.2em;
  font-size: 0.8em;
  color: #777;
  white-space: nowrap;
  gap: 0.5em;
`
export const ExplorerLinkDate = styled.span`
`
export const ExplorerLinkTime = styled.span`
  min-width: 4.2em;
`
