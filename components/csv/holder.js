import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import {Plus, File} from 'react-feather'

function Holder({file, placeholder, onDrop}) {
  return (
    <Dropzone onDrop={onDrop} multiple={false}>
      {({getRootProps, getInputProps, isDragActive}) => {
        const rootProps = getRootProps()
        const inputProps = getInputProps()

        return (
          <div {...rootProps} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...inputProps} />
            <div className='drop-icon'>{file && !isDragActive ? <File size={72} /> : <Plus size={72} />}</div>
            <div>{file ? file.name : placeholder}</div>

            <style jsx>{`
              .dropzone {
                display: flex;
                flex-flow: column;
                justify-content: center;
                width: 100%;
                border: 1px dashed #ccc;
                height: 200px;
                text-align: center;
              }

              .dropzone:hover {
                cursor: pointer;
              }

              .active {
                background-color: #ebeff3;
              }

              .drop-icon {
                font-size: 72px;
                margin-bottom: 0.3em;
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
  onDrop: PropTypes.func.isRequired
}

Holder.defaultProps = {
  file: null
}

export default Holder
