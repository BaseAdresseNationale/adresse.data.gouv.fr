import React from 'react'
import PropTypes from 'prop-types'

import geocodeMany from '../../lib/geocode/many'

import Button from '../button'
import Loader from '../loader'

class Geocoder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      status: null,
      error: null,
      blob: null
    }

    this.handleGeocodeClick = this.handleGeocodeClick.bind(this)
  }

  componentWillReceiveProps() {
    this.setState({
      status: null,
      error: null,
      blob: null
    })
  }

  handleGeocodeClick() {
    const {file, columns, codeInsee, encoding} = this.props
    const filters = []

    if (codeInsee) {
      filters.push({
        name: 'citycode',
        value: codeInsee
      })
    }

    this.setState({status: 'pending'})

    geocodeMany(file, encoding, filters, columns)
      .then(resultBlob => {
        this.setState({
          status: 'done',
          blob: resultBlob
        })
      })
      .catch(err => {
        this.setState({
          status: null,
          error: err
        })
      })
  }

  render() {
    const {status, error, blob} = this.state
    const {file} = this.props

    return (
      <div className='geocoder'>
        {!status && <Button onClick={this.handleGeocodeClick}>Lancer le géocodage</Button>}
        {status === 'pending' &&
          <Button>
            <div className='col'>
              En cours de géocodage…<Loader />
            </div>
          </Button>}
        {blob &&
          <a href={URL.createObjectURL(blob)} download={geocodedFileName(file.name)}>
            <Button>Télécharger</Button>
          </a>
        }
        {error && <p className='error'>Une erreur est survenue: {error.message}</p>}
        <style jsx>{`
          .geocoder {
            margin: 2em 0;
            text-align: center;
          }

          .col {
            display: flex;
            align-items: center;
          }

          .error {
            color: red;
          }
          `}</style>
      </div>
    )
  }
}

Geocoder.propTypes = {
  file: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  encoding: PropTypes.string.isRequired,
  codeInsee: PropTypes.string
}

Geocoder.defaultProps = {
  codeInsee: null
}

function geocodedFileName(originalFileName = 'file') {
  if (originalFileName.toLowerCase().endsWith('.csv')) {
    originalFileName = originalFileName.substr(0, originalFileName.length - 4)
  }
  return originalFileName + '.geocoded.csv'
}

export default Geocoder
