import {useState} from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import {Plus, FileText, RefreshCcw} from 'react-feather'

import Loader from '@/components/loader'

function formatFileSize(bytes) {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1000
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / (k ** i)).toFixed(2)) + ' ' + sizes[i]
}

function Holder({file, placeholder, isLoading, onDrop}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Dropzone onDrop={onDrop} multiple={false}>
      {({getRootProps, getInputProps, isDragActive}) => {
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
            <div>{!file && <Plus size={72} />}</div>
            <div className='file-container'>{file ? (
              <div className='file-sumup'>
                <div className='file-details'>
                  <FileText size={42} />
                  <div>
                    <div>{file.name}</div>
                    <div>{formatFileSize(file.size)}</div>
                  </div>
                </div>
                {isLoading ? (
                  <div className='loading'>Chargement du fichier… <span><Loader /></span></div>
                ) : (
                  <RefreshCcw
                    size={32}
                    style={{
                      display: isHovered || isDragActive ? 'block' : 'none',
                      margin: '0 1em'
                    }} />
                )}

              </div>
            ) : placeholder}</div>

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
                padding: .5em;
              }

              .file-details {
                display: flex;
                align-items: center;
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
            `}</style>
          </div>
        )
      }}
    </Dropzone>
  )
}

Holder.propTypes = {
  file: PropTypes.object,
  placeholder: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onDrop: PropTypes.func.isRequired
}

Holder.defaultProps = {
  file: null,
  isLoading: false
}

export default Holder
