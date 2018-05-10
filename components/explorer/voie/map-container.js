import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {union} from 'lodash'

import theme from '../../../styles/theme'
import {_get} from '../../../lib/fetch'

import LoadingContent from '../../loading-content'
import Notification from '../../notification'

import Address from './address'

const AddressesMap = dynamic(import('./addresses-map'), {
  ssr: false,
  loading: () => (
    <LoadingContent loading centered>
      Chargement…
    </LoadingContent>
  )
})

class MapContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addrsAround: []
    }

    this.selectAddress = this.selectAddress.bind(this)
    this.getAddrsAround = this.getAddrsAround.bind(this)
  }

  selectAddress(feature) {
    const {onSelect} = this.props
    onSelect({numero: feature.properties.numero})
  }

  async getAddrsAround(bbox) {
    const {voie, addresses} = this.props
    const url = `https://sandbox.geo.api.gouv.fr/explore/${voie.codeCommune}/numeros?bbox=${bbox}`

    try {
      const results = await _get(url)
      this.setState(state => {
        const withoutVoie = results
          .filter(add => !addresses.find(address => address.id === add.id))

        return {addrsAround: union(withoutVoie, state.addrsAround)}
      })
    } catch (err) {
      this.setState({
        addrsAround: [],
        error: err
      })
    }
  }

  render() {
    const {addrsAround, error} = this.state
    const {voie, addresses, selected, onSelect} = this.props

    return (
      <div className='container'>
        {error ?
          <Notification type='error' message={error} /> :
          <div className='map'>
            <AddressesMap
              addresses={addresses}
              addrsAround={addrsAround}
              selectedAddress={selected}
              handleMove={this.getAddrsAround}
              handleSelect={this.selectAddress} />
          </div>
          }

        {selected &&
          <div className='selected-address'>
            <Address voie={voie} address={selected} onClose={onSelect} />
          </div>
        }

        <style jsx>{`
          .container {
            display: flex;
            flex-flow: wrap;
          }

          .map {
            height: 500px;
            min-height: 500px;
            width: ${selected ? '70%' : '100%'};
            border: 1px solid whitesmoke;
          }

          .selected-address {
            width: 30%;
            min-width: 200px;
            padding: 0 2em;
            display: block;
            overflow: scroll;
            height: 500px;
            box-shadow: 0 1px 4px ${theme.boxShadow};
          }

          @media (max-width: 900px) {
            .container {
              flex-direction: column;
            }

            .map {
              width: 100%;
              border: 1px solid whitesmoke;
            }

            .selected-address {
              width: 100%;
              height: 100%;
              padding: 0 2em;
              box-shadow: 0 1px 4px ${theme.boxShadow};
            }
          }
        `}</style>
      </div>
    )
  }
}

MapContainer.propTypes = {
  voie: PropTypes.object,
  addresses: PropTypes.array,
  selected: PropTypes.object,
  onSelect: PropTypes.func.isRequired
}

MapContainer.defaultProps = {
  addresses: null
}

export default MapContainer
