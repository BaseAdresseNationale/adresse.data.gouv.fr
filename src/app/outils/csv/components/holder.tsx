'use client'

import { useState } from 'react'
import Dropzone from 'react-dropzone'

import Loader from '@/components/Loader/index'
import theme from '@/theme/theme'

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
                          <p>React-Feather Icon </p>
                        )}
                  </div>
                )
              : placeholder}
            </div>

            <style jsx>{`
              .dropzone {
                display: flex;
                flex-flow: column;
                justify-content: center;
                width: 100%;
                border: 1px dashed #ccc;
                height: 200px;
                text-align: center;
                cursor: pointer;
                border-radius: 4px;
              }

              .dropzone:hover {
                background-color: #ebeff3;
              }

              .dropzone.file {
                display: flex;
                flex-flow: column;
                height: auto;
                border: none;
              }

              .file-container {
                width: 100%;
              }

              .file-sumup {
                display: flex;
                align-items: center;
                justify-content: space-between;
                text-align: left;
              }

              .file-details {
                display: flex;
                align-items: center;
              }

              .file-infos {
                border-left: 3px solid ${theme.colors.primary};
                margin-left: 5px;
                padding: 0 5px;
              }

              .name {
                font-weight: bolder;
              }

              .size {
                font-style: italic;
                font-size: 14px;
              }

              .active {
                background-color: #ebeff3;
              }

              .loading {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-style: italic;
              }
              .loading span {
                margin-left: 1em;
              }
            `}
            </style>
          </div>
        )
      }}
    </Dropzone>
  )
}
