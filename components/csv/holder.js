import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import FaFile from 'react-icons/lib/fa/file'
import FaPlus from 'react-icons/lib/fa/plus'

import theme from '../../styles/theme'

// Unable to pass the css by className, maybe a react-dropzone bug ¯\_(ツ)_/¯
const style = {
  width: '100%',
  border: '1px dashed #ccc',
  height: '200px',
  textAlign: 'center'
}

class Holder extends React.Component {
  static propTypes = {
    file: PropTypes.object,
    placeholder: PropTypes.string.isRequired,
    onDrop: PropTypes.func.isRequired
  }

  static defaultProps = {
    file: null
  }

  state = {
    dropzoneActive: false
  }

  handleOnDragEnter = () => {
    this.setState({dropzoneActive: true})
  }

  handleOnDragLeave = () => {
    this.setState({dropzoneActive: false})
  }

  handleOnDrop = files => {
    const {onDrop} = this.props

    this.setState({dropzoneActive: false})
    onDrop(files)
  }

  render() {
    const {file, placeholder} = this.props
    const {dropzoneActive} = this.state

    return (
      <Dropzone
        onDragEnter={this.handleOnDragEnter}
        onDragLeave={this.handleOnDragLeave}
        onDrop={this.handleOnDrop}
        style={style}
        multiple={false}
      >

        <div className={`centered ${dropzoneActive ? 'dropzone-active' : ''}`}>
          <div>
            <div className='drop-icon'>{file && !dropzoneActive ? <FaFile /> : <FaPlus />}</div>
            <div>{file ? file.name : placeholder}</div>
          </div>
          <style jsx>{`
            .centered {
              display: flex;
              flex-flow: column;
              height: 100%;
              justify-content: center;
            }

            .centered .dropzone-active {
              background: ${theme.backgroundGrey}80;
            }

            .centered:hover {
              cursor: pointer;
            }

            .drop-icon {
              font-size: 72px;
              margin: 0.3em;
            }
          `}</style>
        </div>
      </Dropzone>
    )
  }
}

export default Holder
