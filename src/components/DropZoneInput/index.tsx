import Alert from '@codegouvfr/react-dsfr/Alert'
import { useState } from 'react'
import Dropzone, { Accept, FileRejection } from 'react-dropzone'
import styled from 'styled-components'

type DropZoneInputProps = {
  onChange: (file?: File) => void
  label: string
  hint?: string
  accept?: Accept
  maxSize?: number
}

const StyledDropZoneInput = styled.div<{ $hover: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  > .dropzone {
    max-width: 600px;
    max-height: 300px;
    border: ${({ $hover, theme }) => $hover ? `2px dashed ${theme.colors.primary.main}` : '2px dashed #c8c8c8'};

    &:hover {
      border: 2px dashed ${({ theme }) => theme.colors.primary.main};
    }

    .dropzone {
      padding: 20px;
      text-align: center;
      cursor: pointer;

      .fr-hint-text {
        margin-top: 1rem;
      }
    }
  }

`

export default function DropZoneInput({ onChange, label, hint, accept, maxSize }: DropZoneInputProps) {
  const [hover, setHover] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleFileChange = (acceptedFiles: File[]) => {
    setHover(false)
    setErrorMessage(undefined)
    if (acceptedFiles.length === 0) {
      onChange(undefined)
    }
    else {
      onChange(acceptedFiles[0])
    }
  }

  const handleError = (rejections: FileRejection[]) => {
    setHover(false)
    setErrorMessage(rejections[0].errors[0].message)
  }

  return (
    <StyledDropZoneInput $hover={hover}>
      <div className="dropzone">
        <Dropzone
          onDropAccepted={handleFileChange}
          onDropRejected={handleError}
          onDragEnter={() => setHover(true)}
          onDragLeave={() => setHover(false)}
          accept={accept}
          maxSize={maxSize}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
              <div>
                <p>{label}</p>
                <span className="fr-icon-file-line" aria-hidden="true" />
                {hint && <span className="fr-hint-text">{hint}</span>}
              </div>
            </div>
          )}
        </Dropzone>
      </div>
      {errorMessage && (
        <Alert
          closable
          onClose={() => setErrorMessage(undefined)}
          style={{ marginTop: '1rem' }}
          title="Erreur"
          description={errorMessage}
          severity="error"
        />
      )}
    </StyledDropZoneInput>
  )
}
