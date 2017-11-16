import React from 'react'
import PropTypes from 'prop-types'
import 'whatwg-fetch'

import Button from '../button'
import Loader from '../loader'

class Geocoder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: props.file,
      columns: props.columns,
      status: null,
      url: null,
      error: null
    }
  }

  componentDidUpdate() {
    const {file, columns} = this.state

    if (this.props.file !== file || columns !== this.props.columns) {
      this.newFile()
    }
  }

  newFile() {
    this.setState({
      file: this.props.file,
      columns: this.props.columns,
      status: null,
      url: null,
      error: null
    })
  }

  geocodage() {
    const {file, columns} = this.props
    const data = new FormData()

    data.append('data', file)
    columns.map(column => data.append('columns', column))
    this.setState({status: 'pending', error: null})

    fetch('https://api-adresse.data.gouv.fr/search/csv', {
      method: 'POST',
      body: data
    })
    .then(response => {
      if (response.status === 200) {
        return response.blob()
      } else {
        throw new Error(response.statusText)
      }
    })
    .then(myBlob => {
      this.setState({
        status: 'done',
        url: URL.createObjectURL(myBlob)
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
    const {url, status, error} = this.state
    return (
      <div className='geocoder'>
        {!status && <Button onClick={() => this.geocodage()}>Lancer le géocadage</Button>}
        {status === 'pending' &&
          <Button>
            <div className='col'>
              En cours de géocodage…<Loader />
            </div>
          </Button>}
        {url &&
          <a href={url} download>
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
  columns: PropTypes.array.isRequired
}

export default Geocoder
