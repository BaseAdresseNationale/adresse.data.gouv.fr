'use client'

import Button from '@codegouvfr/react-dsfr/Button'
import styled from 'styled-components'

export interface DownloadCardProps {
  title: string
  text: string
  fileDescription: string
  downloadlink: string
}

const StyledWrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #dddddd;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  > .file-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    legend {
      color: #666666;
    }
  }
`

export default function DownloadCard({
  title,
  text,
  downloadlink,
  fileDescription,
}: DownloadCardProps) {
  return (
    <StyledWrapper>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <div className="file-wrapper">
        <legend>{fileDescription}</legend>
        <Button
          iconId="fr-icon-download-line"
          onClick={() => window.open(downloadlink, '_blank')}
          priority="tertiary no outline"
          title="Télécharger"
        />
      </div>
    </StyledWrapper>
  )
}
