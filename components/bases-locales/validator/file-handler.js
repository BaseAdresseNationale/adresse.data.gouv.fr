import React from 'react'
import PropTypes from 'prop-types'

import InputForm from '../../input-form'
import Holder from '../../csv/holder'
import Notification from '../../notification'

class FileHandler extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    file: PropTypes.object,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Error)
    ]),
    isLoading: PropTypes.bool,
    onFileDrop: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
  }

  static defaultProps = {
    defaultValue: '',
    file: null,
    error: null,
    isLoading: false,
    onSubmit: null
  }

  state = {inputValue: this.props.defaultValue}

  handleSubmit = () => {
    const {inputValue} = this.state
    const {onSubmit} = this.props

    onSubmit(inputValue)
  }

  handleChange = inputValue => {
    this.setState({inputValue})
  }

  render() {
    const {inputValue} = this.state
    const {file, error, isLoading, onFileDrop} = this.props

    return (
      <>
        <div>
          <h2>Choisir un fichier</h2>

          <div className='file-handler-container'>
            <Holder
              placeholder='Sélectionner ou glisser ici votre fichier BAL au format CSV (maximum 10 Mo)'
              file={file}
              onDrop={onFileDrop}
            />
            {this.props.onSubmit && (
              <>
                <div className='else'>ou</div>
                <InputForm
                  placeholder='Entrer une url vers un fichier CSV'
                  value={inputValue}
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                  buttonText='Utiliser'
                  loading={isLoading}
                />
              </>
            )}
          </div>

          {error && (
            <Notification style={{marginTop: '1em'}} message={error} type='error' />
          )}
        </div>

        <style jsx>{`
          .file-handler-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .else {
            margin: 1em 0;
            font-weight: 600;
            font-size: larger;
          }
        `}</style>
      </>
    )
  }
}

export default FileHandler
