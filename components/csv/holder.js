import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import FaFile from 'react-icons/lib/fa/file'
import FaPlus from 'react-icons/lib/fa/plus'

class Holder extends React.Component {
  static propTypes = {
    file: PropTypes.object,
    placeholder: PropTypes.string.isRequired,
    onDrop: PropTypes.func.isRequired
  }

  static defaultProps = {
    file: null
  }

  onDrop = files => {
    const {onDrop} = this.props

    onDrop(files)
  }

  render() {
    const {file, placeholder} = this.props

    return (
      <Dropzone onDrop={this.onDrop} multiple={false}>
        {({getRootProps, getInputProps, isDragActive}) => {
          const rootProps = getRootProps()
          const inputProps = getInputProps()

          return (
            <div {...rootProps} className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}>
              <input {...inputProps} />
              <div className='drop-icon'>{file && !isDragActive ? <FaFile /> : <FaPlus />}</div>
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

                .dropzone-active {
                  background-color: #EBEFF380;
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
}

export default Holder
