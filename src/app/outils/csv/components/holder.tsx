'use client'

import { useState } from 'react'
import Dropzone from 'react-dropzone'

import Loader from '@/components/Loader/index'
import { HolderWrapper } from './holder.styles'

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1000
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / (k ** i)).toFixed(2)) + ' ' + sizes[i]
}

interface HolderParameters {
  file: File | null
  placeholder: string
  isLoading: boolean
  onDrop: (FileList: File[]) => void
}

export default function Holder({ file = null, placeholder, isLoading = false, onDrop }: HolderParameters) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Dropzone onDrop={onDrop} multiple={false}>
      {({ getRootProps, getInputProps, isDragActive }) => {
        const rootProps = getRootProps()
        const inputProps = getInputProps()

        return (
          <HolderWrapper>
            <div
              {...rootProps}
              className={`dropzone ${file ? 'file' : ''} ${isDragActive ? 'active' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <input {...inputProps} />
              <div>{!file && <p>Glisser le fichier</p>}</div>
              <div className="file-container">{file
                ? (
                    <div className="file-sumup">
                      <div className="file-details">
                        <div className="file-infos">
                          <div className="name">{file.name}</div>
                          <div className="size">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      {isLoading
                        ? (
                            <div className="loading">Chargement du fichier… <span><Loader aria-hidden="true" /></span></div>
                          )
                        : (
                            <span className="fr-icon-refresh-fill" aria-hidden="true" aria-label="Recharger le fichier" />
                          )}
                    </div>
                  )
                : placeholder}
              </div>
            </div>
          </HolderWrapper>
        )
      }}
    </Dropzone>
  )
}
