import React from 'react'
import PropTypes from 'prop-types'

import {geocodeCsv} from '../../lib/api-adresse'

import Button from '../button'
import Loader from '../loader'

function geocodedFileName(originalFileName = 'file') {
  if (originalFileName.toLowerCase().endsWith('.csv')) {
    originalFileName = originalFileName.slice(0, -4)
  }

  return originalFileName + '.geocoded.csv'
}

class Geocoder extends React.Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    filter: PropTypes.string
  }

  static defaultProps = {
    filter: null
  }

  state = {
    status: null,
    blob: null,
    error: null
  }

  handleGeocodeClick = async () => {
    const {file, columns, filter} = this.props
    const filters = []

    if (filter) {
      filters.push({
        name: 'citycode',
        value: filter
      })
    }

    this.setState({status: 'pending'})

    try {
      const blob = await geocodeCsv(file, filters, columns)
      this.setState({
        status: 'done',
        blob
      })
    } catch (error) {
      this.setState({
        status: null,
        error
      })
    }
  }

  render() {
    const {status, blob, error} = this.state
    const {file} = this.props

    return (
      <div className='geocoder'>
        {!status && (
          <Button onClick={this.handleGeocodeClick}>Lancer le géocodage</Button>
        )}

        {status === 'pending' && (
          <Button>
            <div className='col'>
              En cours de géocodage…
              <Loader size='small' />
            </div>
          </Button>
        )}

        {status === 'done' && (
          <a href={URL.createObjectURL(blob)} download={geocodedFileName(file.name)}>
            <Button>Télécharger</Button>
          </a>
        )}

        {error && (
          <p className='error'><b>{error.message}</b><br /><i>Code erreur : {error.httpCode}</i></p>
        )}

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

export default Geocoder
