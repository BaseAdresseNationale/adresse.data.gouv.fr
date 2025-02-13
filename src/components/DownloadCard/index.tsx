'use client'

import Button from '@codegouvfr/react-dsfr/Button'
import { useState } from 'react'
import styled from 'styled-components'
import Loader from '../Loader'

export interface DownloadCardProps {
  title: string
  text?: React.ReactNode
  fileDescription: string
  downloadlink?: string
  onDownloadStart?: (() => Promise<void>) | (() => void)
  style?: React.CSSProperties
}

const StyledWrapper = styled.div`
  background-color: light-dark(white, var(--background-default-grey));
  border: 1px solid light-dark(#dddddd, var(--border-default-grey));

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  > .file-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    legend {
      color: light-dark(#666666, white);
    }
  }
`

export default function DownloadCard({
  title,
  text,
  downloadlink,
  fileDescription,
  onDownloadStart,
  style,
}: DownloadCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleClick = async () => {
    setIsDownloading(true)

    try {
      if (onDownloadStart) {
        await onDownloadStart()
      }
      if (downloadlink) {
        window.open(downloadlink, '_blank')
      }
    }
    catch (e) {
      console.error('Error while downloading file', e)
    }
    finally {
      setIsDownloading(false)
    }
  }

  return (
    <StyledWrapper style={style}>
      <div>
        <h3>{title}</h3>
        {text}
      </div>
      <div className="file-wrapper">
        <legend>{fileDescription}</legend>
        {!isDownloading
          ? (
              <Button
                iconId="fr-icon-download-line"
                onClick={handleClick}
                priority="tertiary no outline"
                title="Télécharger"
              />
            )
          : <div style={{ padding: '8px' }}><Loader /></div>}
      </div>
    </StyledWrapper>
  )
}
