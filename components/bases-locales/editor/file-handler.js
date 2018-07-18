import React from 'react'
import PropTypes from 'prop-types'

import Holder from '../../csv/holder'
import Section from '../../section'
import Notification from '../../notification'

class FileHandler extends React.Component {
  render() {
    const {file, error, onFileDrop} = this.props

    return (
      <Section>
        <div>
          <h2>Choisir un fichier</h2>
          <div className='container'>
            <Holder placeholder='Sélectionner ou glisser ici votre fichier BAL au format CSV (maximum 100 Mo)' file={file} onDrop={onFileDrop} />
          </div>
          {error && <Notification style={{marginTop: '1em'}} message={error} type='error' />}
        </div>
        <style jsx>{`
          .container {
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
      </Section>
    )
  }
}

FileHandler.propTypes = {
  file: PropTypes.object,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Error)
  ]),
  onFileDrop: PropTypes.func.isRequired
}

FileHandler.defaultProps = {
  file: null,
  error: null
}

export default FileHandler
