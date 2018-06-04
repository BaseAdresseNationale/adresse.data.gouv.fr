import React from 'react'
import PropTypes from 'prop-types'

import InputForm from '../../input-form'
import Holder from '../../csv/holder'
import Section from '../../section'
import Notification from '../../notification'

class FileHandler extends React.Component {
  constructor(props) {
    super(props)
    this.state = {inputValue: props.defaultValue}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit() {
    const {inputValue} = this.state
    const {onSubmit} = this.props

    onSubmit(inputValue)
  }

  handleChange(inputValue) {
    this.setState({inputValue})
  }

  render() {
    const {inputValue} = this.state
    const {file, error, loading, onFileDrop} = this.props

    return (
      <Section>
        <div>
          <h2>Choisir un fichier</h2>
          <div className='container'>
            <Holder placeholder='Sélectionner ou glisser ici votre fichier BAL au format CSV (maximum 100 Mo)' file={file} onDrop={onFileDrop} />
            <div className='else'>ou</div>
            <InputForm placeholder='Entrer une url vers un fichier CSV' value={inputValue} onChange={this.handleChange} onSubmit={this.handleSubmit} buttonText='Utiliser' loading={loading} />
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
  defaultValue: PropTypes.string,
  file: PropTypes.object,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  loading: PropTypes.bool,
  onFileDrop: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

FileHandler.defaultProps = {
  defaultValue: '',
  file: null,
  error: null,
  loading: false
}

export default FileHandler
