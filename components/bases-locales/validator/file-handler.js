import React from 'react'
import PropTypes from 'prop-types'

import Holder from '../../csv/holder'
import Notification from '../../notification'

class FileHandler extends React.Component {
  static propTypes = {
    file: PropTypes.object,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Error)
    ]),
    onFileDrop: PropTypes.func.isRequired
  }

  static defaultProps = {
    file: null,
    error: null
  }

  render() {
    const {file, error, onFileDrop} = this.props

    return (
      <>
        <div>
          <h2>Choisir un fichier</h2>

          <div className='file-handler-container'>
            <Holder
              placeholder='Sélectionner ou glisser ici votre fichier BAL au format CSV (maximum 100 Mo)'
              file={file}
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
