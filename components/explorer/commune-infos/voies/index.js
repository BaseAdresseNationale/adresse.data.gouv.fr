import React from 'react'
import PropTypes from 'prop-types'

import api from '../../../../lib/api'

import LoadingContent from '../../../loading-content'
import VoiesTable from './voies-table'

class Voies extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      voies: [],
      loading: false,
      error: null
    }
  }

  componentDidMount() {
    this.getVoies()
  }

  async getVoies() {
    const {codeCommune} = this.props
    const baseUrl = 'https://sandbox.geo.api.gouv.fr/explore'
    const query = `/${codeCommune}`

    this.setState({loading: true, error: null})

    try {
      const result = await api(baseUrl, query)
      this.setState(state => {
        state.voies = result
      })
    } catch (err) {
      this.setState({
        error: err
      })
    }

    this.setState({loading: false})
  }

  render() {
    const {voies, loading, error} = this.state

    return (
      <div>
        <div className='head'>
          <h3>Voies de la commune</h3>
          <h5>{voies.length} voies répertoriées</h5>
        </div>

        <div className={loading ? 'loading' : ''}>
          <LoadingContent loading={loading} error={error}>
            <VoiesTable voies={voies} />
          </LoadingContent>
        </div>

        <style jsx>{`
            .head {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .loading {
              width: 100%;
              height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            `}</style>
      </div>
    )
  }
}

Voies.propTypes = {
  codeCommune: PropTypes.string.isRequired
}

export default Voies
