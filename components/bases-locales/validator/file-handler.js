import React from 'react'
import PropTypes from 'prop-types'

import Holder from '../../csv/holder'
import Notification from '../../notification'
import ValidatorSectionTitle from './validator-section-title'

class FileHandler extends React.Component {
  static propTypes = {
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
    file: null,
    error: null,
    isLoading: false,
    onSubmit: null
  }

  handleSubmit = () => {
    const {inputValue} = this.state
    const {onSubmit} = this.props

    onSubmit(inputValue)
  }

  handleChange = inputValue => {
    this.setState({inputValue})
  }

  render() {
    const {file, isLoading, error, onFileDrop} = this.props

    return (
      <>
        <div>
          {file ? <ValidatorSectionTitle>Votre fichier</ValidatorSectionTitle> : <ValidatorSectionTitle>Choisir un fichier</ValidatorSectionTitle> }

          <div className='file-handler-container'>
            <Holder
              placeholder='Sélectionner ou glisser ici votre fichier BAL au format CSV (maximum 50 Mo)'
              file={file}
              isLoading={isLoading}
              onDrop={onFileDrop}
            />
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
        `}</style>
      </>
    )
  }
}

export default FileHandler
